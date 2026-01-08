// app/api/appointments/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Appointment from "@/backend/models/Appointment";
import Admin from "@/backend/models/Admin";
import { verifyToken } from "@/backend/lib/jwt";

export async function GET(request) {
  try {
    await connectDB();

    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: "Login required" }, { status: 401 });
    }

    const verification = verifyToken(token);
    if (!verification.valid) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    const admin = await Admin.findById(verification.decoded.id).select("permissions role status");
    if (!admin || admin.status !== "active") {
      return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
    }

    if (!admin.permissions.includes("appointments_view")) {
      return NextResponse.json(
        { success: false, message: "Permission denied: You cannot view appointments" },
        { status: 403 }
      );
    }

    // Normal users sirf non-deleted dekhein
    const query = admin.permissions.includes("appointments_view_deleted")
      ? {} // Admin with special permission can see deleted too
      : { isDeleted: false };

    const appointments = await Appointment.find(query)
      .populate("patient", "name email phone")
      .populate("doctor", "name specialization phone")
      .populate("createdBy", "name employeeId")
      .populate("updatedBy", "name employeeId")
      .sort({ date: 1, timeSlot: 1 }); // Upcoming first

    return NextResponse.json(
      {
        success: true,
        count: appointments.length,
        data: { appointments },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get All Appointments Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}