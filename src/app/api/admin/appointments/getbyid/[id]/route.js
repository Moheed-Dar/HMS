// app/api/appointments/[id]/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Appointment from "@/backend/models/Appointment";
import Admin from "@/backend/models/Admin";
import { verifyToken } from "@/backend/lib/jwt";

// ==================== GET: Get Appointment by ID ====================
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params || {};
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { success: false, message: "Invalid appointment ID" },
        { status: 400 }
      );
    }

    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: "Login required" }, { status: 401 });
    }

    const verification = verifyToken(token);
    if (!verification.valid) {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
    }

    const admin = await Admin.findById(verification.decoded.id).select("permissions status");
    if (!admin || admin.status !== "active") {
      return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
    }

    if (!admin.permissions.includes("appointments_view")) {
      return NextResponse.json(
        { success: false, message: "Permission denied: You cannot view appointments" },
        { status: 403 }
      );
    }

    // Normal users sirf non-deleted appointments dekh sakein
    const query = { _id: id };
    if (!admin.permissions.includes("appointments_view_deleted")) {
      query.isDeleted = false;
    }

    const appointment = await Appointment.findOne(query)
      .populate("patient", "name email phone")
      .populate("doctor", "name specialization phone")
      .populate("createdBy", "name email employeeId")
      .populate("updatedBy", "name email employeeId");

    if (!appointment) {
      return NextResponse.json(
        { success: false, message: "Appointment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Appointment fetched successfully",
        data: { appointment },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get Appointment by ID Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// ==================== PUT: Update Appointment by ID ====================
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { id } = params || {};
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { success: false, message: "Invalid appointment ID" },
        { status: 400 }
      );
    }

    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: "Login required" }, { status: 401 });
    }

    const verification = verifyToken(token);
    if (!verification.valid) {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
    }

    const admin = await Admin.findById(verification.decoded.id).select("name permissions status");
    if (!admin || admin.status !== "active") {
      return NextResponse.json({ success: false, message: "Admin not found or inactive" }, { status: 403 });
    }

    if (!admin.permissions.includes("appointments_update")) {
      return NextResponse.json(
        { success: false, message: "Permission denied: You cannot update appointments" },
        { status: 403 }
      );
    }

    const appointment = await Appointment.findOne({ _id: id, isDeleted: false });
    if (!appointment) {
      return NextResponse.json(
        { success: false, message: "Appointment not found or already deleted" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { patient, doctor, date, timeSlot, status, reason, notes } = body;

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
        return NextResponse.json({ success: false, message: "Invalid status value" }, { status: 400 });
      }
      updateData.status = status;
    }

    if (reason !== undefined) updateData.reason = reason?.trim() || "";
    if (notes !== undefined) updateData.notes = notes?.trim() || "";

    if (date || timeSlot) {
      const newDate = date ? new Date(date) : appointment.date;
      if (date && isNaN(newDate.getTime())) {
        return NextResponse.json({ success: false, message: "Invalid date format" }, { status: 400 });
      }

      const newTimeSlot = timeSlot?.trim() || appointment.timeSlot;
      if (!newTimeSlot) {
        return NextResponse.json({ success: false, message: "Time slot cannot be empty" }, { status: 400 });
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (newDate < today) {
        return NextResponse.json({ success: false, message: "Cannot update to a past date" }, { status: 400 });
      }

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

    updateData.updatedBy = admin._id;

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
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}