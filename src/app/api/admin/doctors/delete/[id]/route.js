// app/api/admin/doctors/[id]/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Doctor from "@/backend/models/Doctor";
import { verifyToken } from "@/backend/lib/jwt";
import mongoose from "mongoose";

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    // Token check
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Login required" },
        { status: 401 }
      );
    }

    // Verify token
    const verification = verifyToken(token);
    if (!verification.valid) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const userRole = verification.decoded.role;
    const userPermissions = verification.decoded.permissions || [];

    // Permission check - only superadmin, admin or user with delete_doctors permission
    if (userRole !== "superadmin" && userRole !== "admin") {
      if (!userPermissions.includes("delete_doctors")) {
        return NextResponse.json(
          { success: false, message: "Access Denied: You don't have permission to delete doctors" },
          { status: 403 }
        );
      }
    }

    const { id } = await params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid doctor ID" },
        { status: 400 }
      );
    }

    // Check if doctor exists
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return NextResponse.json(
        { success: false, message: "Doctor not found" },
        { status: 404 }
      );
    }

    // Delete the doctor
    await Doctor.deleteOne({ _id: id });
    // Ya phir: await doctor.deleteOne(); // agar pre-remove hooks use kar rahe ho

    return NextResponse.json({
      success: true,
      message: "Doctor deleted successfully",
    });

  } catch (error) {
    console.error("Delete Doctor Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}