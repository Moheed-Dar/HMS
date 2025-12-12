import { NextResponse } from "next/server";
import Admin from "@backend/models/Admin";
import Doctor from "@backend/models/Doctor";
import Patient from "@backend/models/Patient";
import { generateToken } from "@backend/lib/jwt";
import {connectDB} from "@backend/lib/db";

export async function POST(request) {
  try {
    await connectDB();

    const { email, password, role } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required"
        },
        { status: 400 }
      );
    }

    // Block SuperAdmin login from this endpoint
    if (role === "superadmin") {
      return NextResponse.json(
        {
          success: false,
          message: "SuperAdmin login is not allowed through this endpoint. Use /api/super-admin/login"
        },
        { status: 403 }
      );
    }

    let user;
    let Model;

    // If role is provided, search in specific model
    if (role) {
      switch (role) {
        case "admin":
          Model = Admin;
          break;
        case "doctor":
          Model = Doctor;
          break;
        case "patient":
          Model = Patient;
          break;
        default:
          return NextResponse.json(
            {
              success: false,
              message: "Invalid role. Must be: admin, doctor, or patient"
            },
            { status: 400 }
          );
      }

      user = await Model.findOne({ email }).select("+password");
    } else {
      // Search in all models (except SuperAdmin)
      const [admin, doctor, patient] = await Promise.all([
        Admin.findOne({ email }).select("+password"),
        Doctor.findOne({ email }).select("+password"),
        Patient.findOne({ email }).select("+password")
      ]);

      user = admin || doctor || patient;
    }

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password"
        },
        { status: 401 }
      );
    }

    // Check if account is active
    if (!user.isActive) {
      return NextResponse.json(
        {
          success: false,
          message: "Your account has been deactivated. Please contact support."
        },
        { status: 403 }
      );
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password"
        },
        { status: 401 }
      );
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    });

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: `${user.role} logged in successfully`,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          lastLogin: user.lastLogin
        },
        token
      },
      { status: 200 }
    );

    // Set cookie
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
      {
        success: false,
        message: error.message || "Login failed"
      },
      { status: 500 }
    );
  }
}