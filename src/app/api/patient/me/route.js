// app/api/profile/patient/me/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Patient from "@/backend/models/Patient";
import jwt from "jsonwebtoken";

export async function GET(request) {
  try {
    await connectDB();

    // 1. Token cookie se safely le rahe hain
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "No token provided. Please login again." },
        { status: 401 }
      );
    }

    // 2. JWT_SECRET check (most common cause of server error)
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing in environment variables");
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    // 3. Token verify with proper error handling
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("JWT Verify Error:", err.message);
      return NextResponse.json(
        { success: false, message: "Invalid or expired token. Please login again." },
        { status: 401 }
      );
    }

    // 4. Role check
    if (decoded.role !== "patient") {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Patient access only" },
        { status: 403 }
      );
    }

    // 5. ID safely extract karo
    const userId = decoded.id || decoded._id || decoded.userId;
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Invalid token payload" },
        { status: 401 }
      );
    }

    // 6. Patient fetch (sirf basic fields, populate only if fields exist)
    const patient = await Patient.findById(userId).select("-password");

    if (!patient) {
      return NextResponse.json(
        { success: false, message: "Patient not found" },
        { status: 404 }
      );
    }

    // 7. Safe response - sirf jo fields hain unko include karo
    const profile = {
      id: patient._id,
      name: patient.name || "Patient",
      email: patient.email,
      phone: patient.phone || null,
      address: patient.address || null,
      avatar: patient.avatar || null,
      status: patient.status || "active",
      role: "patient",
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,
    };

    // Agar extra fields hain to add kar do (safe way)
    if (patient.dateOfBirth) profile.dateOfBirth = patient.dateOfBirth;
    if (patient.gender) profile.gender = patient.gender;
    if (patient.bloodGroup) profile.bloodGroup = patient.bloodGroup;
    if (patient.allergies) profile.allergies = patient.allergies;
    if (patient.chronicConditions) profile.chronicConditions = patient.chronicConditions;
    if (patient.emergencyContact) profile.emergencyContact = patient.emergencyContact;

    return NextResponse.json(
      {
        success: true,
        message: "Patient profile fetched successfully",
        data: { profile },
      },
      { status: 200 }
    );

  } catch (error) {
    // Yeh error properly log karo taake pata chale kya issue hai
    console.error("Patient Profile API Error:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        // Development mein error dikhao, production mein hide
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}