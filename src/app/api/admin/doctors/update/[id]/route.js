// app/api/admin/doctors/[id]/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Doctor from "@/backend/models/Doctor";
import { verifyToken } from "@/backend/lib/jwt";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// ==================== PUT: Update Doctor ====================
export async function PUT(request, context) {
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

    // Smart Access Control
    const userRole = verification.decoded.role;
    const userPermissions = verification.decoded.permissions || [];

    if (userRole !== "superadmin" && userRole !== "admin") {
      if (!userPermissions.includes("update_doctors")) {
        return NextResponse.json(
          { success: false, message: "Access Denied: You don't have 'update_doctors' permission" },
          { status: 403 }
        );
      }
    }

    const params = await context.params;
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid doctor ID" }, { status: 400 });
    }

    const body = await request.json();
    const {
      name,
      email,
      password,
      phone,
      specialization,
      licenseNumber,
      department,
      experience,
      qualifications,
      consultationFee,
      availableDays,
      availableTimeSlots,
      status,
      isAvailable,
    } = body;

    // Validations for provided fields
    if (name !== undefined && !name?.trim()) {
      return NextResponse.json({ success: false, message: "Name cannot be empty" }, { status: 400 });
    }

    if (email !== undefined) {
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email.toLowerCase().trim())) {
        return NextResponse.json({ success: false, message: "Invalid email format" }, { status: 400 });
      }
    }

    if (password !== undefined && password.trim() !== "" && password.length < 6) {
      return NextResponse.json({ success: false, message: "Password must be at least 6 characters" }, { status: 400 });
    }

    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return NextResponse.json({ success: false, message: "Doctor not found" }, { status: 404 });
    }

    // Duplicate check: email or licenseNumber (exclude current doctor)
    if (email !== undefined || licenseNumber !== undefined) {
      const orConditions = [];
      if (email !== undefined) orConditions.push({ email: email.toLowerCase().trim() });
      if (licenseNumber !== undefined) orConditions.push({ licenseNumber: licenseNumber.trim() });

      if (orConditions.length > 0) {
        const existing = await Doctor.findOne({
          _id: { $ne: id },
          $or: orConditions,
        });

        if (existing) {
          const field = existing.email === email?.toLowerCase().trim() ? "Email" : "License number";
          return NextResponse.json(
            { success: false, message: `${field} is already in use by another doctor` },
            { status: 400 }
          );
        }
      }
    }

    // Apply updates only if field is provided
    if (name !== undefined) doctor.name = name.trim();
    if (email !== undefined) doctor.email = email.toLowerCase().trim();
    if (phone !== undefined) doctor.phone = phone.trim();
    if (specialization !== undefined) doctor.specialization = specialization.trim();
    if (licenseNumber !== undefined) doctor.licenseNumber = licenseNumber.trim();
    if (department !== undefined) doctor.department = department.trim();
    if (experience !== undefined) doctor.experience = experience;
    if (qualifications !== undefined) doctor.qualifications = qualifications;
    if (consultationFee !== undefined) doctor.consultationFee = Number(consultationFee) || 0;
    if (availableDays !== undefined) doctor.availableDays = availableDays;
    if (availableTimeSlots !== undefined) doctor.availableTimeSlots = availableTimeSlots;
    if (status !== undefined) doctor.status = status;
    if (isAvailable !== undefined) doctor.isAvailable = isAvailable;

    // Update password only if provided and valid
    if (password && password.trim().length >= 6) {
      doctor.password = await bcrypt.hash(password.trim(), 12);
    }

    // Track who updated
    doctor.updatedBy = verification.decoded.id;
    doctor.updatedByModel =
      verification.decoded.model ||
      (verification.decoded.role === "superadmin" ? "SuperAdmin" : "Admin");

    await doctor.save();

    // Full response with all fields (consistent with other APIs)
    const updatedDoctor = {
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
      updatedAt: doctor.updatedAt,
    };

    return NextResponse.json({
      success: true,
      message: "Doctor updated successfully!",
      updatedBy: {
        name: verification.decoded.name || verification.decoded.email,
        role: verification.decoded.role,
        type: verification.decoded.role === "superadmin" ? "SuperAdmin" : "Admin",
      },
      data: { doctor: updatedDoctor },
    });
  } catch (error) {
    console.error("Update Doctor Error:", error.message);
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