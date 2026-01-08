// app/api/patients/profile/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Patient from "@/backend/models/Patient";
import { verifyToken } from "@/backend/lib/jwt";

const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/6596/6596121.png";

export async function PUT(request) {
  try {
    await connectDB();

    // === GET TOKEN SAFELY ===
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

    const userId = verification.decoded.id;
    const userRole = verification.decoded.role;

    // === ONLY PATIENT CAN UPDATE THEIR OWN PROFILE ===
    if (userRole !== "patient") {
      return NextResponse.json(
        { success: false, message: "Access denied: Only patients can update their profile" },
        { status: 403 }
      );
    }

    // === PARSE BODY ===
    const body = await request.json();
    const {
      name,
      phone,
      address,
      avatar, // Can be string URL, "", or null to remove
      dateOfBirth,
      gender,
      bloodGroup,
      emergencyContact,
      medicalHistory,
    } = body;

    // === VALIDATIONS ===
    if (name !== undefined && (name === null || !name.toString().trim())) {
      return NextResponse.json(
        { success: false, message: "Name cannot be empty" },
        { status: 400 }
      );
    }

    if (phone !== undefined && phone !== null) {
      const cleanPhone = phone.toString().replace(/\D/g, "");
      if (cleanPhone.length < 10 || cleanPhone.length > 15) {
        return NextResponse.json(
          { success: false, message: "Phone must be 10-15 digits" },
          { status: 400 }
        );
      }
    }

    if (address !== undefined && address !== null && !address.toString().trim()) {
      return NextResponse.json(
        { success: false, message: "Address cannot be empty" },
        { status: 400 }
      );
    }

    // Avatar URL validation (if provided and not empty/null)
    if (avatar !== undefined && avatar !== null && avatar !== "") {
      if (typeof avatar !== "string" || !avatar.trim().startsWith("http")) {
        return NextResponse.json(
          { success: false, message: "Avatar must be a valid URL starting with http/https" },
          { status: 400 }
        );
      }
    }

    // === PREPARE UPDATE FIELDS ===
    const updateFields = {};

    if (name !== undefined) updateFields.name = name?.trim();
    if (phone !== undefined && phone !== null)
      updateFields.phone = phone.toString().replace(/\D/g, "");
    if (address !== undefined) updateFields.address = address?.trim() || null;
    if (dateOfBirth !== undefined)
      updateFields.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
    if (gender !== undefined)
      updateFields.gender = gender ? gender.trim().toLowerCase() : null;
    if (bloodGroup !== undefined)
      updateFields.bloodGroup = bloodGroup ? bloodGroup.trim().toUpperCase() : null;
    if (emergencyContact !== undefined) updateFields.emergencyContact = emergencyContact;
    if (medicalHistory !== undefined) updateFields.medicalHistory = medicalHistory;

    // === AVATAR HANDLING (Critical Fix) ===
    if (avatar !== undefined) {
      if (!avatar || avatar === "" || avatar === null) {
        // User wants to remove avatar → set default
        updateFields.avatar = DEFAULT_AVATAR;
      } else {
        // Valid avatar URL provided → save it
        updateFields.avatar = avatar.trim();
      }
    }
    // If avatar is NOT sent in body → don't touch it (keeps old value)

    // === CHECK IF ANYTHING TO UPDATE ===
    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json(
        { success: false, message: "No fields provided to update" },
        { status: 400 }
      );
    }

    // === UPDATE PATIENT ===
    const updatedPatient = await Patient.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    )
      .select("-password")
      .lean();

    if (!updatedPatient) {
      return NextResponse.json(
        { success: false, message: "Patient not found" },
        { status: 404 }
      );
    }

    // === FINAL AVATAR FOR RESPONSE ===
    const responseAvatar = updatedPatient.avatar?.trim()
      ? updatedPatient.avatar.trim()
      : DEFAULT_AVATAR;

    // === SUCCESS RESPONSE ===
    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully",
        patient: {
          id: updatedPatient._id,
          name: updatedPatient.name || "Patient",
          email: updatedPatient.email,
          phone: updatedPatient.phone || null,
          address: updatedPatient.address || null,
          avatar: responseAvatar,
          dateOfBirth: updatedPatient.dateOfBirth || null,
          gender: updatedPatient.gender || null,
          bloodGroup: updatedPatient.bloodGroup || null,
          emergencyContact: updatedPatient.emergencyContact || null,
          medicalHistory: updatedPatient.medicalHistory || null,
          assignedDoctor: updatedPatient.assignedDoctor || null,
          status: updatedPatient.status || "active",
          role: "patient",
          createdAt: updatedPatient.createdAt,
          updatedAt: updatedPatient.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Patient Profile Update Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update profile",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}