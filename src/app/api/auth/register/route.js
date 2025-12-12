import { NextResponse } from "next/server";
import Admin from "@backend/models/Admin";
import Doctor from "@backend/models/Doctor";
import Patient from "@backend/models/Patient";
import { generateToken } from "@backend/lib/jwt";
import {connectDB} from "@backend/lib/db";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { role, ...userData } = body;

    // Validate role
    if (!role) {
      return NextResponse.json(
        {
          success: false,
          message: "Role is required (admin, doctor, patient)"
        },
        { status: 400 }
      );
    }

    // Block SuperAdmin registration from this endpoint
    if (role === "superadmin") {
      return NextResponse.json(
        {
          success: false,
          message: "SuperAdmin registration is not allowed through this endpoint. Use /api/super-admin/register"
        },
        { status: 403 }
      );
    }

    let user;
    let Model;

    // Select model based on role
    switch (role) {
      case "admin":
        Model = Admin;
        // Validate required fields
        if (!userData.createdBy || !userData.department || !userData.employeeId) {
          return NextResponse.json(
            {
              success: false,
              message: "createdBy, department, and employeeId are required for admin"
            },
            { status: 400 }
          );
        }
        break;

      case "doctor":
        Model = Doctor;
        // Validate required fields
        if (!userData.specialization || !userData.licenseNumber || 
            !userData.department || userData.experience === undefined) {
          return NextResponse.json(
            {
              success: false,
              message: "specialization, licenseNumber, department, and experience are required for doctor"
            },
            { status: 400 }
          );
        }
        break;

      case "patient":
        Model = Patient;
        // Validate required fields
        if (!userData.dateOfBirth || !userData.gender) {
          return NextResponse.json(
            {
              success: false,
              message: "dateOfBirth and gender are required for patient"
            },
            { status: 400 }
          );
        }
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

    // Check if email already exists in ANY model
    const emailExists = await Promise.all([
      SuperAdmin.findOne({ email: userData.email }),
      Admin.findOne({ email: userData.email }),
      Doctor.findOne({ email: userData.email }),
      Patient.findOne({ email: userData.email })
    ]);

    if (emailExists.some(result => result !== null)) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already exists"
        },
        { status: 400 }
      );
    }

    // Create user
    user = await Model.create(userData);

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
        message: `${role} registered successfully`,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      },
      { status: 201 }
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
    console.error("Registration Error:", error);
    
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: messages
        },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already exists"
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Registration failed"
      },
      { status: 500 }
    );
  }
}