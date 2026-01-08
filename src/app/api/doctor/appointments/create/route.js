// app/api/appointments/doctor-create/route.js
// POST: Doctor khud apni appointment create kar sake

import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Appointment from "@/backend/models/Appointment";
import Doctor from "@/backend/models/Doctor";
import Patient from "@/backend/models/Patient"; // Patient validate ke liye
import { verifyToken } from "@/backend/lib/jwt";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/6596/6596121.png";

export async function POST(request) {
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

    // === ROLE CHECK ===
    if (role !== "doctor") {
      return NextResponse.json(
        { success: false, message: "Access denied: Only doctors can create appointments" },
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

    // === PARSE BODY ===
    const body = await request.json();
    const { patient, date, timeSlot, reason, notes, status } = body;

    if (!patient) return NextResponse.json({ success: false, message: "Patient ID is required" }, { status: 400 });
    if (!date) return NextResponse.json({ success: false, message: "Date is required" }, { status: 400 });
    if (!timeSlot?.trim()) return NextResponse.json({ success: false, message: "Time slot is required" }, { status: 400 });

    // Validate Patient exists
    const patientExists = await Patient.findById(patient);
    if (!patientExists) {
      return NextResponse.json({ success: false, message: "Patient not found" }, { status: 404 });
    }

    // Date validation
    const appointmentDate = new Date(date);
    if (isNaN(appointmentDate.getTime())) {
      return NextResponse.json({ success: false, message: "Invalid date format" }, { status: 400 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (appointmentDate < today) {
      return NextResponse.json({ success: false, message: "Cannot book appointment in the past" }, { status: 400 });
    }

    // Check availability
    const existing = await Appointment.findOne({
      doctor: userId,
      date: appointmentDate,
      timeSlot: timeSlot.trim(),
      isDeleted: { $ne: true },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "You already have an appointment in this time slot" },
        { status: 409 }
      );
    }

    // === CREATE APPOINTMENT ===
    const newAppointment = await Appointment.create({
      patient,
      doctor: userId,
      date: appointmentDate,
      timeSlot: timeSlot.trim(),
      reason: reason?.trim() || "",
      notes: notes?.trim() || "",
      status: status || "scheduled",
      createdBy: userId,
      createdByModel: "Doctor", // Important for refPath if using
    });

    // === POPULATE SAFELY ===
    const populated = await Appointment.findById(newAppointment._id)
      .populate("patient", "name email phone avatar dateOfBirth gender")
      .populate("doctor", "name specialization phone avatar")
      .populate({
        path: "createdBy",
        select: "name",
        model: "Doctor" // Explicitly tell Mongoose to use Doctor model
      })
      .lean();

    // === SAFE DATA EXTRACTION (No Crash Even If Null) ===
    const patientData = populated.patient
      ? {
          id: populated.patient._id,
          name: populated.patient.name,
          email: populated.patient.email,
          phone: populated.patient.phone,
          avatar: populated.patient.avatar || DEFAULT_AVATAR,
          dateOfBirth: populated.patient.dateOfBirth || null,
          gender: populated.patient.gender || null,
        }
      : { id: null, name: "Patient Not Found", email: null, phone: null, avatar: DEFAULT_AVATAR };

    const createdByData = populated.createdBy
      ? { id: populated.createdBy._id, name: populated.createdBy.name }
      : { id: userId, name: doctor.name }; // Fallback to logged-in doctor

    // === SUCCESS RESPONSE ===
    return NextResponse.json(
      {
        success: true,
        message: "Appointment created successfully by you!",
        data: {
          appointment: {
            id: populated._id,
            patient: patientData,
            doctor: {
              id: populated.doctor._id,
              name: populated.doctor.name,
              specialization: populated.doctor.specialization,
              phone: populated.doctor.phone,
              avatar: populated.doctor.avatar || DEFAULT_AVATAR,
            },
            date: populated.date,
            timeSlot: populated.timeSlot,
            reason: populated.reason,
            notes: populated.notes,
            status: populated.status,
            createdBy: createdByData,
            createdAt: populated.createdAt,
          },
        },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Doctor Create Appointment Error:", error);
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