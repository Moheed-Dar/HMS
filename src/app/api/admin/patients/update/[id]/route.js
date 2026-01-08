// app/api/patients/update/[id]/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Patient from "@/backend/models/Patient";
import { verifyToken } from "@/backend/lib/jwt";
import bcrypt from "bcryptjs";

const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/6596/6596121.png";

export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    if (!id || id === "undefined") {
      return NextResponse.json(
        { success: false, message: "Patient ID is required" },
        { status: 400 }
      );
    }

    // === TOKEN VERIFICATION ===
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

    const { 
      role, 
      permissions = [], 
      id: updaterId,
      name: updaterName,     // Token se name bhi le rahe hain
      email: updaterEmail    // Token se email
    } = verification.decoded;

    // === AUTHORIZATION ===
    const canUpdatePatient =
      role === "superadmin" ||
      role === "admin" ||
      permissions.includes("update_patients");

    if (!canUpdatePatient) {
      return NextResponse.json(
        { success: false, message: "Access Denied: You don't have permission to update patients" },
        { status: 403 }
      );
    }

    // === PARSE BODY ===
    const body = await request.json();

    if (Object.keys(body).length === 0) {
      return NextResponse.json(
        { success: false, message: "No data provided to update" },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      password,
      phone,
      address,
      avatar,
      dateOfBirth,
      gender,
      bloodGroup,
      emergencyContact,
      medicalHistory,
      assignedDoctor,
      status,
    } = body;

    // === FIND PATIENT ===
    const patient = await Patient.findById(id);
    if (!patient) {
      return NextResponse.json(
        { success: false, message: "Patient not found" },
        { status: 404 }
      );
    }

    // === BUILD UPDATE FIELDS ===
    const updateFields = {};
    let needsPasswordHash = false;
    let newPassword = "";

    if (name !== undefined) {
      if (!name?.trim()) return NextResponse.json({ success: false, message: "Name cannot be empty" }, { status: 400 });
      updateFields.name = name.trim();
    }

    if (email !== undefined) {
      if (!email?.trim()) return NextResponse.json({ success: false, message: "Email cannot be empty" }, { status: 400 });
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.toLowerCase())) return NextResponse.json({ success: false, message: "Invalid email format" }, { status: 400 });
      updateFields.email = email.toLowerCase().trim();
    }

    if (password !== undefined) {
      if (password === "" || password.trim().length < 6) return NextResponse.json({ success: false, message: "Password must be at least 6 characters" }, { status: 400 });
      if (password.trim() !== "") {
        needsPasswordHash = true;
        newPassword = password.trim();
      }
    }

    let finalPhone = patient.phone;
    if (phone !== undefined) {
      if (!phone?.trim()) return NextResponse.json({ success: false, message: "Phone cannot be empty" }, { status: 400 });
      const cleanPhone = phone.replace(/\D/g, "");
      if (cleanPhone.length < 10 || cleanPhone.length > 15) return NextResponse.json({ success: false, message: "Phone must be 10-15 digits" }, { status: 400 });
      finalPhone = cleanPhone;
      updateFields.phone = finalPhone;
    }

    if (address !== undefined) {
      if (!address?.trim()) return NextResponse.json({ success: false, message: "Address cannot be empty" }, { status: 400 });
      updateFields.address = address.trim();
    }

    let finalAvatar = patient.avatar || DEFAULT_AVATAR;
    if (avatar !== undefined && avatar !== null) {
      const trimmedAvatar = avatar.toString().trim();
      if (trimmedAvatar === "") {
        finalAvatar = DEFAULT_AVATAR;
      } else if (/^https?:\/\//i.test(trimmedAvatar)) {
        finalAvatar = trimmedAvatar;
      } else {
        return NextResponse.json({ success: false, message: "Avatar must be a valid URL" }, { status: 400 });
      }
      updateFields.avatar = finalAvatar;
    }

    if (dateOfBirth !== undefined) updateFields.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
    if (gender !== undefined) updateFields.gender = gender?.trim().toLowerCase() || null;
    if (bloodGroup !== undefined) updateFields.bloodGroup = bloodGroup?.trim().toUpperCase() || null;
    if (emergencyContact !== undefined) updateFields.emergencyContact = emergencyContact || null;
    if (medicalHistory !== undefined) updateFields.medicalHistory = medicalHistory || null;
    if (assignedDoctor !== undefined) updateFields.assignedDoctor = assignedDoctor || null;
    if (status !== undefined) updateFields.status = status || "active";

    // Always track who updated
    updateFields.updatedBy = updaterId;
    updateFields.updatedByModel = role === "superadmin" ? "SuperAdmin" : "Admin";
    updateFields.updatedAt = new Date();

    // === DUPLICATE CHECK ===
    if (email !== undefined || phone !== undefined) {
      const duplicateCheckQuery = { _id: { $ne: id } };
      const orConditions = [];
      if (email !== undefined) orConditions.push({ email: updateFields.email });
      if (phone !== undefined) orConditions.push({ phone: finalPhone });
      if (orConditions.length > 0) {
        duplicateCheckQuery.$or = orConditions;
        const existing = await Patient.findOne(duplicateCheckQuery);
        if (existing) {
          const field = existing.email === updateFields.email ? "Email" : "Phone";
          return NextResponse.json({ success: false, message: `${field} already registered` }, { status: 400 });
        }
      }
    }

    // === HASH PASSWORD ===
    if (needsPasswordHash) {
      updateFields.password = await bcrypt.hash(newPassword, 12);
    }

    // === PERFORM UPDATE ===
    const updatedPatient = await Patient.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    // === POPULATE WITH updatedBy ===
    const populatedPatient = await Patient.findById(updatedPatient._id)
      .select("-password")
      .populate("assignedDoctor", "name email specialization")
      .populate("createdBy", "name email role")
      .populate("updatedBy", "name email role")  // ← Ye line add ki – ab updatedBy bhi populate hoga
      .lean();

    const responseAvatar = populatedPatient.avatar?.trim() || DEFAULT_AVATAR;

    // === SUCCESS RESPONSE WITH updatedBy ===
    return NextResponse.json(
      {
        success: true,
        message: "Patient updated successfully",
        patient: {
          id: populatedPatient._id,
          name: populatedPatient.name,
          email: populatedPatient.email,
          phone: populatedPatient.phone,
          address: populatedPatient.address,
          avatar: responseAvatar,
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
          updatedAt: populatedPatient.updatedAt,
          createdBy: populatedPatient.createdBy
            ? {
                id: populatedPatient.createdBy._id,
                name: populatedPatient.createdBy.name,
                email: populatedPatient.createdBy.email,
                role: populatedPatient.createdBy.role,
              }
            : null,
          updatedBy: populatedPatient.updatedBy
            ? {
                id: populatedPatient.updatedBy._id,
                name: populatedPatient.updatedBy.name,
                email: populatedPatient.updatedBy.email,
                role: populatedPatient.updatedBy.role,
              }
            : null, // Agar populate nahi hua to null
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Admin Patient PATCH Error:", error);

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