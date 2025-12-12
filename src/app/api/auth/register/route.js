// app/api/auth/register/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Patient from "@/backend/models/Patient";
import { generateToken } from "@/backend/lib/jwt";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    await connectDB();

    const { name, email, password, phone, address } = await request.json();

    // Required fields validation
    if (!name?.trim() || !email?.trim() || !password || !phone?.trim() || !address?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, email, password, phone, and address are required"
        },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.toLowerCase())) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Phone number validation
    if (!/^[0-9]{10,15}$/.test(phone.replace(/\D/g, ""))) {
      return NextResponse.json(
        { success: false, message: "Invalid phone number" },
        { status: 400 }
      );
    }

    // Password length check
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingPatient = await Patient.findOne({ 
      email: email.toLowerCase().trim() 
    });

    if (existingPatient) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password.trim(), 12);

    // Create new patient
    const newPatient = await Patient.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone: phone.trim(),
      address: address.trim(),
      role: "patient",
      status: "active"
    });

    // Generate JWT token
    const token = generateToken({
      id: newPatient._id,
      email: newPatient.email,
      name: newPatient.name,
      role: "patient"
    });

    // Send response with cookie
    const response = NextResponse.json(
      {
        success: true,
        message: "Patient registered successfully",
        user: {
          id: newPatient._id,
          name: newPatient.name,
          email: newPatient.email,
          phone: newPatient.phone,
          address: newPatient.address,
          role: "patient",
          createdAt: newPatient.createdAt
        },
        token
      },
      { status: 201 }
    );

    // Set httpOnly cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/"
    });

    return response;

  } catch (error) {
    console.error("Registration Error:", error.message);

    // Handle duplicate email error
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Email already exists" },
        { status: 400 }
      );
    }

    // General server error
    return NextResponse.json(
      {
        success: false,
        message: "Registration failed",
        error: process.env.NODE_ENV === "development" ? error.message : "Server error"
      },
      { status: 500 }
    );
  }
}