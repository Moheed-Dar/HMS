// app/api/medical-records/admin-get/route.js
// GET: Admin medical records with fresh patient data and proper audit tracking
// Fix: fallback to prescription.updatedBy when record.updatedBy is missing

import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import MedicalRecord from "@/backend/models/MedicalRecord";
import Admin from "@/backend/models/Admin";
import Patient from "@/backend/models/Patient";
import { verifyToken } from "@/backend/lib/jwt";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/6596/6596121.png";

export async function GET(request) {
  try {
    await connectDB();

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

    const admin = await Admin.findById(userId)
      .select("permissions status isDeleted")
      .lean();

    if (!admin || admin.isDeleted || admin.status !== "active") {
      return NextResponse.json({ success: false, message: "Unauthorized admin access" }, { status: 403 });
    }

    if (!admin.permissions?.includes("medical_records_view")) {
      return NextResponse.json({ success: false, message: "No permission to view medical records" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit")) || 10));
    const patientId = searchParams.get("patientId")?.trim();
    const statusFilter = searchParams.get("status");

    const skip = (page - 1) * limit;

    const query = { isDeleted: { $ne: true } };

    if (patientId) {
      if (!patientId.match(/^[0-9a-fA-F]{24}$/)) {
        return NextResponse.json({ success: false, message: "Invalid patient ID format" }, { status: 400 });
      }
      query.patient = patientId;
    }

    if (statusFilter && ["active", "archived"].includes(statusFilter)) {
      query.status = statusFilter;
    }

    // Fetch records + deeper populate on prescription for updatedBy fallback
    const records = await MedicalRecord.find(query)
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
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalRecords = await MedicalRecord.countDocuments(query);

    // Bulk patient data
    const uniquePatientIds = [...new Set(records.map((r) => r.patient?.toString()).filter(Boolean))];
    const patients = await Patient.find({ _id: { $in: uniquePatientIds } })
      .select("name email phone avatar gender dateOfBirth")
      .lean();

    const patientMap = new Map(patients.map((p) => [p._id.toString(), p]));

    // Helper to safely format user objects
    const formatUser = (userDoc, modelFromDoc = null, fallbackName = "Not updated yet") => {
      if (userDoc && userDoc._id) {
        return {
          id: userDoc._id.toString(),
          name: userDoc.name || "N/A",
          email: userDoc.email || null,
          role: userDoc.role || null,
          model: modelFromDoc || "Unknown",
        };
      }

      if (modelFromDoc) {
        return {
          id: null,
          name: `${modelFromDoc} (ID may be deleted)`,
          email: null,
          role: null,
          model: modelFromDoc,
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

    const recordsList = records.map((r) => {
      // Patient
      let patientData = null;
      if (r.patient) {
        const patient = patientMap.get(r.patient.toString());
        patientData = patient
          ? {
              id: patient._id.toString(),
              name: patient.name || "N/A",
              email: patient.email || null,
              phone: patient.phone || null,
              avatar: patient.avatar?.trim() || DEFAULT_AVATAR,
              gender: patient.gender || null,
              dateOfBirth: patient.dateOfBirth || null,
            }
          : {
              id: r.patient.toString(),
              name: "Patient Not Found",
              email: null,
              phone: null,
              avatar: DEFAULT_AVATAR,
              gender: null,
              dateOfBirth: null,
            };
      }

      const appointmentData = r.appointment
        ? {
            id: r.appointment._id.toString(),
            date: r.appointment.date,
            timeSlot: r.appointment.timeSlot,
            status: r.appointment.status,
            reason: r.appointment.reason || null,
            notes: r.appointment.notes || null,
          }
        : null;

      const prescriptionData = r.prescription
        ? {
            id: r.prescription._id.toString(),
            medicines: r.prescription.medicines || [],
            diagnosis: r.prescription.diagnosis || null,
            advice: r.prescription.advice || null,
            followUpDate: r.prescription.followUpDate || null,
          }
        : null;

      // ────────────────────────────────────────────────
      // UPDATED BY LOGIC – prefer record → fallback to prescription
      let finalUpdatedByDoc = r.updatedBy;
      let finalUpdatedByModel = r.updatedByModel;

      if (!finalUpdatedByDoc && r.prescription?.updatedBy) {
        finalUpdatedByDoc = r.prescription.updatedBy;
        finalUpdatedByModel = r.prescription.updatedByModel || "Doctor";
      }

      const createdByData = formatUser(r.createdBy, r.createdByModel, "Unknown Creator");
      const updatedByData = formatUser(finalUpdatedByDoc, finalUpdatedByModel, "Not updated yet");

      // Optional debug – remove or comment out later
      // if (finalUpdatedByDoc) {
      //   console.log(`Record ${r._id}: updatedBy from ${finalUpdatedByModel || "record"}`);
      // }

      return {
        id: r._id.toString(),
        patient: patientData,
        appointment: appointmentData,
        prescription: prescriptionData,
        details: r.details || null,
        notes: r.notes || null,
        status: r.status || "active",
        createdBy: createdByData,
        updatedBy: updatedByData,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt || r.prescription?.updatedAt || null,
      };
    });

    return NextResponse.json({
      success: true,
      message: "Medical records fetched successfully",
      records: recordsList,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit),
        totalRecords,
        hasNextPage: page < Math.ceil(totalRecords / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("❌ Admin Medical Records Error:", error);
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