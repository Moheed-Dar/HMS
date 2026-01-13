// app/api/consultation/create/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Consultation from "@/backend/models/Consultation";
import Doctor from "@/backend/models/Doctor";
import Patient from "@/backend/models/Patient";
import { verifyToken } from "@/backend/lib/jwt";

export async function POST(request) {
  try {
    await connectDB();

    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: "Login required" }, { status: 401 });
    }

    const verification = verifyToken(token);
    if (!verification.valid || !verification.decoded) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    if (verification.decoded.role !== "doctor") {
      return NextResponse.json({ success: false, message: "Only doctors can create consultations" }, { status: 403 });
    }

    const doctorId = verification.decoded.id;

    const doctor = await Doctor.findById(doctorId).select("status isDeleted").lean();
    if (!doctor || doctor.isDeleted || doctor.status !== "active") {
      return NextResponse.json({ success: false, message: "Unauthorized doctor" }, { status: 403 });
    }

    const body = await request.json();

    console.log("[CREATE CONSULTATION] Received body:", body);

    const {
      patientId,
      appointmentId,
      type = "in-person",
      durationMinutes = 15,
      chiefComplaint,
      historyOfPresentIllness,
      examinationFindings,
      diagnosis,
      treatmentPlan,
      notes,
      followUpDate,
    } = body;

    if (!patientId) {
      return NextResponse.json({ success: false, message: "patientId is required" }, { status: 400 });
    }

    // Validate ID format
    if (!patientId.match(/^[0-9a-fA-F]{24}$/)) {
      console.log("[CREATE CONSULTATION] Invalid patientId format:", patientId);
      return NextResponse.json(
        { success: false, message: "Invalid patientId format (must be 24 hex chars)" },
        { status: 400 }
      );
    }

    // Debug patient lookup
    console.log("[DEBUG] Searching patient with ID:", patientId);
    const patient = await Patient.findById(patientId).select("_id name email").lean();
    
    if (!patient) {
      console.log("[DEBUG] Patient query returned null - ID does NOT exist:", patientId);
      return NextResponse.json(
        { success: false, message: "Patient not found - check if the patient ID exists in database" },
        { status: 404 }
      );
    }

    console.log("[DEBUG] Patient FOUND:", patient._id.toString(), patient.name || "no name");

    // Create consultation
    const consultation = await Consultation.create({
      doctor: doctorId,
      patient: patientId,
      appointment: appointmentId || null,
      type,
      durationMinutes,
      chiefComplaint: chiefComplaint?.trim(),
      historyOfPresentIllness: historyOfPresentIllness?.trim(),
      examinationFindings: examinationFindings?.trim(),
      diagnosis: diagnosis?.trim(),
      treatmentPlan: treatmentPlan?.trim(),
      notes: notes?.trim(),
      followUpDate: followUpDate ? new Date(followUpDate) : null,
      createdBy: doctorId,
      createdByModel: "Doctor",
      updatedBy: doctorId,
      updatedByModel: "Doctor",
      status: "completed",
    });

    // Response mein SAB KUCH return kar rahe hain jo save hua (input + generated fields)
    return NextResponse.json({
      success: true,
      message: "Consultation created successfully",
      consultation: {
        // Generated / DB fields
        id: consultation._id.toString(),
        createdAt: consultation.createdAt.toISOString(),
        updatedAt: consultation.updatedAt.toISOString(),
        status: consultation.status,

        // Input fields jo save hue
        doctor: doctorId,
        patient: patientId,
        patientName: patient.name || "N/A",
        patientEmail: patient.email || "N/A",
        appointment: appointmentId || null,
        type,
        durationMinutes,
        chiefComplaint: consultation.chiefComplaint,
        historyOfPresentIllness: consultation.historyOfPresentIllness,
        examinationFindings: consultation.examinationFindings,
        diagnosis: consultation.diagnosis,
        treatmentPlan: consultation.treatmentPlan,
        notes: consultation.notes,
        followUpDate: consultation.followUpDate ? consultation.followUpDate.toISOString() : null,

        // Audit fields
        createdBy: consultation.createdBy.toString(),
        createdByModel: consultation.createdByModel,
        updatedBy: consultation.updatedBy.toString(),
        updatedByModel: consultation.updatedByModel,
      },
    }, { status: 201 });

  } catch (error) {
    console.error("Consultation Create Error:", error.message, error.stack);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create consultation",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}