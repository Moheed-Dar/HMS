// app/api/profile/patient/me/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Patient from "@/backend/models/Patient";
import { verifyToken } from "@/backend/lib/jwt"; // Aapka existing helper

export async function GET(request) {
  try {
    await connectDB();

    // === 1. Get Token Safely ===
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "No token provided. Please login again." },
        { status: 401 }
      );
    }

    // === 2. Verify Token Using Your Helper ===
    const verification = verifyToken(token);
    if (!verification.valid || !verification.decoded) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token. Please login again." },
        { status: 401 }
      );
    }

    const { id, role } = verification.decoded;

    // === 3. Role Check ===
    if (role !== "patient") {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Patient access only" },
        { status: 403 }
      );
    }

    // === 4. Fetch Patient ===
    const patient = await Patient.findById(id)
      .select("-password") // Password hatao
      .lean(); // Plain JS object for faster processing & no Mongoose interference

    if (!patient) {
      return NextResponse.json(
        { success: false, message: "Patient not found" },
        { status: 404 }
      );
    }

    // === 5. Build Clean Profile Object ===
    const profile = {
      id: patient._id,
      name: patient.name?.trim() || "Patient",
      email: patient.email,
      phone: patient.phone || null,
      address: patient.address || null,
      avatar: patient.avatar || "https://cdn-icons-png.flaticon.com/512/6596/6596121.png", // Default fallback
      role: "patient",
      status: patient.status || "active",
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,

      // === Optional Medical Fields (Safe Include) ===
      dateOfBirth: patient.dateOfBirth || null,
      gender: patient.gender || null,
      bloodGroup: patient.bloodGroup || null,
      emergencyContact: patient.emergencyContact || null,
      medicalHistory: patient.medicalHistory || null,
      assignedDoctor: patient.assignedDoctor || null,
    };

    // === 6. Success Response ===
    return NextResponse.json(
      {
        success: true,
        message: "Patient profile fetched successfully",
        data: { profile },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Patient Profile API Error:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

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