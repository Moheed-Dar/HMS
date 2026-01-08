// app/api/doctor/prescriptions/deletebyid/[id]/route.js
// DELETE: Sirf doctor hi apni prescription PERMANENTLY delete kar sake ga

import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Prescription from "@/backend/models/Prescription";
import Doctor from "@/backend/models/Doctor";
import { verifyToken } from "@/backend/lib/jwt";

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    // Fix: params await ki zarurat nahi
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

    // === SIRF DOCTOR ALLOW ===
    if (role !== "doctor") {
      return NextResponse.json(
        { success: false, message: "Access denied: Only doctors can delete prescriptions" },
        { status: 403 }
      );
    }

    // === DOCTOR CHECK + PERMISSION ===
    const doctor = await Doctor.findById(userId).select("name status permissions");
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

    if (!doctor.permissions?.includes("delete_prescription")) {
      return NextResponse.json(
        { success: false, message: "Permission denied: You don't have delete_prescription permission" },
        { status: 403 }
      );
    }

    // === FIND PRESCRIPTION (sirf doctor ki apni) ===
    const prescription = await Prescription.findOne({
      _id: prescriptionId,
      doctor: userId,
      // isDeleted check nahi kar rahe kyunke permanent delete hai
    });

    if (!prescription) {
      return NextResponse.json(
        { success: false, message: "Prescription not found or does not belong to you" },
        { status: 404 }
      );
    }

    // === PERMANENT DELETE (Hard Delete) ===
    await Prescription.deleteOne({ _id: prescriptionId });

    const deletedAt = new Date();

    // === SUCCESS RESPONSE WITH DELETE DETAILS ===
    return NextResponse.json(
      {
        success: true,
        message: "Prescription permanently deleted successfully",
        data: {
          prescriptionId: prescriptionId,
          deletedBy: {
            id: doctor._id,
            name: doctor.name,
            model: "Doctor"
          },
          deletedByModel: "Doctor",
          deletedAt: deletedAt.toISOString(),
          note: "This prescription has been permanently removed from the database and cannot be recovered."
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Doctor Permanent Delete Prescription Error:", error);
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