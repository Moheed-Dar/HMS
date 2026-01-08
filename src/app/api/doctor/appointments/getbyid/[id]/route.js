// app/api/appointments/doctor-get/[id]/route.js
// GET: Doctor apni specific appointment ID se fetch kar sake

import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Appointment from "@/backend/models/Appointment";
import Doctor from "@/backend/models/Doctor";
import { verifyToken } from "@/backend/lib/jwt";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/6596/6596121.png";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    if (!id || id === "undefined") {
      return NextResponse.json(
        { success: false, message: "Appointment ID is required" },
        { status: 400 }
      );
    }

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

    // === ROLE CHECK ===
    if (role !== "doctor") {
      return NextResponse.json(
        { success: false, message: "Access denied: Only doctors can view appointments" },
        { status: 403 }
      );
    }

    // === DOCTOR CHECK ===
    const doctor = await Doctor.findById(userId).select("name specialization phone avatar status");
    if (!doctor || doctor.status !== "active") {
      return NextResponse.json(
        { success: false, message: "Doctor not found or inactive" },
        { status: 403 }
      );
    }

    // === FIND APPOINTMENT (must belong to this doctor + not deleted) ===
    const appointment = await Appointment.findOne({
      _id: id,
      doctor: userId,
      isDeleted: { $ne: true },
    })
      .populate("patient", "name email phone avatar dateOfBirth gender")
      .populate("doctor", "name specialization phone avatar")
      .populate("createdBy", "name")
      .lean();

    if (!appointment) {
      return NextResponse.json(
        { success: false, message: "Appointment not found or does not belong to you" },
        { status: 404 }
      );
    }

    // === SAFE PATIENT DATA (self-booked case mein patient null ho sakta hai) ===
    const patientData = appointment.patient
      ? {
          id: appointment.patient._id,
          name: appointment.patient.name,
          email: appointment.patient.email || null,
          phone: appointment.patient.phone || null,
          avatar: appointment.patient.avatar || DEFAULT_AVATAR,
          dateOfBirth: appointment.patient.dateOfBirth || null,
          gender: appointment.patient.gender || null,
        }
      : {
          id: null,
          name: "Self-Booked (No Patient)",
          email: null,
          phone: null,
          avatar: DEFAULT_AVATAR,
          dateOfBirth: null,
          gender: null,
        };

    // === CREATED BY FALLBACK ===
    const createdByData = appointment.createdBy
      ? { id: appointment.createdBy._id, name: appointment.createdBy.name }
      : { id: userId, name: doctor.name }; // Fallback to current doctor

    // === SUCCESS RESPONSE ===
    return NextResponse.json(
      {
        success: true,
        message: "Appointment fetched successfully",
        data: {
          appointment: {
            id: appointment._id,
            patient: patientData,
            doctor: {
              id: appointment.doctor._id,
              name: appointment.doctor.name,
              specialization: appointment.doctor.specialization,
              phone: appointment.doctor.phone,
              avatar: appointment.doctor.avatar || DEFAULT_AVATAR,
            },
            date: appointment.date,
            timeSlot: appointment.timeSlot,
            reason: appointment.reason || "",
            notes: appointment.notes || "",
            status: appointment.status,
            createdBy: createdByData,
            createdAt: appointment.createdAt,
            updatedAt: appointment.updatedAt || null,
          },
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Doctor Get Appointment By ID Error:", error);
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