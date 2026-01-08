// app/api/appointments/create/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Appointment from "@/backend/models/Appointment";
import Admin from "@/backend/models/Admin";
import { verifyToken } from "@/backend/lib/jwt";

export async function POST(request) {
  try {
    await connectDB();

    // Token cookie se le rahe hain
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Login required" },
        { status: 401 }
      );
    }

    const verification = verifyToken(token);
    if (!verification.valid) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Admin fetch karo with permissions
    const admin = await Admin.findById(verification.decoded.id).select(
      "name permissions status"
    );

    if (!admin || admin.status !== "active") {
      return NextResponse.json(
        { success: false, message: "Admin not found or inactive" },
        { status: 403 }
      );
    }

    // Permission check
    if (!admin.permissions.includes("appointments_create")) {
      return NextResponse.json(
        { success: false, message: "Permission denied: You cannot create appointments" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { patient, doctor, date, timeSlot, reason, notes, status } = body;

    // Required fields validation (schema ke mutabiq)
    if (!patient) return NextResponse.json({ success: false, message: "Patient ID is required" }, { status: 400 });
    if (!doctor) return NextResponse.json({ success: false, message: "Doctor ID is required" }, { status: 400 });
    if (!date) return NextResponse.json({ success: false, message: "Date is required" }, { status: 400 });
    if (!timeSlot?.trim()) return NextResponse.json({ success: false, message: "Time slot is required" }, { status: 400 });

    // Date validation
    const appointmentDate = new Date(date);
    if (isNaN(appointmentDate.getTime())) {
      return NextResponse.json({ success: false, message: "Invalid date format" }, { status: 400 });
    }

    // Optional: Prevent past dates (today allowed)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (appointmentDate < today) {
      return NextResponse.json({ success: false, message: "Cannot book appointment in the past" }, { status: 400 });
    }

    // Check doctor availability (same date + same timeSlot)
    const existing = await Appointment.findOne({
      doctor,
      date: appointmentDate,
      timeSlot: timeSlot.trim(),
      isDeleted: false,
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Doctor is already booked for this time slot" },
        { status: 409 }
      );
    }

    // Create appointment
    const newAppointment = await Appointment.create({
      patient,
      doctor,
      date: appointmentDate,
      timeSlot: timeSlot.trim(),
      reason: reason?.trim() || "",
      notes: notes?.trim() || "",
      status: status || "scheduled",
      createdBy: admin._id,
    });

    // Populate important fields for clean response
    const populated = await Appointment.findById(newAppointment._id)
      .populate("patient", "name email phone")
      .populate("doctor", "name specialization phone")
      .populate("createdBy", "name email employeeId");

    return NextResponse.json(
      {
        success: true,
        message: "Appointment created successfully!",
        data: {
          appointment: {
            id: populated._id,
            patient: populated.patient,
            doctor: populated.doctor,
            date: populated.date,
            timeSlot: populated.timeSlot,
            status: populated.status,
            reason: populated.reason,
            notes: populated.notes,
            createdBy: populated.createdBy,        // ← Yahan name aur email aayega
            createdAt: populated.createdAt,        // ← Exact time jab create hua
            updatedAt: populated.updatedAt,
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Appointment Error:", error);
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