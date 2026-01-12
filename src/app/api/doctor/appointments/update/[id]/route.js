// app/api/appointments/doctor-update/[id]/route.js
// PATCH: Doctor apni appointment ko ID se update kar sake (URL mein ID)

import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Appointment from "@/backend/models/Appointment";
import Doctor from "@/backend/models/Doctor";
import Patient from "@/backend/models/Patient";
import { verifyToken } from "@/backend/lib/jwt";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/6596/6596121.png";

export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const { id: appointmentId } =  await params; // ← YEH URL SE ID LE RAHA HAI

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
        { success: false, message: "Access denied: Only doctors allowed" },
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

    // === VALIDATE appointmentId from URL ===
    if (!appointmentId || typeof appointmentId !== "string" || appointmentId.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Invalid Appointment ID in URL" },
        { status: 400 }
      );
    }

    // === FIND APPOINTMENT (must belong to this doctor) ===
    const appointment = await Appointment.findOne({
      _id: appointmentId.trim(),
      doctor: userId,
      isDeleted: { $ne: true },
    });

    if (!appointment) {
      return NextResponse.json(
        { success: false, message: "Appointment not found or you don't have permission to update it" },
        { status: 404 }
      );
    }

    // === PARSE BODY (only update fields) ===
    const body = await request.json();
    const { patient, date, timeSlot, reason, notes, status } = body;

    const updates = {};
    let hasChanges = false;

    // Patient update
    if (patient !== undefined) {
      if (!patient || patient.toString().trim() === "") {
        return NextResponse.json(
          { success: false, message: "Patient ID cannot be empty" },
          { status: 400 }
        );
      }
      const patientExists = await Patient.findById(patient);
      if (!patientExists) {
        return NextResponse.json(
          { success: false, message: "Patient not found" },
          { status: 404 }
        );
      }
      updates.patient = patient;
      hasChanges = true;
    }

    // Date update
    let newDate = appointment.date;
    if (date !== undefined) {
      newDate = new Date(date);
      if (isNaN(newDate.getTime())) {
        return NextResponse.json(
          { success: false, message: "Invalid date format" },
          { status: 400 }
        );
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (newDate < today) {
        return NextResponse.json(
          { success: false, message: "Cannot set appointment date in the past" },
          { status: 400 }
        );
      }
      updates.date = newDate;
      hasChanges = true;
    }

    // TimeSlot update
    let newTimeSlot = appointment.timeSlot;
    if (timeSlot !== undefined) {
      if (!timeSlot?.trim()) {
        return NextResponse.json(
          { success: false, message: "Time slot cannot be empty" },
          { status: 400 }
        );
      }
      newTimeSlot = timeSlot.trim();
      updates.timeSlot = newTimeSlot;
      hasChanges = true;
    }

    // Conflict check if date/time changing
    if (date !== undefined || timeSlot !== undefined) {
      const conflict = await Appointment.findOne({
        _id: { $ne: appointment._id },
        doctor: userId,
        date: newDate,
        timeSlot: newTimeSlot,
        isDeleted: { $ne: true },
      });

      if (conflict) {
        return NextResponse.json(
          { success: false, message: "This date and time slot is already booked" },
          { status: 409 }
        );
      }
    }

    // Other fields
    if (reason !== undefined) {
      updates.reason = reason?.trim() || "";
      hasChanges = true;
    }
    if (notes !== undefined) {
      updates.notes = notes?.trim() || "";
      hasChanges = true;
    }
    if (status !== undefined) {
      updates.status = status || "scheduled";
      hasChanges = true;
    }

    if (!hasChanges) {
      return NextResponse.json(
        { success: false, message: "No fields provided to update" },
        { status: 400 }
      );
    }

    // Audit fields
    updates.updatedBy = userId;
    updates.updatedByModel = "Doctor";
    updates.updatedAt = new Date();

    Object.assign(appointment, updates);
    await appointment.save();

    // === POPULATE ===
    const populated = await Appointment.findById(appointment._id)
      .populate("patient", "name email phone avatar dateOfBirth gender")
      .populate("doctor", "name specialization phone avatar")
      .populate({ path: "createdBy", select: "name", model: "Doctor" })
      .populate({ path: "updatedBy", select: "name", model: "Doctor" })
      .lean();

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
      : { id: null, name: "Patient Not Found", avatar: DEFAULT_AVATAR };

    const createdByData = populated.createdBy
      ? { id: populated.createdBy._id, name: populated.createdBy.name }
      : { id: userId, name: doctor.name };

    const updatedByData = populated.updatedBy
      ? { id: populated.updatedBy._id, name: populated.updatedBy.name }
      : { id: userId, name: doctor.name };

    return NextResponse.json({
      success: true,
      message: "Appointment updated successfully!",
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
          updatedBy: updatedByData,
          createdAt: populated.createdAt,
          updatedAt: populated.updatedAt,
        },
      },
    });

  } catch (error) {
    console.error("Doctor PATCH by ID Error:", error);
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