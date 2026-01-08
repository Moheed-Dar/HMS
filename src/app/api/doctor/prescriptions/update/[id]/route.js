// app/api/doctor/prescriptions/updatebyid/[id]/route.js
// PUT: Sirf doctor hi apni prescription update kar sake (update_prescription permission ke saath)

import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Prescription from "@/backend/models/Prescription";
import Doctor from "@/backend/models/Doctor";
import { verifyToken } from "@/backend/lib/jwt";

export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { id: prescriptionId } = await params;

    if (!prescriptionId || prescriptionId.length !== 24) {
      return NextResponse.json(
        { success: false, message: "Invalid Prescription ID" },
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

    const { id: userId, role } = verification.decoded;

    if (role !== "doctor") {
      return NextResponse.json(
        { success: false, message: "Access denied: Only doctors can update prescriptions" },
        { status: 403 }
      );
    }

    // === DOCTOR CHECK + PERMISSION ===
    const doctor = await Doctor.findById(userId).select("name status permissions specialization");
    if (!doctor) {
      return NextResponse.json(
        { success: false, message: "Doctor not found" },
        { status: 403 }
      );
    }

    if (doctor.status !== "active") {
      return NextResponse.json(
        { success: false, message: "Your account is inactive" },
        { status: 403 }
      );
    }

    if (!doctor.permissions?.includes("update_prescription")) {
      return NextResponse.json(
        { success: false, message: "Permission denied: You don't have permission to update prescriptions" },
        { status: 403 }
      );
    }

    // === PARSE BODY ===
    const body = await request.json();
    const {
      medicines,
      diagnosis,
      advice,
      followUpDate,
    } = body;

    if (!medicines || !Array.isArray(medicines) || medicines.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one medicine is required" },
        { status: 400 }
      );
    }

    // === FIND PRESCRIPTION (sirf apni) ===
    const prescription = await Prescription.findOne({
      _id: prescriptionId,
      doctor: userId,
      isDeleted: false,
    })
      .populate("appointment", "date timeSlot status")
      .populate("patient", "name email phone");

    if (!prescription) {
      return NextResponse.json(
        { success: false, message: "Prescription not found or does not belong to you" },
        { status: 404 }
      );
    }

    // === UPDATE FIELDS ===
    prescription.medicines = medicines.map(med => ({
      name: med.name?.trim() || "",
      dosage: med.dosage?.trim() || "",
      frequency: med.frequency?.trim() || "",
      duration: med.duration?.trim() || "",
      instructions: med.instructions?.trim() || "",
    }));

    prescription.diagnosis = diagnosis?.trim() || "";
    prescription.advice = advice?.trim() || "";
    prescription.followUpDate = followUpDate ? new Date(followUpDate) : null;
    prescription.updatedBy = userId;
    prescription.updatedAt = new Date();

    await prescription.save();

    // === POPULATE DOCTOR FOR RESPONSE ===
    await prescription.populate("doctor", "name specialization");

    // === SUCCESS RESPONSE ===
    return NextResponse.json(
      {
        success: true,
        message: "Prescription updated successfully",
        data: {
          prescription: {
            id: prescription._id,
            appointment: {
              id: prescription.appointment._id,
              date: prescription.appointment.date,
              timeSlot: prescription.appointment.timeSlot,
              status: prescription.appointment.status,
            },
            doctor: {
              id: prescription.doctor._id,
              name: prescription.doctor.name,
              specialization: prescription.doctor.specialization,
            },
            patient: {
              id: prescription.patient._id,
              name: prescription.patient.name,
              email: prescription.patient.email || null,
              phone: prescription.patient.phone || null,
            },
            medicines: prescription.medicines,
            diagnosis: prescription.diagnosis,
            advice: prescription.advice,
            followUpDate: prescription.followUpDate,
            createdAt: prescription.createdAt,
            updatedAt: prescription.updatedAt,
          },
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Doctor Update Prescription Error:", error);
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