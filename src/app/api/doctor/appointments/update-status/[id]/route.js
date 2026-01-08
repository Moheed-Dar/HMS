// app/api/appointments/my/[id]/status/route.js
// PATCH: Doctor apni appointment ka status update kar sake (pending, confirmed, completed, cancelled, no_show)

import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Appointment from "@/backend/models/Appointment";
import Doctor from "@/backend/models/Doctor";
import { verifyToken } from "@/backend/lib/jwt";

const ALLOWED_STATUSES = ["pending", "confirmed", "completed", "cancelled", "no_show"];

export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const { id } = await params; // Appointment ID

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

    // === ROLE CHECK: Sirf Doctor ===
    if (role !== "doctor") {
      return NextResponse.json(
        { success: false, message: "Access denied: Only doctors can update appointment status" },
        { status: 403 }
      );
    }

    // === DOCTOR EXISTENCE CHECK ===
    const doctor = await Doctor.findById(userId).select("name specialization status");
    if (!doctor || doctor.status !== "active") {
      return NextResponse.json(
        { success: false, message: "Doctor not found or inactive" },
        { status: 403 }
      );
    }

    // === PARSE BODY ===
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, message: "New status is required" },
        { status: 400 }
      );
    }

    if (!ALLOWED_STATUSES.includes(status.toLowerCase())) {
      return NextResponse.json(
        { success: false, message: `Invalid status. Allowed: ${ALLOWED_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    // === FIND APPOINTMENT ===
    const appointment = await Appointment.findOne({
      _id: id,
      doctor: userId, // Critical: Sirf apni appointment hi update kar sake
      isDeleted: { $ne: true },
    });

    if (!appointment) {
      return NextResponse.json(
        { success: false, message: "Appointment not found or not yours" },
        { status: 404 }
      );
    }

    // Optional: Prevent updating old/completed appointments
    if (["completed", "cancelled", "no_show"].includes(appointment.status)) {
      return NextResponse.json(
        { success: false, message: "Cannot update status of completed/cancelled/no-show appointment" },
        { status: 400 }
      );
    }

    // === UPDATE STATUS ===
    appointment.status = status.toLowerCase();
    appointment.updatedAt = new Date();
    // Optional: Track who updated (doctor)
    appointment.updatedBy = userId;
    appointment.updatedByModel = "Doctor";

    await appointment.save();

    // === POPULATE UPDATED APPOINTMENT FOR RESPONSE ===
    const populated = await Appointment.findById(appointment._id)
      .populate("patient", "name email phone avatar dateOfBirth gender")
      .populate("doctor", "name specialization phone")
      .populate("createdBy", "name email")
      .populate("updatedBy", "name") // Doctor ka name
      .lean();

    const patientData = populated.patient
      ? {
          id: populated.patient._id,
          name: populated.patient.name,
          email: populated.patient.email,
          phone: populated.patient.phone,
          avatar: populated.patient.avatar || "https://cdn-icons-png.flaticon.com/512/6596/6596121.png",
          dateOfBirth: populated.patient.dateOfBirth || null,
          gender: populated.patient.gender || null,
        }
      : { id: null, name: "Patient Not Found", email: null, phone: null, avatar: DEFAULT_AVATAR };

    // === SUCCESS RESPONSE ===
    return NextResponse.json(
      {
        success: true,
        message: `Appointment status updated to "${status}" successfully`,
        appointment: {
          id: populated._id,
          patient: patientData,
          doctor: {
            id: populated.doctor._id,
            name: populated.doctor.name,
            specialization: populated.doctor.specialization,
            phone: populated.doctor.phone,
          },
          date: populated.date,
          timeSlot: populated.timeSlot,
          reason: populated.reason || "",
          notes: populated.notes || "",
          status: populated.status,
          createdBy: populated.createdBy
            ? { name: populated.createdBy.name, email: populated.createdBy.email }
            : null,
          updatedBy: populated.updatedBy ? { name: populated.updatedBy.name } : null,
          createdAt: populated.createdAt,
          updatedAt: populated.updatedAt,
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Doctor Update Appointment Status Error:", error);
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