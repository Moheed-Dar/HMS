// app/api/super-admin/admin/adminUpdate/[id]/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Admin from "@/backend/models/Admin";
import { verifyToken } from "@/backend/lib/jwt";
import bcrypt from "bcryptjs";

export async function PATCH(request, context) {
  try {
    await connectDB();

    // Next.js 14+ mein params aise aata hai
    const { id } = await context.params;

    // ID validation
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid Admin ID" },
        { status: 400 }
      );
    }

    // TOKEN AB COOKIE SE PADHO — HEADER SE BILKUL NAHI!
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Login required" },
        { status: 401 }
      );
    }

    const verification = verifyToken(token);

    // Tere token mein "superadmin" hai (hyphen nahi)
    if (!verification.valid || verification.decoded.role !== "superadmin") {
      return NextResponse.json(
        { success: false, message: "Access Denied: SuperAdmin only" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      name,
      phone,
      role,
      department,
      permissions,
      status,
      password,
      expiresAt
    } = body;

    const updateData = {};

    // Only add fields that are provided
    if (name?.trim()) updateData.name = name.trim();
    if (phone?.trim()) updateData.phone = phone.trim();
    if (expiresAt !== undefined) updateData.expiresAt = expiresAt ? new Date(expiresAt) : null;

    // Status validation
    if (status && !["active", "inactive"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Status must be 'active' or 'inactive'" },
        { status: 400 }
      );
    }
    if (status) updateData.status = status;

    // Role validation
    if (role) {
      const validRoles = ["admin", "doctor_manager", "billing_admin", "staff_manager"];
      if (!validRoles.includes(role)) {
        return NextResponse.json({ success: false, message: "Invalid role" }, { status: 400 });
      }
      updateData.role = role;
    }

    // Department validation
    if (department) {
      const validDepts = ["IT", "HR", "Finance", "Operations", "Medical"];
      if (!validDepts.includes(department)) {
        return NextResponse.json({ success: false, message: "Invalid department" }, { status: 400 });
      }
      updateData.department = department;
    }

    // Permissions
    if (permissions && Array.isArray(permissions)) {
      updateData.permissions = permissions;
    }

    // Password update (optional)
    if (password) {
      if (password.length < 8) {
        return NextResponse.json(
          { success: false, message: "Password must be at least 8 characters" },
          { status: 400 }
        );
      }
      updateData.password = await bcrypt.hash(password.trim(), 12);
    }

    // Update admin
    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedAdmin) {
      return NextResponse.json(
        { success: false, message: "Admin not found or already deleted" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Admin updated successfully",
      updatedBy: verification.decoded.name || verification.decoded.email,
      data: {
        id: updatedAdmin._id,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        phone: updatedAdmin.phone,
        role: updatedAdmin.role,
        department: updatedAdmin.department,
        employeeId: updatedAdmin.employeeId,
        permissions: updatedAdmin.permissions,
        status: updatedAdmin.status,
        expiresAt: updatedAdmin.expiresAt,
        updatedAt: updatedAdmin.updatedAt
      }
    });
  } catch (error) {
    console.error("Update Admin Error:", error.message);
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