
// app/api/super-admin/admin/register/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Admin from "@/backend/models/Admin";
import { verifyToken } from "@/backend/lib/jwt";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    await connectDB();

    // TOKEN AB COOKIE SE PADHO — HEADER SE NAHI!
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Login required" },
        { status: 401 }
      );
    }

    const verification = verifyToken(token);

    // Tere token mein "superadmin" hai
    if (!verification.valid || verification.decoded.role !== "superadmin") {
      return NextResponse.json(
        { success: false, message: "Access Denied: SuperAdmin only" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      name,
      email,
      password,
      phone,
      role = "admin",
      department,
      employeeId,
      permissions,
      expiresAt
    } = body;

    // FULL VALIDATION (same as before)
    if (!name?.trim()) return NextResponse.json({ success: false, message: "Name is required" }, { status: 400 });
    if (!email?.trim()) return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
    if (!password) return NextResponse.json({ success: false, message: "Password is required" }, { status: 400 });
    if (!department?.trim()) return NextResponse.json({ success: false, message: "Department is required" }, { status: 400 });
    if (!employeeId?.trim()) return NextResponse.json({ success: false, message: "Employee ID is required" }, { status: 400 });

    if (name.trim().length < 2) return NextResponse.json({ success: false, message: "Name too short" }, { status: 400 });
    if (password.length < 8) return NextResponse.json({ success: false, message: "Password must be 8+ characters" }, { status: 400 });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.toLowerCase())) {
      return NextResponse.json({ success: false, message: "Invalid email format" }, { status: 400 });
    }

    if (phone && !/^[0-9]{10,15}$/.test(phone.replace(/\D/g, ""))) {
      return NextResponse.json({ success: false, message: "Invalid phone number" }, { status: 400 });
    }

    const validRoles = ["admin", "doctor_manager", "billing_admin", "staff_manager"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ success: false, message: "Invalid role" }, { status: 400 });
    }

    const validDepts = ["IT", "HR", "Finance", "Operations", "Medical"];
    if (!validDepts.includes(department)) {
      return NextResponse.json({ success: false, message: "Invalid department" }, { status: 400 });
    }

    // Duplicate check
    const existing = await Admin.findOne({
      $or: [
        { email: email.toLowerCase().trim() },
        { employeeId: employeeId.trim() }
      ]
    });

    if (existing) {
      const field = existing.email === email.toLowerCase().trim() ? "Email" : "Employee ID";
      return NextResponse.json({ success: false, message: `${field} already registered` }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password.trim(), 12);

    // Create admin
    const newAdmin = await Admin.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone: phone?.trim() || null,
      role,
      department,
      employeeId: employeeId.trim(),
      permissions: permissions && Array.isArray(permissions) ? permissions : ["view_doctors", "view_patients"],
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      createdBy: verification.decoded.id,
      isApproved: true,
      status: "active",
    });

    return NextResponse.json({
      success: true,
      message: "Admin registered successfully!",
      createdBy: verification.decoded.name || verification.decoded.email,
      data: {
        admin: {
          id: newAdmin._id,
          name: newAdmin.name,
          email: newAdmin.email,
          phone: newAdmin.phone,
          role: newAdmin.role,
          department: newAdmin.department,
          employeeId: newAdmin.employeeId,
          status: newAdmin.status,
          createdAt: newAdmin.createdAt
        }
      }
    }, { status: 201 });

  } catch (error) {
    console.error("Admin Register Error:", error.message);
    return NextResponse.json(
      { 
        success: false, 
        message: "Server error",
        error: process.env.NODE_ENV === "development" ? error.message : undefined
      },
      { status: 500 }
    );
  }
}