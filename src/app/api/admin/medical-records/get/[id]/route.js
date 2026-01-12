// app/api/medical-records/admin-get/[id]/route.js
// GET: Admin side - Single Medical Record by ID (with medical_records_view permission)

import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import MedicalRecord from "@/backend/models/MedicalRecord";
import Admin from "@/backend/models/Admin";
import Patient from "@/backend/models/Patient";
import { verifyToken } from "@/backend/lib/jwt";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/6596/6596121.png";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id: recordId } = await params;

    // Token verification
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

    const { id: userId } = verification.decoded;

    // Admin verification
    const admin = await Admin.findById(userId)
      .select("permissions status isDeleted")
      .lean();

    if (!admin || admin.isDeleted || admin.status !== "active") {
      return NextResponse.json(
        { success: false, message: "Unauthorized admin access" },
        { status: 403 }
      );
    }

    if (!admin.permissions?.includes("medical_records_view")) {
      return NextResponse.json(
        { success: false, message: "No permission to view medical records" },
        { status: 403 }
      );
    }

    // Validate ID
    if (!recordId || !/^[0-9a-fA-F]{24}$/.test(recordId)) {
      return NextResponse.json({ success: false, message: "Invalid Medical Record ID" }, { status: 400 });
    }

    // Fetch single record with deep population
    const record = await MedicalRecord.findOne({
      _id: recordId,
      isDeleted: { $ne: true },
    })
      .populate("patient", "name email phone avatar gender dateOfBirth")
      .populate("appointment", "date timeSlot status reason notes")
      .populate({
        path: "prescription",
        select: "medicines diagnosis advice followUpDate updatedBy updatedByModel updatedAt",
        populate: {
          path: "updatedBy",
          select: "name email role",
        },
      })
      .populate("createdBy", "name email role")
      .populate("updatedBy", "name email role")
      .lean();

    if (!record) {
      return NextResponse.json({ success: false, message: "Medical record not found" }, { status: 404 });
    }

    // Helper to format user objects consistently
    const formatUser = (userDoc, model = null, fallbackName = "Not set") => {
      if (userDoc && userDoc._id) {
        return {
          id: userDoc._id.toString(),
          name: userDoc.name || "N/A",
          email: userDoc.email || null,
          role: userDoc.role || null,
          model: model || "Unknown",
        };
      }

      if (model) {
        return {
          id: null,
          name: `${model} (possibly deleted)`,
          email: null,
          role: null,
          model,
        };
      }

      return {
        id: null,
        name: fallbackName,
        email: null,
        role: null,
        model: null,
      };
    };

    // Prefer record audit fields → fallback to prescription audit fields
    let finalUpdatedByDoc = record.updatedBy;
    let finalUpdatedByModel = record.updatedByModel;

    if (!finalUpdatedByDoc && record.prescription?.updatedBy) {
      finalUpdatedByDoc = record.prescription.updatedBy;
      finalUpdatedByModel = record.prescription.updatedByModel || "Doctor";
    }

    const recordDetails = {
      id: record._id.toString(),
      patient: record.patient
        ? {
            id: record.patient._id.toString(),
            name: record.patient.name || "N/A",
            email: record.patient.email || null,
            phone: record.patient.phone || null,
            avatar: record.patient.avatar?.trim() || DEFAULT_AVATAR,
            gender: record.patient.gender || null,
            dateOfBirth: record.patient.dateOfBirth || null,
          }
        : null,

      appointment: record.appointment
        ? {
            id: record.appointment._id.toString(),
            date: record.appointment.date,
            timeSlot: record.appointment.timeSlot,
            status: record.appointment.status,
            reason: record.appointment.reason || null,
            notes: record.appointment.notes || null,
          }
        : null,

      prescription: record.prescription
        ? {
            id: record.prescription._id.toString(),
            medicines: record.prescription.medicines || [],
            diagnosis: record.prescription.diagnosis || null,
            advice: record.prescription.advice || null,
            followUpDate: record.prescription.followUpDate || null,
          }
        : null,

      details: record.details || null,
      notes: record.notes || null,
      status: record.status || "active",

      createdBy: formatUser(record.createdBy, record.createdByModel, "Unknown Creator"),

      updatedBy: formatUser(finalUpdatedByDoc, finalUpdatedByModel, "Not updated yet"),

      createdAt: record.createdAt?.toISOString() || null,
      updatedAt: record.updatedAt?.toISOString() || record.prescription?.updatedAt?.toISOString() || null,
    };

    return NextResponse.json({
      success: true,
      message: "Medical record details fetched successfully",
      record: recordDetails,
    });
  } catch (error) {
    console.error("Admin Get Single Medical Record Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        ...(process.env.NODE_ENV === "development" && { error: error.message }),
      },
      { status: 500 }
    );
  }
}