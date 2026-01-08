// app/api/appointments/doctor-delete/[id]/route.js
// DELETE: Doctor apni koi bhi appointment PERMANENTLY delete kar sake

import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Appointment from "@/backend/models/Appointment";
import Doctor from "@/backend/models/Doctor";
import { verifyToken } from "@/backend/lib/jwt";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/6596/6596121.png";

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    // Fix: params await ki zarurat nahi
    const { id: appointmentId } = await params;

    if (!appointmentId || appointmentId.length !== 24) {
      return NextResponse.json(
        { success: false, message: "Invalid Appointment ID" },
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

    if (role !== "doctor") {
      return NextResponse.json(
        { success: false, message: "Access denied: Only doctors can delete appointments" },
        { status: 403 }
      );
    }

    // === DOCTOR CHECK + OPTIONAL PERMISSION ===
    const doctor = await Doctor.findById(userId).select("name status permissions");
    if (!doctor) {
      return NextResponse.json(
        { success: false, message: "Doctor not found" },
        { status: 403 }
      );
    }

    if (doctor.status !== "active") {
      return NextResponse.json(
        { success: false, message: "Your account is inactive" },
        { status: 403 }
      );
    }

    // Optional: Agar aap permission system use kar rahe hain
    if (!doctor.permissions?.includes("delete_appointments")) {
      return NextResponse.json(
        { success: false, message: "Permission denied: You don't have delete_appointment permission" },
        { status: 403 }
      );
    }

    // === FIND APPOINTMENT WITH POPULATE (previous data ke liye) ===
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      doctor: userId,
    })
      .populate("patient", "name email phone avatar")
      .populate("doctor", "name specialization phone avatar")
      .lean();

    if (!appointment) {
      return NextResponse.json(
        { success: false, message: "Appointment not found or does not belong to you" },
        { status: 404 }
      );
    }

    // Prevent deletion of completed appointments
    if (appointment.status === "completed") {
      return NextResponse.json(
        { success: false, message: "Cannot delete a completed appointment" },
        { status: 400 }
      );
    }

    // === PERMANENT DELETE (Hard Delete) ===
    await Appointment.deleteOne({ _id: appointmentId });

    const deletedAt = new Date();

    // Prepare patient data
    const patientData = appointment.patient
      ? {
          id: appointment.patient._id,
          name: appointment.patient.name,
          email: appointment.patient.email || null,
          phone: appointment.patient.phone || null,
          avatar: appointment.patient.avatar || DEFAULT_AVATAR,
        }
      : { id: null, name: "Self-booked (No Patient)" };

    // === SUCCESS RESPONSE (Prescription delete jaisa) ===
    return NextResponse.json(
      {
        success: true,
        message: "Appointment permanently deleted successfully",
        data: {
          appointmentId: appointmentId,
          deletedBy: {
            id: doctor._id,
            name: doctor.name,
            model: "Doctor"
          },
          deletedByModel: "Doctor",
          deletedAt: deletedAt.toISOString(),
          previousData: {
            patient: patientData,
            doctor: {
              id: appointment.doctor._id,
              name: appointment.doctor.name,
              specialization: appointment.doctor.specialization || null,
              phone: appointment.doctor.phone || null,
              avatar: appointment.doctor.avatar || DEFAULT_AVATAR,
            },
            date: appointment.date,
            timeSlot: appointment.timeSlot,
            reason: appointment.reason || "",
            notes: appointment.notes || "",
            status: appointment.status,
            createdAt: appointment.createdAt,
          },
          note: "This appointment has been permanently removed from the database and cannot be recovered."
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Doctor Permanent Delete Appointment Error:", error);
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