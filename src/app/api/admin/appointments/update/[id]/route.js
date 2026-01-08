// app/api/appointments/[id]/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Appointment from "@/backend/models/Appointment";
import Admin from "@/backend/models/Admin";
import { verifyToken } from "@/backend/lib/jwt";

export async function PUT(request, { params }) {
  try {
    await connectDB();

    // SAFE WAY: params se id extract karo (Next.js App Router mein safe tareeka)
    const { id } = await params || {};

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Appointment ID is missing in URL" },
        { status: 400 }
      );
    }

    // MongoDB ObjectId format check (24 hex characters)
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { success: false, message: "Invalid appointment ID format" },
        { status: 400 }
      );
    }

    // Token verification
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

    // Admin check
    const admin = await Admin.findById(verification.decoded.id).select(
      "name permissions status"
    );

    if (!admin || admin.status !== "active") {
      return NextResponse.json(
        { success: false, message: "Admin not found or account is inactive" },
        { status: 403 }
      );
    }

    // Permission check
    if (!admin.permissions.includes("appointments_update")) {
      return NextResponse.json(
        { success: false, message: "Permission denied: You cannot update appointments" },
        { status: 403 }
      );
    }

    // Find appointment (non-deleted only)
    const appointment = await Appointment.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!appointment) {
      return NextResponse.json(
        { success: false, message: "Appointment not found or already deleted" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { patient, doctor, date, timeSlot, status, reason, notes } = body;

    // Check if anything to update
    if (!patient && !doctor && !date && !timeSlot && !status && !reason && !notes) {
      return NextResponse.json(
        { success: false, message: "No data provided to update" },
        { status: 400 }
      );
    }

    const updateData = {};
    if (patient) updateData.patient = patient;
    if (doctor) updateData.doctor = doctor;

    if (status) {
      const validStatuses = ["scheduled", "confirmed", "completed", "cancelled", "no_show"];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { success: false, message: "Invalid status value" },
          { status: 400 }
        );
      }
      updateData.status = status;
    }

    if (reason !== undefined) updateData.reason = reason?.trim() || "";
    if (notes !== undefined) updateData.notes = notes?.trim() || "";

    // Handle date and timeSlot change with conflict check
    if (date || timeSlot) {
      const newDate = date ? new Date(date) : appointment.date;
      if (date && isNaN(newDate.getTime())) {
        return NextResponse.json(
          { success: false, message: "Invalid date format" },
          { status: 400 }
        );
      }

      const newTimeSlot = timeSlot?.trim() || appointment.timeSlot;
      if (!newTimeSlot) {
        return NextResponse.json(
          { success: false, message: "Time slot cannot be empty" },
          { status: 400 }
        );
      }

      // Prevent past dates
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (newDate < today) {
        return NextResponse.json(
          { success: false, message: "Cannot update to a past date" },
          { status: 400 }
        );
      }

      // Check conflict (exclude current appointment)
      const conflict = await Appointment.findOne({
        doctor: doctor || appointment.doctor,
        date: newDate,
        timeSlot: newTimeSlot,
        isDeleted: false,
        _id: { $ne: id },
      });

      if (conflict) {
        return NextResponse.json(
          { success: false, message: "Doctor is already booked for this time slot" },
          { status: 409 }
        );
      }

      updateData.date = newDate;
      updateData.timeSlot = newTimeSlot;
    }

    // Audit trail
    updateData.updatedBy = admin._id;

    // Update and return populated document
    const updatedAppointment = await Appointment.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("patient", "name email phone")
      .populate("doctor", "name specialization phone")
      .populate("createdBy", "name email employeeId")
      .populate("updatedBy", "name email employeeId");

    return NextResponse.json(
      {
        success: true,
        message: "Appointment updated successfully!",
        data: {
          appointment: {
            id: updatedAppointment._id,
            patient: updatedAppointment.patient,
            doctor: updatedAppointment.doctor,
            date: updatedAppointment.date,
            timeSlot: updatedAppointment.timeSlot,
            status: updatedAppointment.status,
            reason: updatedAppointment.reason,
            notes: updatedAppointment.notes,
            createdBy: updatedAppointment.createdBy,
            createdAt: updatedAppointment.createdAt,
            updatedBy: updatedAppointment.updatedBy,
            updatedAt: updatedAppointment.updatedAt,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update Appointment Error:", error);
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