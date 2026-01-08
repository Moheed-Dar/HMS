// app/api/patients/create/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Patient from "@/backend/models/Patient";
import { verifyToken } from "@/backend/lib/jwt";
import bcrypt from "bcryptjs";

const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/6596/6596121.png";

export async function POST(request) {
  try {
    await connectDB();

    // === TOKEN GET KARO ===
    const token =
      request.cookies.get("token")?.value ||
      request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Login required" },
        { status: 401 }
      );
    }

    const verification = verifyToken(token);
    if (!verification.valid || !verification.decoded) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const { role, permissions = [], id: creatorId } = verification.decoded;

    // === AUTHORIZATION: superadmin, admin ya create_patients permission ===
    const canCreatePatient =
      role === "superadmin" ||
      role === "admin" ||
      permissions.includes("create_patients");

    if (!canCreatePatient) {
      return NextResponse.json(
        {
          success: false,
          message: "Access Denied: You don't have permission to create patients",
        },
        { status: 403 }
      );
    }

    // === PARSE BODY ===
    const body = await request.json();
    const {
      name,
      email,
      password,
      phone,
      address,
      avatar,                    // New: optional avatar URL
      dateOfBirth,
      gender,
      bloodGroup,
      emergencyContact,
      medicalHistory,
      assignedDoctor,
    } = body;

    // === BASIC VALIDATIONS ===
    if (!name?.trim()) return NextResponse.json({ success: false, message: "Name is required" }, { status: 400 });
    if (!email?.trim()) return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
    if (!password || password.length < 6) return NextResponse.json({ success: false, message: "Password must be at least 6 characters" }, { status: 400 });
    if (!phone?.trim()) return NextResponse.json({ success: false, message: "Phone is required" }, { status: 400 });
    if (!address?.trim()) return NextResponse.json({ success: false, message: "Address is required" }, { status: 400 });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.toLowerCase())) {
      return NextResponse.json({ success: false, message: "Invalid email format" }, { status: 400 });
    }

    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      return NextResponse.json({ success: false, message: "Phone must be 10-15 digits" }, { status: 400 });
    }

    // === AVATAR VALIDATION (if provided) ===
    let finalAvatar = DEFAULT_AVATAR; // default fallback
    if (avatar !== undefined && avatar !== null && avatar !== "") {
      const trimmedAvatar = avatar.toString().trim();
      if (/^https?:\/\//i.test(trimmedAvatar)) {
        finalAvatar = trimmedAvatar;
      } else {
        return NextResponse.json(
          { success: false, message: "Avatar must be a valid URL starting with http:// or https://" },
          { status: 400 }
        );
      }
    }

    // === DUPLICATE CHECK (email or phone) ===
    const existingPatient = await Patient.findOne({
      $or: [
        { email: email.toLowerCase().trim() },
        { phone: cleanPhone },
      ],
    });

    if (existingPatient) {
      const field = existingPatient.email === email.toLowerCase().trim() ? "Email" : "Phone";
      return NextResponse.json({ success: false, message: `${field} already registered` }, { status: 400 });
    }

    // === HASH PASSWORD ===
    const hashedPassword = await bcrypt.hash(password.trim(), 12);

    // === CREATE NEW PATIENT ===
    const newPatient = await Patient.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone: cleanPhone,
      address: address.trim(),
      avatar: finalAvatar, // Save avatar (default or provided)
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      gender: gender?.trim().toLowerCase(),
      bloodGroup: bloodGroup?.trim().toUpperCase(),
      emergencyContact: emergencyContact || undefined,
      medicalHistory: medicalHistory || undefined,
      assignedDoctor: assignedDoctor || undefined,
      status: "active",
      role: "patient",
      createdBy: creatorId,
      createdByModel: role === "superadmin" ? "SuperAdmin" : "Admin",
    });

    // === FETCH POPULATED PATIENT (without password) ===
    const populatedPatient = await Patient.findById(newPatient._id)
      .select("-password")
      .populate("assignedDoctor", "name email specialization")
      .populate("createdBy", "name email role")
      .lean();

    if (!populatedPatient) {
      return NextResponse.json(
        { success: false, message: "Failed to retrieve created patient" },
        { status: 500 }
      );
    }

    // === FINAL AVATAR FOR RESPONSE ===
    const responseAvatar = populatedPatient.avatar && populatedPatient.avatar.trim()
      ? populatedPatient.avatar.trim()
      : DEFAULT_AVATAR;

    // === SUCCESS RESPONSE WITH AVATAR ===
    return NextResponse.json(
      {
        success: true,
        message: "Patient created successfully",
        patient: {
          id: populatedPatient._id,
          name: populatedPatient.name,
          email: populatedPatient.email,
          phone: populatedPatient.phone,
          address: populatedPatient.address,
          avatar: responseAvatar, // ← Ab avatar response mein aayega
          dateOfBirth: populatedPatient.dateOfBirth || null,
          gender: populatedPatient.gender || null,
          bloodGroup: populatedPatient.bloodGroup || null,
          emergencyContact: populatedPatient.emergencyContact || null,
          medicalHistory: populatedPatient.medicalHistory || null,
          assignedDoctor: populatedPatient.assignedDoctor
            ? {
                id: populatedPatient.assignedDoctor._id,
                name: populatedPatient.assignedDoctor.name,
                email: populatedPatient.assignedDoctor.email,
                specialization: populatedPatient.assignedDoctor.specialization,
              }
            : null,
          status: populatedPatient.status,
          role: "patient",
          createdAt: populatedPatient.createdAt,
          createdBy: populatedPatient.createdBy
            ? {
                id: populatedPatient.createdBy._id,
                name: populatedPatient.createdBy.name,
                email: populatedPatient.createdBy.email,
                role: populatedPatient.createdBy.role,
              }
            : null,
        },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Admin Patient Create Error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Email or phone already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: process.env.NODE_ENV === "development" ? error.message : "Something went wrong",
      },
      { status: 500 }
    );
  }
}