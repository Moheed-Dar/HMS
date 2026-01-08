import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Patient from "@/backend/models/Patient";
import { verifyToken } from "@/backend/lib/jwt";

const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/6596/6596121.png";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params; 

    // === TOKEN CHECK ===
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
    const canViewPatient =
      role === "superadmin" ||
      role === "admin" ||
      permissions.includes("view_patients");

    if (!canViewPatient) {
      return NextResponse.json(
        {
          success: false,
          message: "Access Denied: You don't have permission to view patient details",
        },
        { status: 403 }
      );
    }

    // === FETCH PATIENT ===
    const patient = await Patient.findById(id)
      .select("-password")
      .populate("assignedDoctor", "name email specialization")
      .populate("createdBy", "name email role")
      .lean();

    if (!patient || patient.role !== "patient") {
      return NextResponse.json(
        { success: false, message: "Patient not found" },
        { status: 404 }
      );
    }

    // === AVATAR WITH FALLBACK ===
    const avatar = patient.avatar && patient.avatar.trim()
      ? patient.avatar.trim()
      : DEFAULT_AVATAR;

    // === CLEAN RESPONSE ===
    const patientData = {
      id: patient._id,
      name: patient.name?.trim() || "Patient",
      email: patient.email,
      phone: patient.phone || null,
      address: patient.address || null,
      avatar,
      dateOfBirth: patient.dateOfBirth || null,
      gender: patient.gender || null,
      bloodGroup: patient.bloodGroup || null,
      emergencyContact: patient.emergencyContact || null,
      medicalHistory: patient.medicalHistory || null,
      assignedDoctor: patient.assignedDoctor
        ? {
            id: patient.assignedDoctor._id,
            name: patient.assignedDoctor.name,
            email: patient.assignedDoctor.email,
            specialization: patient.assignedDoctor.specialization || null,
          }
        : null,
      status: patient.status || "active",
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,
      createdBy: patient.createdBy
        ? {
            id: patient.createdBy._id,
            name: patient.createdBy.name,
            email: patient.createdBy.email,
            role: patient.createdBy.role,
          }
        : null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Patient fetched successfully",
        patient: patientData,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Get Patient by ID Error:", error);

    if (error.name === "CastError") {
      return NextResponse.json(
        { success: false, message: "Invalid patient ID" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}