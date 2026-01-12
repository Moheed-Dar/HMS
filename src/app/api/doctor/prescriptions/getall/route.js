// app/api/doctor/prescriptions/get-permitted/route.js
// GET: Doctors with "view_prescription" permission can see their own + shared prescriptions

import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Prescription from "@/backend/models/Prescription";
import Doctor from "@/backend/models/Doctor";
import Patient from "@/backend/models/Patient";
import Appointment from "@/backend/models/Appointment";
import { verifyToken } from "@/backend/lib/jwt";

export async function GET(request) {
  try {
    await connectDB();

    // === TOKEN VERIFICATION ===
    const token =
      request.cookies.get("token")?.value ||
      request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Login required" },
        { status: 401 }
      );
    }

    const verification = verifyToken(token);
    if (!verification.valid || !verification.decoded) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const { id: userId, role } = verification.decoded;

    if (role !== "doctor") {
      return NextResponse.json(
        { success: false, message: "Access denied: Only doctors allowed" },
        { status: 403 }
      );
    }

    // === DOCTOR FETCH WITH PERMISSIONS ===
    const doctor = await Doctor.findById(userId).select("name specialization status permissions");
    if (!doctor) {
      return NextResponse.json(
        { success: false, message: "Doctor not found" },
        { status: 404 }
      );
    }

    if (doctor.status !== "active") {
      return NextResponse.json(
        { success: false, message: "Your account is inactive" },
        { status: 403 }
      );
    }

    // === CRITICAL: view_prescription PERMISSION CHECK ===
    if (!doctor.permissions?.includes("view_prescription")) {
      return NextResponse.json(
        {
          success: false,
          message: "Permission denied: You don't have permission to view prescriptions",
        },
        { status: 403 }
      );
    }

    // === QUERY PARAMETERS ===
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit")) || 10));
    const search = searchParams.get("search")?.trim() || "";
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const skip = (page - 1) * limit;

    // === STRICT ACCESS QUERY: Sirf allowed prescriptions ===
    let query = {
      isDeleted: false,
      $or: [
        { doctor: userId },                    // Apni banayi hui
        { viewPermissions: userId }            // Shared with this doctor (assuming field exists)
      ],
    };

    // Date filter
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);
        query.createdAt.$lte = toDate;
      }
    }

    let prescriptions;
    let total;

    if (search) {
      const searchRegex = { $regex: search, $options: "i" };

      const pipeline = [
        { $match: query },
        {
          $lookup: {
            from: "patients",
            localField: "patient",
            foreignField: "_id",
            as: "patientData",
          },
        },
        { $unwind: { path: "$patientData", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "appointments",
            localField: "appointment",
            foreignField: "_id",
            as: "appointmentData",
          },
        },
        { $unwind: { path: "$appointmentData", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "doctors",
            localField: "updatedBy",
            foreignField: "_id",
            as: "updatedByData",
          },
        },
        { $unwind: { path: "$updatedByData", preserveNullAndEmptyArrays: true } },
        {
          $match: {
            $or: [
              { "patientData.name": searchRegex },
              { "medicines.name": searchRegex },
              { diagnosis: searchRegex },
            ],
          },
        },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            appointment: "$appointmentData",
            patient: "$patientData",
            updatedBy: "$updatedByData",
            medicines: 1,
            diagnosis: 1,
            advice: 1,
            followUpDate: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
      ];

      prescriptions = await Prescription.aggregate(pipeline);

      const countPipeline = pipeline.slice(0, -5); // remove last project + lookup + unwind
      countPipeline.push({ $count: "total" });
      const countResult = await Prescription.aggregate(countPipeline);
      total = countResult[0]?.total || 0;
    } else {
      prescriptions = await Prescription.find(query)
        .populate("patient", "name email phone")
        .populate("appointment", "date timeSlot status")
        .populate("updatedBy", "name email role")   // ← updatedBy populate
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      total = await Prescription.countDocuments(query);
    }

    // === FORMAT RESPONSE ===
    const formattedPrescriptions = prescriptions.map((pres) => ({
      id: pres._id.toString(),
      appointment: pres.appointment
        ? {
            id: (pres.appointment._id || pres.appointment.id)?.toString(),
            date: pres.appointment.date,
            timeSlot: pres.appointment.timeSlot,
            status: pres.appointment.status,
          }
        : null,
      patient: pres.patient
        ? {
            id: (pres.patient._id || pres.patient.id)?.toString(),
            name: pres.patient.name || "Patient Not Found",
            email: pres.patient.email || null,
            phone: pres.patient.phone || null,
          }
        : null,
      medicines: pres.medicines || [],
      diagnosis: pres.diagnosis || "",
      advice: pres.advice || "",
      followUpDate: pres.followUpDate || null,
      createdAt: pres.createdAt,
      updatedAt: pres.updatedAt,

      // === UPDATED BY INFO ===
      updatedBy: pres.updatedBy
        ? {
            id: pres.updatedBy._id?.toString(),
            name: pres.updatedBy.name || "Unknown Doctor",
            email: pres.updatedBy.email || null,
            role: pres.updatedBy.role || "doctor",
          }
        : null,
    }));

    return NextResponse.json(
      {
        success: true,
        message: "Prescriptions fetched successfully",
        doctor: {
          id: doctor._id.toString(),
          name: doctor.name,
          specialization: doctor.specialization,
        },
        prescriptions: formattedPrescriptions,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalPrescriptions: total,
          limit,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Doctor Get Permitted Prescriptions Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: process.env.NODE_ENV === "development" ? error.message : "Something went wrong",
      },
      { status: 500 }
    );
  }
}