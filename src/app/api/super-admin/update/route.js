// app/api/profile/superadmin/update/route.js   ← YE PATH & FILENAME EXACTLY

import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import SuperAdmin from "@/backend/models/SuperAdmin";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// YE LINE ZAROORI HAI - PUT handler export
export async function PUT(request) {
  try {
    await connectDB();

    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "No token provided. Please login again." },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token." },
        { status: 401 }
      );
    }

    if (decoded.role !== "superadmin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized: SuperAdmin access only" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, phone, avatar, status, currentPassword, newPassword } = body;

    if (!name && !phone && !avatar && !status && !currentPassword && !newPassword) {
      return NextResponse.json(
        { success: false, message: "Nothing to update. Provide at least one field." },
        { status: 400 }
      );
    }

    const superAdmin = await SuperAdmin.findById(decoded.id || decoded._id);
    if (!superAdmin) {
      return NextResponse.json(
        { success: false, message: "SuperAdmin not found" },
        { status: 404 }
      );
    }

    // Password update
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, superAdmin.password);
      if (!isMatch) {
        return NextResponse.json(
          { success: false, message: "Current password is incorrect" },
          { status: 401 }
        );
      }
      if (newPassword.length < 6) {
        return NextResponse.json(
          { success: false, message: "New password must be at least 6 characters long" },
          { status: 400 }
        );
      }
      superAdmin.password = await bcrypt.hash(newPassword, 10);
    }

    // Other fields
    if (name) superAdmin.name = name.trim();
    if (phone !== undefined) superAdmin.phone = phone?.trim() || null;
    if (avatar) superAdmin.avatar = avatar.trim();
    if (status) {
      if (!["active", "inactive"].includes(status)) {
        return NextResponse.json(
          { success: false, message: "Status must be 'active' or 'inactive'" },
          { status: 400 }
        );
      }
      superAdmin.status = status;
    }

    await superAdmin.save();

    const updatedProfile = {
      id: superAdmin._id,
      name: superAdmin.name,
      email: superAdmin.email,
      phone: superAdmin.phone || null,
      avatar: superAdmin.avatar,
      status: superAdmin.status,
      role: "superadmin",
      createdAt: superAdmin.createdAt,
      updatedAt: superAdmin.updatedAt,
    };

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: { profile: updatedProfile },
    });

  } catch (error) {
    console.error("SuperAdmin update error:", error.message);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
