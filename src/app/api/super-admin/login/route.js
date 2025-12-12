// src/app/api/auth/login/route.js   (ya super-admin/login)

import { NextResponse } from "next/server";
import SuperAdmin from "@/backend/models/SuperAdmin";
import { generateToken } from "@/backend/lib/jwt";
import {connectDB} from "@/backend/lib/db";

export async function POST(request) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password required" },
        { status: 400 }
      );
    }

    // Find user + password select karo
    const user = await SuperAdmin.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Status check — ab status field hai schema mein
    if (user.status !== "active") {
      return NextResponse.json(
        { success: false, message: "Your account has been deactivated. Contact support." },
        { status: 403 }
      );
    }

    // Password check
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken({
      id: user._id,
      role: user.role,
      email: user.email,
      name: user.name
    });

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        lastLogin: user.lastLogin
      },
      token
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/"
    });

    return response;

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}