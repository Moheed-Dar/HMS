// app/api/admin/doctors/[id]/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Doctor from "@/backend/models/Doctor";
import { verifyToken } from "@/backend/lib/jwt";
import mongoose from "mongoose";

export async function GET(request, context) {
  try {
    await connectDB();

    // Token from cookie
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
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const userRole = verification.decoded.role;
    const userPermissions = verification.decoded.permissions || [];

    // Permission check: superadmin, admin ya view_doctors permission
    if (userRole !== "superadmin" && userRole !== "admin") {
      if (!userPermissions.includes("view_doctors")) {
        return NextResponse.json(
          { success: false, message: "Access Denied: You don't have permission to view doctors" },
          { status: 403 }
        );
      }
    }

    // Get dynamic [id] from params
    const params = await context.params;
    const { id } = params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid doctor ID format" },
        { status: 400 }
      );
    }

    // Find doctor by ID
    const doctor = await Doctor.findById(id)
      .select("-password") // Never return password
      .populate("createdBy", "name email role");

    if (!doctor) {
      return NextResponse.json(
        { success: false, message: "Doctor not found" },
        { status: 404 }
      );
    }

    // Format complete doctor data (same as create & list APIs)
    const formattedDoctor = {
      id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      phone: doctor.phone,
      specialization: doctor.specialization,
      licenseNumber: doctor.licenseNumber,
      department: doctor.department,
      experience: doctor.experience,
      qualifications: doctor.qualifications || [],
      consultationFee: doctor.consultationFee || 0,
      availableDays: doctor.availableDays || [],
      availableTimeSlots: doctor.availableTimeSlots || [],
      status: doctor.status,
      isAvailable: doctor.isAvailable,
      rating: doctor.rating || 0,
      totalReviews: doctor.totalReviews || 0,
      createdAt: doctor.createdAt,
      updatedAt: doctor.updatedAt, // optional, if you have it
      createdBy: doctor.createdBy
        ? {
            name: doctor.createdBy.name,
            email: doctor.createdBy.email,
            role: doctor.createdBy.role,
          }
        : null,
    };

    return NextResponse.json({
      success: true,
      message: "Doctor fetched successfully",
      data: { doctor: formattedDoctor },
    });
  } catch (error) {
    console.error("Get Single Doctor Error:", error.message);
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