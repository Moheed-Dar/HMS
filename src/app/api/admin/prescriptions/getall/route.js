
import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Prescription from "@/backend/models/Prescription";
import Admin from "@/backend/models/Admin";
import Appointment from "@/backend/models/Appointment";
import Doctor from "@/backend/models/Doctor"; 
import { verifyToken } from "@/backend/lib/jwt";

export async function GET(request) {
  try {
    await connectDB();

    // === TOKEN VERIFICATION ===
    const token =
      request.cookies.get("token")?.value ||
      request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ success: false, message: "Login required" }, { status: 401 });
    }

    const verification = verifyToken(token);
    if (!verification.valid || !verification.decoded) {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
    }

    const { id: userId, role } = verification.decoded;

    // === ADMIN CHECK ===
    const admin = await Admin.findById(userId).select("permissions status isDeleted");
    if (!admin) {
      return NextResponse.json({ success: false, message: "Admin not found" }, { status: 404 });
    }

    if (admin.isDeleted || admin.status !== "active") {
      return NextResponse.json({ success: false, message: "Admin account inactive or deleted" }, { status: 403 });
    }

    if (!admin.permissions?.includes("view_prescriptions")) {
      return NextResponse.json(
        { success: false, message: "Access denied: No view_prescriptions permission" },
        { status: 403 }
      );
    }

    // === QUERY PARAMS ===
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

    let prescriptions = [];
    let total = 0;

    if (search) {
      // === AGGREGATION FOR SEARCH ===
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
        {
          $lookup: {
            from: "doctors",
            localField: "doctor",
            foreignField: "_id",
            as: "doctorData",
          },
        },
        {
          $lookup: {
            from: "appointments",
            localField: "appointment",
            foreignField: "_id",
            as: "appointmentData",
          },
        },
        {
          $lookup: {
            from: "doctors",
            localField: "updatedBy",
            foreignField: "_id",
            as: "updatedByData",
          },
        },
        { $unwind: { path: "$patientData", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$doctorData", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$appointmentData", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$updatedByData", preserveNullAndEmptyArrays: true } },
        {
          $match: {
            $or: [
              { "patientData.name": { $regex: search, $options: "i" } },
              { "doctorData.name": { $regex: search, $options: "i" } },
              { "medicines.name": { $regex: search, $options: "i" } },
              { diagnosis: { $regex: search, $options: "i" } },
              { advice: { $regex: search, $options: "i" } },
            ],
          },
        },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            _id: 1,
            appointment: "$appointmentData",
            doctor: "$doctorData",
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

      // Count for pagination
      const countPipeline = [...pipeline.slice(0, pipeline.length - 5), { $count: "total" }];
      const countResult = await Prescription.aggregate(countPipeline);
      total = countResult[0]?.total || 0;
    } else {
      // Normal find + populate (faster when no search)
      prescriptions = await Prescription.find(query)
        .populate("patient", "name email phone")
        .populate("doctor", "name specialization")
        .populate("appointment", "date timeSlot status")
        .populate("updatedBy", "name email role")   // ← UPDATED BY POPULATE
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      total = await Prescription.countDocuments(query);
    }

    // === SAFE FORMATTING (null-safe) ===
    const formattedPrescriptions = prescriptions.map((pres) => ({
      id: pres._id.toString(),
      appointment: pres.appointment
        ? {
            id: pres.appointment._id?.toString(),
            date: pres.appointment.date,
            timeSlot: pres.appointment.timeSlot,
            status: pres.appointment.status,
          }
        : null,
      doctor: pres.doctor
        ? {
            id: pres.doctor._id?.toString(),
            name: pres.doctor.name || "Unknown Doctor",
            specialization: pres.doctor.specialization || "General",
          }
        : null,
      patient: pres.patient
        ? {
            id: pres.patient._id?.toString(),
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
            name: pres.updatedBy.name || "Unknown",
            email: pres.updatedBy.email || null,
            role: pres.updatedBy.role || null,
          }
        : null,
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