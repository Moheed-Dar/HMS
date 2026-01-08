// app/api/appointments/doctor-update/[id]/route.js
// PATCH: Doctor apni appointment update kar sake (date, timeSlot, reason, notes, status)

import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Appointment from "@/backend/models/Appointment";
import Doctor from "@/backend/models/Doctor";
import { verifyToken } from "@/backend/lib/jwt";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/6596/6596121.png";

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

    // === ROLE CHECK ===
    if (role !== "doctor") {
      return NextResponse.json(
        { success: false, message: "Access denied: Only doctors can update their appointments" },
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
    const { date, timeSlot, reason, notes, status } = body;

    if (Object.keys(body).length === 0) {
      return NextResponse.json(
        { success: false, message: "No data provided to update" },
        { status: 400 }
      );
    }

    // === FIND APPOINTMENT (Sirf apni) ===
    const appointment = await Appointment.findOne({
      _id: id,
      doctor: userId,
      isDeleted: { $ne: true },
    });

    if (!appointment) {
      return NextResponse.json(
        { success: false, message: "Appointment not found or not yours" },
        { status: 404 }
      );
    }

    // === BUILD UPDATE FIELDS ===
    const updateFields = {};
    let checkAvailability = false;

    if (date !== undefined) {
      const newDate = new Date(date);
      if (isNaN(newDate.getTime())) {
        return NextResponse.json({ success: false, message: "Invalid date format" }, { status: 400 });
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (newDate < today) {
        return NextResponse.json({ success: false, message: "Cannot update to a past date" }, { status: 400 });
      }
      updateFields.date = newDate;
      checkAvailability = true;
    }

    if (timeSlot !== undefined) {
      if (!timeSlot?.trim()) {
        return NextResponse.json({ success: false, message: "Time slot cannot be empty" }, { status: 400 });
      }
      updateFields.timeSlot = timeSlot.trim();
      checkAvailability = true;
    }

    if (reason !== undefined) updateFields.reason = reason?.trim() || "";
    if (notes !== undefined) updateFields.notes = notes?.trim() || "";
    if (status !== undefined) {
      const allowed = ["scheduled", "pending", "confirmed", "completed", "cancelled", "no_show"];
      if (!allowed.includes(status.toLowerCase())) {
        return NextResponse.json({ success: false, message: "Invalid status" }, { status: 400 });
      }
      updateFields.status = status.toLowerCase();
    }

    // Always track update
    updateFields.updatedBy = userId;
    updateFields.updatedByModel = "Doctor";
    updateFields.updatedAt = new Date();

    // === CHECK TIME SLOT AVAILABILITY (if date or timeSlot changed) ===
    if (checkAvailability) {
      const checkQuery = {
        doctor: userId,
        date: updateFields.date || appointment.date,
        timeSlot: updateFields.timeSlot || appointment.timeSlot,
        _id: { $ne: id }, // Exclude current appointment
        isDeleted: { $ne: true },
      };

      const conflict = await Appointment.findOne(checkQuery);
      if (conflict) {
        return NextResponse.json(
          { success: false, message: "This time slot is already booked for you" },
          { status: 409 }
        );
      }
    }

    // === UPDATE APPOINTMENT ===
    Object.assign(appointment, updateFields);
    await appointment.save();

    // === POPULATE UPDATED DATA ===
    const populated = await Appointment.findById(appointment._id)
      .populate("patient", "name email phone avatar dateOfBirth gender")
      .populate("doctor", "name specialization phone avatar")
      .populate({
        path: "createdBy",
        select: "name",
        model: "Doctor"
      })
      .populate({
        path: "updatedBy",
        select: "name",
        model: "Doctor"
      })
      .lean();

    // === SAFE DATA ===
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
      : { id: null, name: "Patient Not Found" };

    const createdByData = populated.createdBy
      ? { id: populated.createdBy._id, name: populated.createdBy.name }
      : { id: userId, name: doctor.name };

    const updatedByData = populated.updatedBy
      ? { id: populated.updatedBy._id, name: populated.updatedBy.name }
      : { id: userId, name: doctor.name };

    // === SUCCESS RESPONSE ===
    return NextResponse.json(
      {
        success: true,
        message: "Appointment updated successfully",
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
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Doctor Update Appointment Error:", error);
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