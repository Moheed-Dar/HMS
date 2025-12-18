// app/api/admin/doctors/[id]/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Doctor from "@/backend/models/Doctor";
import { verifyToken } from "@/backend/lib/jwt";
import mongoose from "mongoose";

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    // === AUTHENTICATION ===
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

    // === SMART ACCESS CONTROL ===
    const role = verification.decoded.role;
    const permissions = verification.decoded.permissions || [];

    if (role !== "superadmin" && role !== "admin") {
      if (!permissions.includes("delete_doctors")) {
        return NextResponse.json(
          {
            success: false,
            message: "Access Denied: You don't have 'delete_doctors' permission",
          },
          { status: 403 }
        );
      }
    }

    // === GET DOCTOR ID ===
    const { id } = await params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid doctor ID" },
        { status: 400 }
      );
    }

    // === PEHLE FIND + POPULATE KARO (taki createdBy mile) ===
    const doctor = await Doctor.findById(id)
      .select("-password")
      .populate("createdBy", "name email role")
      .lean();

    if (!doctor) {
      return NextResponse.json(
        { success: false, message: "Doctor not found" },
        { status: 404 }
      );
    }

    // === AB DELETE KARO ===
    await Doctor.deleteOne({ _id: id });
    // Ya: await Doctor.findByIdAndDelete(id); // lekin populate nahi hoga

    // === CLEAN TIME SLOTS ===
    const cleanTimeSlots = (doctor.availableTimeSlots || []).map((slot) => ({
      startTime: slot.startTime,
      endTime: slot.endTime,
    }));

    // === FORMAT DELETED DOCTOR DATA (ab createdBy populated hai) ===
    const doctorData = {
      id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      phone: doctor.phone,
      avatar: doctor.avatar,
      specialization: doctor.specialization,
      licenseNumber: doctor.licenseNumber,
      department: doctor.department,
      experience: doctor.experience,
      qualifications: doctor.qualifications || [],
      consultationFee: doctor.consultationFee || 0,
      availableDays: doctor.availableDays || [],
      availableTimeSlots: cleanTimeSlots,
      permissions: doctor.permissions || [],
      status: doctor.status,
      isAvailable: doctor.isAvailable,
      rating: doctor.rating || 0,
      totalReviews: doctor.totalReviews || 0,
      createdAt: doctor.createdAt,
      updatedAt: doctor.updatedAt,
      createdBy: doctor.createdBy
        ? {
            id: doctor.createdBy._id,
            name: doctor.createdBy.name,
            email: doctor.createdBy.email,
            role: doctor.createdBy.role,
          }
        : null,
    };

    // === SUCCESS RESPONSE ===
    return NextResponse.json(
      {
        success: true,
        message: "Doctor deleted successfully",
        data: {
          deletedDoctor: doctorData,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin Delete Doctor Error:", error);
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