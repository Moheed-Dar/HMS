// app/api/patients/[id]/route.js
// GET: Single Patient by ID - Doctor sirf apne appointment wale patients dekh sake

import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Patient from "@/backend/models/Patient";
import Appointment from "@/backend/models/Appointment"; // ← Yeh import add karna zaroori hai
import { verifyToken } from "@/backend/lib/jwt";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/6596/6596121.png";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id: patientId } = await params; // URL se ID

    // === TOKEN VERIFICATION ===
    const token =
      request.cookies.get("token")?.value ||
      request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ success: false, message: "Login required" }, { status: 401 });
    }

    const verification = verifyToken(token);
    if (!verification.valid || !verification.decoded) {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
    }

    const { id: userId, role, permissions = [] } = verification.decoded;

    // === PERMISSION CHECK ===
    const hasViewPatientsPermission = permissions.includes("view_patients");

    if (!hasViewPatientsPermission) {
      return NextResponse.json(
        { success: false, message: "Access Denied: You don't have permission to view patient details" },
        { status: 403 }
      );
    }

    // === VALIDATE PATIENT ID ===
    if (!patientId || patientId.length !== 24) {
      return NextResponse.json({ success: false, message: "Invalid Patient ID" }, { status: 400 });
    }

    // === FIND PATIENT ===
    const patient = await Patient.findOne({
      _id: patientId,
      role: "patient",
    })
      .select("-password")
      .populate("assignedDoctor", "name email specialization phone avatar")
      .populate("createdBy", "name email role")
      .populate("updatedBy", "name email role")
      .lean();

    if (!patient) {
      return NextResponse.json({ success: false, message: "Patient not found" }, { status: 404 });
    }

    // === DOCTOR RESTRICTION: Sirf apne appointment wale patient dekh sake ===
    if (role === "doctor") {
      const hasAppointment = await Appointment.exists({
        patient: patientId,
        doctor: userId,
        isDeleted: { $ne: true },
      });

      if (!hasAppointment) {
        return NextResponse.json(
          {
            success: false,
            message: "Access Denied: This patient is not associated with any of your appointments",
          },
          { status: 403 }
        );
      }
    }

    // === FORMAT RESPONSE ===
    const avatar = patient.avatar?.trim() || DEFAULT_AVATAR;

    const patientDetails = {
      id: patient._id,
      name: patient.name?.trim() || "Patient",
      email: patient.email || null,
      phone: patient.phone || null,
      address: patient.address || null,
      avatar,
      dateOfBirth: patient.dateOfBirth || null,
      gender: patient.gender || null,
      bloodGroup: patient.bloodGroup || null,
      emergencyContact: patient.emergencyContact || null,
      medicalHistory: patient.medicalHistory || null,
      status: patient.status || "active",
      assignedDoctor: patient.assignedDoctor
        ? {
            id: patient.assignedDoctor._id,
            name: patient.assignedDoctor.name,
            email: patient.assignedDoctor.email,
            specialization: patient.assignedDoctor.specialization,
            phone: patient.assignedDoctor.phone,
            avatar: patient.assignedDoctor.avatar || DEFAULT_AVATAR,
          }
        : null,
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt || null,
      createdBy: patient.createdBy
        ? {
            id: patient.createdBy._id,
            name: patient.createdBy.name,
            email: patient.createdBy.email,
            role: patient.createdBy.role,
          }
        : null,
      updatedBy: patient.updatedBy
        ? {
            id: patient.updatedBy._id,
            name: patient.updatedBy.name,
            email: patient.updatedBy.email,
            role: patient.updatedBy.role,
          }
        : null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Patient details fetched successfully",
        patient: patientDetails,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Get Patient by ID Error:", error);
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