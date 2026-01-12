// app/api/doctor/prescriptions/updatebyid/[id]/route.js
// PUT: Doctor apni prescription update kar sake

import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Prescription from "@/backend/models/Prescription";
import Doctor from "@/backend/models/Doctor";
import { verifyToken } from "@/backend/lib/jwt";

export async function PUT(request, context) {
  try {
    await connectDB();

    const { id: prescriptionId } = await context.params;

    if (!prescriptionId || prescriptionId.length !== 24) {
      return NextResponse.json({ success: false, message: "Invalid Prescription ID" }, { status: 400 });
    }

    // Token verification...
    const token = request.cookies.get("token")?.value || 
                  request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) return NextResponse.json({ success: false, message: "Login required" }, { status: 401 });

    const verification = verifyToken(token);
    if (!verification.valid || !verification.decoded) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    const { id: userId, role } = verification.decoded;

    if (role !== "doctor") {
      return NextResponse.json({ success: false, message: "Only doctors can update" }, { status: 403 });
    }

    const doctor = await Doctor.findById(userId).select("name status permissions");
    if (!doctor || doctor.status !== "active" || !doctor.permissions?.includes("update_prescription")) {
      return NextResponse.json({ success: false, message: "Unauthorized or no permission" }, { status: 403 });
    }

    const body = await request.json();
    const { medicines, diagnosis, advice, followUpDate } = body;

    if (!medicines || !Array.isArray(medicines) || medicines.length === 0) {
      return NextResponse.json({ success: false, message: "At least one medicine required" }, { status: 400 });
    }

    const prescription = await Prescription.findOne({
      _id: prescriptionId,
      doctor: userId,
      isDeleted: false,
    }).populate("appointment patient");

    if (!prescription) {
      return NextResponse.json({ success: false, message: "Prescription not found" }, { status: 404 });
    }

    // Update fields
    prescription.medicines = medicines.map(med => ({
      name: med.name?.trim() || "",
      dosage: med.dosage?.trim() || "",
      frequency: med.frequency?.trim() || "",
      duration: med.duration?.trim() || "",
      instructions: med.instructions?.trim() || "",
    }));

    prescription.diagnosis = diagnosis?.trim() || prescription.diagnosis;
    prescription.advice = advice?.trim() || prescription.advice;
    prescription.followUpDate = followUpDate ? new Date(followUpDate) : prescription.followUpDate;

    // UPDATED BY – Yeh must hai
    prescription.updatedBy = userId;
    prescription.updatedByModel = "Doctor";

    // Save with debug
    await prescription.save();

    console.log("Prescription updated:", {
      id: prescription._id.toString(),
      updatedBy: prescription.updatedBy?.toString(),
      updatedByModel: prescription.updatedByModel,
      updatedAt: prescription.updatedAt,
    });

    // Populate for response
    await prescription.populate("doctor", "name specialization");
    await prescription.populate("updatedBy", "name email role");

    // Response
    return NextResponse.json({
      success: true,
      message: "Prescription updated successfully",
      data: {
        prescription: {
          id: prescription._id.toString(),
          appointment: prescription.appointment ? {
            id: prescription.appointment._id.toString(),
            date: prescription.appointment.date,
            timeSlot: prescription.appointment.timeSlot,
            status: prescription.appointment.status,
          } : null,
          doctor: prescription.doctor ? {
            id: prescription.doctor._id.toString(),
            name: prescription.doctor.name,
            specialization: prescription.doctor.specialization,
          } : null,
          patient: prescription.patient ? {
            id: prescription.patient._id.toString(),
            name: prescription.patient.name,
            email: prescription.patient.email || null,
            phone: prescription.patient.phone || null,
          } : null,
          medicines: prescription.medicines,
          diagnosis: prescription.diagnosis,
          advice: prescription.advice,
          followUpDate: prescription.followUpDate,
          createdAt: prescription.createdAt,
          updatedAt: prescription.updatedAt,
          updatedBy: prescription.updatedBy ? {
            id: prescription.updatedBy._id.toString(),
            name: prescription.updatedBy.name || "N/A",
            email: prescription.updatedBy.email || null,
            role: prescription.updatedBy.role || null,
          } : null,
          updatedByModel: prescription.updatedByModel || null,
        },
      },
    }, { status: 200 });

  } catch (error) {
    console.error("Update Prescription Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}