// app/api/auth/login/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Admin from "@/backend/models/Admin";
import Doctor from "@/backend/models/Doctor";
import Patient from "@/backend/models/Patient";
import { generateToken } from "@/backend/lib/jwt";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    await connectDB();
    // console.log("Admin Model:", Admin);
    // console.log("Doctor Model:", Doctor);
    // console.log("Patient Model:", Patient);
    const { email, password, role } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email & password required" }, { status: 400 });
    }

    let user = null;
    let userRole = "";

    if (role && ["admin", "doctor", "patient"].includes(role)) {
      const Model = role === "admin" ? Admin : role === "doctor" ? Doctor : Patient;
      user = await Model.findOne({ email: email.toLowerCase().trim() }).select("+password");
      userRole = role;
    } else {
      const [a, d, p] = await Promise.all([
        Admin.findOne({ email: email.toLowerCase().trim() }).select("+password"),
        Doctor.findOne({ email: email.toLowerCase().trim() }).select("+password"),
        Patient.findOne({ email: email.toLowerCase().trim() }).select("+password")
      ]);
      user = a || d || p;
      userRole = a ? "admin" : d ? "doctor" : "patient";
    }

    if (!user) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    if (user.status !== "active") {
      return NextResponse.json({ success: false, message: "Account deactivated" }, { status: 403 });
    }

    // Yeh line 100% kaam karegi ab
    const isMatch = await bcrypt.compare(password.trim(), user.password);

    if (!isMatch) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    const token = generateToken({
      id: user._id,
      email: user.email,
      name: user.name,
      role: userRole
    });

    const res = NextResponse.json({
      success: true,
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email, role: userRole },
      token
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 604800,
      path: "/"
    });

    return res;

  } catch (error) {
    console.error("Login Error:", error.message);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}