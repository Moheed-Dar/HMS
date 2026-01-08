// app/api/patients/delete/[id]/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Patient from "@/backend/models/Patient";
import { verifyToken } from "@/backend/lib/jwt";

const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/6596/6596121.png";

export async function DELETE(request, { params }) {
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

    const { role, permissions = [] } = verification.decoded;

    // === AUTHORIZATION ===
    const canDeletePatient =
      role === "superadmin" ||
      role === "admin" ||
      permissions.includes("delete_patients");

    if (!canDeletePatient) {
      return NextResponse.json(
        {
          success: false,
          message: "Access Denied: You don't have permission to delete patients",
        },
        { status: 403 }
      );
    }

    // === FIND AND PERMANENTLY DELETE PATIENT ===
    const deletedPatient = await Patient.findByIdAndDelete(id)
      .select("-password")
      .populate("assignedDoctor", "name email specialization")
      .populate("createdBy", "name email role")
      .lean();

    if (!deletedPatient) {
      return NextResponse.json(
        { success: false, message: "Patient not found or already deleted" },
        { status: 404 }
      );
    }

    const responseAvatar = deletedPatient.avatar?.trim() || DEFAULT_AVATAR;

    // === SUCCESS RESPONSE ===
    return NextResponse.json(
      {
        success: true,
        message: "Patient permanently deleted from database",
        deletedPatient: {
          id: deletedPatient._id,
          name: deletedPatient.name,
          email: deletedPatient.email,
          phone: deletedPatient.phone,
          address: deletedPatient.address,
          avatar: responseAvatar,
          dateOfBirth: deletedPatient.dateOfBirth || null,
          gender: deletedPatient.gender || null,
          bloodGroup: deletedPatient.bloodGroup || null,
          emergencyContact: deletedPatient.emergencyContact || null,
          medicalHistory: deletedPatient.medicalHistory || null,
          assignedDoctor: deletedPatient.assignedDoctor
            ? {
                id: deletedPatient.assignedDoctor._id,
                name: deletedPatient.assignedDoctor.name,
                email: deletedPatient.assignedDoctor.email,
                specialization: deletedPatient.assignedDoctor.specialization,
              }
            : null,
          role: "patient",
          createdAt: deletedPatient.createdAt,
          createdBy: deletedPatient.createdBy
            ? {
                id: deletedPatient.createdBy._id,
                name: deletedPatient.createdBy.name,
                email: deletedPatient.createdBy.email,
                role: deletedPatient.createdBy.role,
              }
            : null,
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Permanent Patient Delete Error:", error);

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