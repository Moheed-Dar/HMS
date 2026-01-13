// app/api/medical-records/doctor-my-patients/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import mongoose from "mongoose";
import MedicalRecord from "@/backend/models/MedicalRecord";
import Consultation from "@/backend/models/Consultation";
import Doctor from "@/backend/models/Doctor";
import Patient from "@/backend/models/Patient";
import Appointment from "@/backend/models/Appointment";
import Prescription from "@/backend/models/Prescription";
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

    const { id: doctorId } = verification.decoded;

    // Verify active doctor
    const doctor = await Doctor.findById(doctorId)
      .select("name email role status isDeleted permissions")
      .lean();

    if (!doctor || doctor.isDeleted || doctor.status !== "active") {
      return NextResponse.json({ success: false, message: "Unauthorized doctor access" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit")) || 10));
    const patientId = searchParams.get("patientId")?.trim();
    const statusFilter = searchParams.get("status");

    const skip = (page - 1) * limit;

    // ── Medical Records Query ───────────────────────────────────────
    const recordQuery = {
      isDeleted: { $ne: true },
      $or: [
        { createdBy: doctorId, createdByModel: "Doctor" },
        { updatedBy: doctorId, updatedByModel: "Doctor" },
      ],
    };

    if (patientId) {
      if (!patientId.match(/^[0-9a-fA-F]{24}$/)) {
        return NextResponse.json({ success: false, message: "Invalid patient ID format" }, { status: 400 });
      }
      recordQuery.patient = patientId;
    }

    if (statusFilter && ["active", "archived"].includes(statusFilter)) {
      recordQuery.status = statusFilter;
    }

    // Fetch Medical Records
    const records = await MedicalRecord.find(recordQuery)
      .populate("appointment", "date timeSlot status reason notes")
      .populate({
        path: "prescription",
        select: "medicines diagnosis advice followUpDate updatedBy updatedByModel updatedAt",
        populate: { path: "updatedBy", select: "name email role" },
      })
      .populate("createdBy", "name email role")
      .populate("updatedBy", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalRecords = await MedicalRecord.countDocuments(recordQuery);

    // ── Consultations Query ─────────────────────────────────────────
    const consultationQuery = {
      doctor: doctorId,
      isDeleted: { $ne: true },
    };

    if (patientId) {
      consultationQuery.patient = patientId;
    }

    if (statusFilter) {
      consultationQuery.status = statusFilter;
    }

    const consultations = await Consultation.find(consultationQuery)
      .populate("patient", "name email phone avatar gender dateOfBirth")
      .populate("appointment", "date timeSlot status reason notes")
      .populate({
        path: "prescriptions",
        select: "medicines diagnosis advice followUpDate",
      })
      .sort({ date: -1 })
      .lean();

    // ── Collect valid patient IDs (safe handling) ───────────────────
    const allPatientIds = new Set();

    records.forEach(r => {
      if (r.patient && mongoose.isValidObjectId(r.patient)) {
        allPatientIds.add(r.patient.toString());
      }
    });

    consultations.forEach(c => {
      if (c.patient && mongoose.isValidObjectId(c.patient)) {
        allPatientIds.add(c.patient.toString());
      }
    });

    const patients = await Patient.find({ _id: { $in: Array.from(allPatientIds) } })
      .select("name email phone avatar gender dateOfBirth")
      .lean();

    const patientMap = new Map(patients.map(p => [p._id.toString(), p]));

    // ── Format User Helper ──────────────────────────────────────────
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
          name: `${modelFromDoc} (possibly deleted)`,
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

    // ── Format Medical Records ──────────────────────────────────────
    const recordsList = records.map(r => {
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

      let finalUpdatedByDoc = r.updatedBy;
      let finalUpdatedByModel = r.updatedByModel;

      if (!finalUpdatedByDoc && r.prescription?.updatedBy) {
        finalUpdatedByDoc = r.prescription.updatedBy;
        finalUpdatedByModel = r.prescription.updatedByModel || "Doctor";
      }

      const createdByData = formatUser(r.createdBy, r.createdByModel, "Unknown Creator");
      const updatedByData = formatUser(finalUpdatedByDoc, finalUpdatedByModel, "Not updated yet");

      return {
        type: "medical-record",
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

    // ── Format Consultations ────────────────────────────────────────
    const consultationsList = consultations.map(c => {
      let patientData = null;
      if (c.patient) {
        const patient = patientMap.get(c.patient.toString());
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
              id: c.patient.toString(),
              name: "Patient Not Found",
              email: null,
              phone: null,
              avatar: DEFAULT_AVATAR,
              gender: null,
              dateOfBirth: null,
            };
      }

      const appointmentData = c.appointment
        ? {
            id: c.appointment._id.toString(),
            date: c.appointment.date,
            timeSlot: c.appointment.timeSlot,
            status: c.appointment.status,
            reason: c.appointment.reason || null,
            notes: c.appointment.notes || null,
          }
        : null;

      const prescriptionsData = (c.prescriptions || []).map(p => ({
        id: p._id.toString(),
        medicines: p.medicines || [],
        diagnosis: p.diagnosis || null,
        advice: p.advice || null,
        followUpDate: p.followUpDate || null,
      }));

      return {
        type: "consultation",
        id: c._id.toString(),
        patient: patientData,
        appointment: appointmentData,
        prescriptions: prescriptionsData,
        chiefComplaint: c.chiefComplaint || null,
        historyOfPresentIllness: c.historyOfPresentIllness || null,
        examinationFindings: c.examinationFindings || null,
        diagnosis: c.diagnosis || null,
        treatmentPlan: c.treatmentPlan || null,
        notes: c.notes || null,
        status: c.status || "scheduled",
        type: c.type,
        durationMinutes: c.durationMinutes,
        followUpDate: c.followUpDate || null,
        date: c.date,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      };
    });

    return NextResponse.json({
      success: true,
      message: "Doctor's medical records and consultations fetched successfully",
      data: {
        records: recordsList,
        consultations: consultationsList,
      },
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit),
        totalRecords,
        hasNextPage: page < Math.ceil(totalRecords / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("❌ Doctor Records & Consultations Error:", error.message, error.stack);
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