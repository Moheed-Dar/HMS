// app/api/auth/register/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Patient from "@/backend/models/Patient";
import { generateToken } from "@/backend/lib/jwt";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    await connectDB();

    const { name, email, password, phone, address, avatar } = await request.json();

    // Required fields validation
    if (!name?.trim() || !email?.trim() || !password || !phone?.trim() || !address?.trim()) {
      return NextResponse.json(
        { success: false, message: "Name, email, password, phone, and address are required" },
        { status: 400 }
      );
    }

    // Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.toLowerCase())) {
      return NextResponse.json({ success: false, message: "Invalid email format" }, { status: 400 });
    }

    // Phone validation
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      return NextResponse.json({ success: false, message: "Invalid phone number" }, { status: 400 });
    }

    // Password length
    if (password.length < 6) {
      return NextResponse.json({ success: false, message: "Password must be at least 6 characters" }, { status: 400 });
    }

    // Check duplicate email
    const existingPatient = await Patient.findOne({ email: email.toLowerCase().trim() });
    if (existingPatient) {
      return NextResponse.json({ success: false, message: "Email already registered" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password.trim(), 12);

    // Avatar logic - safe handling
    const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/6596/6596121.png";
    const patientAvatar = (avatar && typeof avatar === "string" && avatar.trim().startsWith("http"))
      ? avatar.trim()
      : defaultAvatar;

    // Create patient
    const newPatient = await Patient.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone: cleanPhone,
      address: address.trim(),
      avatar: patientAvatar,        // Explicitly set
      role: "patient",
      status: "active",
    });

    // Generate token
    const token = generateToken({
      id: newPatient._id,
      email: newPatient.email,
      name: newPatient.name,
      role: "patient",
      avatar: patientAvatar,        // Token mein bhi safe avatar
    });

    // Use .toObject() to get clean data (bypass any toJSON issues)
    const patientData = newPatient.toObject();

    // Prepare response - explicitly include avatar
    const response = NextResponse.json(
      {
        success: true,
        message: "Patient registered successfully",
        user: {
          id: patientData._id,
          name: patientData.name,
          email: patientData.email,
          phone: patientData.phone,
          address: patientData.address,
          avatar: patientData.avatar || defaultAvatar,  // 100% guarantee
          role: patientData.role,
          createdAt: patientData.createdAt,
        },
        token,
      },
      { status: 201 }
    );

    // Set cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Registration Error:", error);

    if (error.code === 11000) {
      return NextResponse.json({ success: false, message: "Email already exists" }, { status: 400 });
    }

    return NextResponse.json(
      {
        success: false,
        message: "Registration failed",
        error: process.env.NODE_ENV === "development" ? error.message : "Server error",
      },
      { status: 500 }
    );
  }
}