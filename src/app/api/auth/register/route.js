// app/api/auth/register/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Patient from "@/backend/models/Patient";
import { generateToken } from "@/backend/lib/jwt";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    const {
      name,
      email,
      password,
      phone,
      address,
      avatar,

      // only sent when Admin/Doctor/SuperAdmin creates patient
      createdBy,
      createdByModel,
    } = body;

    // ── Required fields (same for everyone) ───────────────────────────────
    if (!name?.trim() || !email?.trim() || !password || !phone?.trim() || !address?.trim()) {
      return NextResponse.json(
        { success: false, message: "Name, email, password, phone, address are required" },
        { status: 400 }
      );
    }

    // Basic format validations
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, message: "Invalid email format" }, { status: 400 });
    }

    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      return NextResponse.json(
        { success: false, message: "Phone must be 10–15 digits" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json({ success: false, message: "Password ≥ 6 characters" }, { status: 400 });
    }

    // ── Check duplicate email ──────────────────────────────────────────────
    const existing = await Patient.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json({ success: false, message: "Email already registered" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password.trim(), 12);

    // Avatar
    const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/6596/6596121.png";
    const finalAvatar =
      avatar && typeof avatar === "string" && avatar.trim().startsWith("http")
        ? avatar.trim()
        : defaultAvatar;

    // ── Prepare creation object ────────────────────────────────────────────
    const patientData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone: cleanPhone,
      address: address.trim(),
      avatar: finalAvatar,
      role: "patient",
      status: "active",
    };

    // ── Only add createdBy / createdByModel if they are sent (admin/doctor) ──
    if (createdBy && createdByModel) {
      // You should add extra authorization check here in real app
      // e.g. verify token & role === "admin" || "superadmin" || "doctor"

      if (!["Admin", "SuperAdmin", "Doctor"].includes(createdByModel)) {
        return NextResponse.json({ success: false, message: "Invalid createdByModel" }, { status: 400 });
      }

      patientData.createdBy = createdBy;
      patientData.createdByModel = createdByModel;
    }
    // else → self-registration → both fields remain null (already default)

    const newPatient = await Patient.create(patientData);

    // ── Token (only for self-registration flows) ───────────────────────────
    // If admin creates patient → usually don't return token here
    const token = generateToken({
      id: newPatient._id,
      email: newPatient.email,
      name: newPatient.name,
      role: "patient",
      avatar: finalAvatar,
    });

    const safePatient = newPatient.toObject();

    const response = NextResponse.json(
      {
        success: true,
        message: "Patient registered successfully",
        user: {
          id: safePatient._id,
          name: safePatient.name,
          email: safePatient.email,
          phone: safePatient.phone,
          address: safePatient.address,
          avatar: safePatient.avatar,
          role: safePatient.role,
          createdAt: safePatient.createdAt,
          // optional – show who created (if admin)
          createdBy: safePatient.createdBy || null,
          createdByModel: safePatient.createdByModel || null,
        },
        // only include token if self-registration
        ...(createdBy ? {} : { token }),
      },
      { status: 201 }
    );

    // Set cookie only for self-registration
    if (!createdBy) {
      response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });
    }

    return response;
  } catch (error) {
    console.error("Registration Error:", error);

    if (error.code === 11000) {
      return NextResponse.json({ success: false, message: "Email already exists" }, { status: 400 });
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: messages },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Registration failed",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}