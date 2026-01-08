// app/api/appointments/my/route.js
// GET: Doctor ki apni saari appointments fetch karega (sirf us doctor ki jo login hai)

import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Appointment from "@/backend/models/Appointment";
import Doctor from "@/backend/models/Doctor";
import { verifyToken } from "@/backend/lib/jwt";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/6596/6596121.png";

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

    // === ROLE CHECK: Sirf Doctor ===
    if (role !== "doctor") {
      return NextResponse.json(
        { success: false, message: "Access denied: Only doctors can view their appointments" },
        { status: 403 }
      );
    }

    // === DOCTOR CHECK ===
    const doctor = await Doctor.findById(userId).select("name specialization status");
    if (!doctor || doctor.status !== "active") {
      return NextResponse.json(
        { success: false, message: "Doctor not found or inactive" },
        { status: 403 }
      );
    }

    // === QUERY PARAMS ===
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const status = searchParams.get("status") || "";
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    const skip = (page - 1) * limit;

    // === BUILD QUERY ===
    let query = {
      doctor: userId,
      isDeleted: { $ne: true }, // Safe soft delete check
    };

    if (status) query.status = status;
    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) query.date.$gte = new Date(dateFrom);
      if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);
        query.date.$lte = toDate;
      }
    }

    // === FETCH APPOINTMENTS ===
    const appointments = await Appointment.find(query)
      .populate("patient", "name email phone avatar dateOfBirth gender")
      .populate("createdBy", "name email")
      .sort({ date: 1, timeSlot: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Appointment.countDocuments(query);

    // === SAFE FORMAT RESPONSE (No Crash Even If Patient Is Null) ===
    const appointmentsList = appointments.map((appt) => {
      const patientData = appt.patient
        ? {
            id: appt.patient._id,
            name: appt.patient.name || "Unknown Patient",
            email: appt.patient.email || null,
            phone: appt.patient.phone || null,
            avatar: appt.patient.avatar?.trim() || DEFAULT_AVATAR,
            dateOfBirth: appt.patient.dateOfBirth || null,
            gender: appt.patient.gender || null,
          }
        : {
            id: null,
            name: "Patient Not Found (Possibly Deleted)",
            email: null,
            phone: null,
            avatar: DEFAULT_AVATAR,
            dateOfBirth: null,
            gender: null,
          };

      return {
        id: appt._id,
        patient: patientData,
        date: appt.date,
        timeSlot: appt.timeSlot,
        reason: appt.reason || "",
        notes: appt.notes || "",
        status: appt.status,
        createdBy: appt.createdBy
          ? { name: appt.createdBy.name, email: appt.createdBy.email }
          : { name: "Unknown Admin", email: null },
        createdAt: appt.createdAt,
      };
    });

    // === SUCCESS RESPONSE ===
    return NextResponse.json(
      {
        success: true,
        message: "Your appointments fetched successfully",
        doctor: {
          id: doctor._id,
          name: doctor.name,
          specialization: doctor.specialization,
        },
        appointments: appointmentsList,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalAppointments: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Doctor My Appointments Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}