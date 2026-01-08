// app/api/prescriptions/admin-get/route.js
// GET: Admin (with view_prescriptions permission) sab prescriptions dekh sake

import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Prescription from "@/backend/models/Prescription";
import Admin from "@/backend/models/Admin"; // ← Important: Admin model import karo
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

    // === CHECK IF USER IS ADMIN-TYPE (Admin ya SuperAdmin collection se) ===
    // Aapke system mein agar SuperAdmin alag model hai to usko bhi include kar lo
    const admin = await Admin.findById(userId).select("permissions status isDeleted");

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin not found" },
        { status: 404 }
      );
    }

    if (admin.isDeleted || admin.status !== "active") {
      return NextResponse.json(
        { success: false, message: "Admin account is inactive or deleted" },
        { status: 403 }
      );
    }

    // === PERMISSION CHECK: view_prescriptions honi chahiye ===
    if (!admin.permissions.includes("view_prescriptions")) {
      return NextResponse.json(
        { success: false, message: "Access denied: You don't have permission to view prescriptions" },
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
    const doctorId = searchParams.get("doctorId");

    const skip = (page - 1) * limit;

    // === BASE QUERY ===
    let query = { isDeleted: false };

    if (doctorId) query.doctor = doctorId;

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
      const pipeline = [
        { $match: query },
        { $lookup: { from: "patients", localField: "patient", foreignField: "_id", as: "patientData" } },
        { $lookup: { from: "doctors", localField: "doctor", foreignField: "_id", as: "doctorData" } },
        { $lookup: { from: "appointments", localField: "appointment", foreignField: "_id", as: "appointmentData" } },
        { $unwind: { path: "$patientData", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$doctorData", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$appointmentData", preserveNullAndEmptyArrays: true } },
        {
          $match: {
            $or: [
              { "patientData.name": { $regex: search, $options: "i" } },
              { "doctorData.name": { $regex: search, $options: "i" } },
              { "medicines.name": { $regex: search, $options: "i" } },
              { diagnosis: { $regex: search, $options: "i" } },
              { advice: { $regex: search, $options: "i" } },
            ]
          }
        },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            _id: 1,
            appointment: {
              id: "$appointmentData._id",
              date: "$appointmentData.date",
              timeSlot: "$appointmentData.timeSlot",
              status: "$appointmentData.status",
            },
            doctor: {
              id: "$doctorData._id",
              name: "$doctorData.name",
              specialization: "$doctorData.specialization",
            },
            patient: {
              id: "$patientData._id",
              name: "$patientData.name",
              email: "$patientData.email",
              phone: "$patientData.phone",
            },
            medicines: 1,
            diagnosis: 1,
            advice: 1,
            followUpDate: 1,
            createdAt: 1,
          }
        }
      ];

      prescriptions = await Prescription.aggregate(pipeline);
      const countPipeline = pipeline.slice(0, -4);
      countPipeline.push({ $count: "total" });
      const countResult = await Prescription.aggregate(countPipeline);
      total = countResult[0]?.total || 0;
    } else {
      prescriptions = await Prescription.find(query)
        .populate("patient", "name email phone")
        .populate("doctor", "name specialization")
        .populate("appointment", "date timeSlot status")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      total = await Prescription.countDocuments(query);
    }

    const formattedPrescriptions = prescriptions.map(pres => ({
      id: pres._id.toString(),
      appointment: pres.appointment ? {
        id: pres.appointment.id?.toString() || pres.appointment._id?.toString(),
        date: pres.appointment.date,
        timeSlot: pres.appointment.timeSlot,
        status: pres.appointment.status,
      } : null,
      doctor: {
        id: pres.doctor._id?.toString() || pres.doctor.id?.toString(),
        name: pres.doctor.name,
        specialization: pres.doctor.specialization || "General",
      },
      patient: {
        id: pres.patient._id?.toString() || pres.patient.id?.toString(),
        name: pres.patient.name || "Patient Not Found",
        email: pres.patient.email || null,
        phone: pres.patient.phone || null,
      },
      medicines: pres.medicines || [],
      diagnosis: pres.diagnosis || "",
      advice: pres.advice || "",
      followUpDate: pres.followUpDate,
      createdAt: pres.createdAt,
    }));

    return NextResponse.json(
      {
        success: true,
        message: "Prescriptions fetched successfully",
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
    console.error("Admin Get Prescriptions Error:", error);
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