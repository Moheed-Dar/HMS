// app/api/appointments/[id]/delete/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Appointment from "@/backend/models/Appointment";
import Admin from "@/backend/models/Admin";
import { verifyToken } from "@/backend/lib/jwt";

export async function DELETE(request, { params }) {
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
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    const admin = await Admin.findById(verification.decoded.id).select("name employeeId permissions status");
    if (!admin || admin.status !== "active") {
      return NextResponse.json({ success: false, message: "Admin not found or inactive" }, { status: 403 });
    }

    if (!admin.permissions.includes("appointments_delete")) {
      return NextResponse.json(
        { success: false, message: "Permission denied: You cannot delete appointments" },
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

    // Soft delete with await
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: admin._id,
      },
      { new: true } // Return updated document
    );

    if (!updatedAppointment) {
      return NextResponse.json(
        { success: false, message: "Failed to delete appointment" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Appointment deleted successfully",
        deletedBy: { 
          name: admin.name, 
          employeeId: admin.employeeId || null 
        },
        deletedAt: updatedAppointment.deletedAt,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete Appointment Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}