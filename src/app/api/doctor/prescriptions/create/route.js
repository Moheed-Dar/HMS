// // app/api/prescriptions/create/route.js
// // POST: Sirf wo doctor prescription bana sake jis ko "create_prescription" permission di gayi ho

// import { NextResponse } from "next/server";
// import { connectDB } from "@/backend/lib/db";
// import Prescription from "@/backend/models/Prescription";
// import Appointment from "@/backend/models/Appointment";
// import Doctor from "@/backend/models/Doctor";
// import Patient from "@/backend/models/Patient"; // populate ke liye zaruri
// import { verifyToken } from "@/backend/lib/jwt";

// export async function POST(request) {
//   try {
//     await connectDB();

//     // === TOKEN VERIFICATION ===
//     const token =
//       request.cookies.get("token")?.value ||
//       request.headers.get("authorization")?.replace("Bearer ", "");

//     if (!token) {
//       return NextResponse.json(
//         { success: false, message: "Login required" },
//         { status: 401 }
//       );
//     }

//     const verification = verifyToken(token);
//     if (!verification.valid || !verification.decoded) {
//       return NextResponse.json(
//         { success: false, message: "Invalid or expired token" },
//         { status: 401 }
//       );
//     }

//     const { id: userId, role } = verification.decoded;

//     if (role !== "doctor") {
//       return NextResponse.json(
//         { success: false, message: "Access denied: Only doctors can create prescriptions" },
//         { status: 403 }
//       );
//     }

//     // === DOCTOR FETCH WITH PERMISSIONS ===
//     const doctor = await Doctor.findById(userId).select("name status permissions specialization");
//     if (!doctor) {
//       return NextResponse.json(
//         { success: false, message: "Doctor not found" },
//         { status: 403 }
//       );
//     }

//     if (doctor.status !== "active") {
//       return NextResponse.json(
//         { success: false, message: "Your account is inactive" },
//         { status: 403 }
//       );
//     }

//     // === PERMISSION CHECK: create_prescription ===
//     if (!doctor.permissions?.includes("create_prescription")) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Permission denied: You don't have permission to create prescriptions",
//         },
//         { status: 403 }
//       );
//     }

//     // === PARSE BODY ===
//     const body = await request.json();
//     const {
//       appointment: appointmentId,
//       medicines,
//       diagnosis,
//       advice,
//       followUpDate,
//     } = body;

//     if (!appointmentId) {
//       return NextResponse.json(
//         { success: false, message: "Appointment ID is required" },
//         { status: 400 }
//       );
//     }

//     if (!medicines || !Array.isArray(medicines) || medicines.length === 0) {
//       return NextResponse.json(
//         { success: false, message: "At least one medicine is required" },
//         { status: 400 }
//       );
//     }

//     // === VALIDATE APPOINTMENT ===
//     const appointment = await Appointment.findOne({
//       _id: appointmentId,
//       doctor: userId,
//       isDeleted: { $ne: true },
//     }).populate("patient", "name email phone");

//     if (!appointment) {
//       return NextResponse.json(
//         { success: false, message: "Appointment not found or does not belong to you" },
//         { status: 404 }
//       );
//     }

//     if (!["completed", "confirmed"].includes(appointment.status)) {
//       return NextResponse.json(
//         { success: false, message: "Prescription can only be added to completed or confirmed appointments" },
//         { status: 400 }
//       );
//     }

//     // Check duplicate prescription
//     const existingPrescription = await Prescription.findOne({
//       appointment: appointmentId,
//       isDeleted: false,
//     });

//     if (existingPrescription) {
//       return NextResponse.json(
//         { success: false, message: "Prescription already exists for this appointment" },
//         { status: 409 }
//       );
//     }

//     // === CREATE PRESCRIPTION ===
//     const newPrescription = await Prescription.create({
//       appointment: appointmentId,
//       doctor: userId,
//       patient: appointment.patient._id,
//       medicines: medicines.map(med => ({
//         name: med.name?.trim() || "",
//         dosage: med.dosage?.trim() || "",
//         frequency: med.frequency?.trim() || "",
//         duration: med.duration?.trim() || "",
//         instructions: med.instructions?.trim() || "",
//       })),
//       diagnosis: diagnosis?.trim() || "",
//       advice: advice?.trim() || "",
//       followUpDate: followUpDate ? new Date(followUpDate) : null,
//       createdBy: userId,
//     });

//     // === POPULATE FOR RESPONSE ===
//     const populated = await Prescription.findById(newPrescription._id)
//       .populate("appointment", "date timeSlot status")
//       .populate("doctor", "name specialization")
//       .populate("patient", "name email phone")
//       .lean();

//     // === SUCCESS RESPONSE ===
//     return NextResponse.json(
//       {
//         success: true,
//         message: "Prescription created successfully",
//         data: {
//           prescription: {
//             id: populated._id,
//             appointment: {
//               id: populated.appointment._id,
//               date: populated.appointment.date,
//               timeSlot: populated.appointment.timeSlot,
//               status: populated.appointment.status,
//             },
//             doctor: {
//               id: populated.doctor._id,
//               name: populated.doctor.name,
//               specialization: populated.doctor.specialization,
//             },
//             patient: {
//               id: populated.patient._id,
//               name: populated.patient.name,
//               email: populated.patient.email || null,
//               phone: populated.patient.phone || null,
//             },
//             medicines: populated.medicines,
//             diagnosis: populated.diagnosis,
//             advice: populated.advice,
//             followUpDate: populated.followUpDate,
//             createdAt: populated.createdAt,
//           },
//         },
//       },
//       { status: 201 }
//     );

//   } catch (error) {
//     console.error("Doctor Create Prescription Error:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Server error",
//         error: process.env.NODE_ENV === "development" ? error.message : "Something went wrong",
//       },
//       { status: 500 }
//     );
//   }
// }














// app/api/prescriptions/create/route.js
// POST: Doctor prescription bana sake + Auto Medical Record create

import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Prescription from "@/backend/models/Prescription";
import Appointment from "@/backend/models/Appointment";
import Doctor from "@/backend/models/Doctor";
import Patient from "@/backend/models/Patient";
import MedicalRecord from "@/backend/models/MedicalRecord"; // ← Auto create ke liye import karo
import { verifyToken } from "@/backend/lib/jwt";

export async function POST(request) {
  try {
    await connectDB();

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
        { success: false, message: "Access denied: Only doctors can create prescriptions" },
        { status: 403 }
      );
    }

    // === DOCTOR FETCH WITH PERMISSIONS ===
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

    // === PERMISSION CHECK: create_prescription ===
    if (!doctor.permissions?.includes("create_prescription")) {
      return NextResponse.json(
        {
          success: false,
          message: "Permission denied: You don't have permission to create prescriptions",
        },
        { status: 403 }
      );
    }

    // === PARSE BODY ===
    const body = await request.json();
    const {
      appointment: appointmentId,
      medicines,
      diagnosis,
      advice,
      followUpDate,
    } = body;

    if (!appointmentId) {
      return NextResponse.json(
        { success: false, message: "Appointment ID is required" },
        { status: 400 }
      );
    }

    if (!medicines || !Array.isArray(medicines) || medicines.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one medicine is required" },
        { status: 400 }
      );
    }

    // === VALIDATE APPOINTMENT ===
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      doctor: userId,
      isDeleted: { $ne: true },
    }).populate("patient", "name email phone");

    if (!appointment) {
      return NextResponse.json(
        { success: false, message: "Appointment not found or does not belong to you" },
        { status: 404 }
      );
    }

    if (!["completed", "confirmed"].includes(appointment.status)) {
      return NextResponse.json(
        { success: false, message: "Prescription can only be added to completed or confirmed appointments" },
        { status: 400 }
      );
    }

    // Check duplicate prescription
    const existingPrescription = await Prescription.findOne({
      appointment: appointmentId,
      isDeleted: false,
    });

    if (existingPrescription) {
      return NextResponse.json(
        { success: false, message: "Prescription already exists for this appointment" },
        { status: 409 }
      );
    }

    // === CREATE PRESCRIPTION ===
    const newPrescription = await Prescription.create({
      appointment: appointmentId,
      doctor: userId,
      patient: appointment.patient._id,
      medicines: medicines.map(med => ({
        name: med.name?.trim() || "",
        dosage: med.dosage?.trim() || "",
        frequency: med.frequency?.trim() || "",
        duration: med.duration?.trim() || "",
        instructions: med.instructions?.trim() || "",
      })),
      diagnosis: diagnosis?.trim() || "",
      advice: advice?.trim() || "",
      followUpDate: followUpDate ? new Date(followUpDate) : null,
      createdBy: userId,
    });

    // === AUTOMATICALLY CREATE MEDICAL RECORD ===
    await MedicalRecord.create({
      patient: appointment.patient._id,
      appointment: appointmentId,
      prescription: newPrescription._id,
      details: diagnosis?.trim() || "No diagnosis provided",
      notes: advice?.trim() || "No additional notes",
      status: "active",
      createdBy: userId,
      createdByModel: "Doctor",
    });

    // === POPULATE FOR RESPONSE ===
    const populated = await Prescription.findById(newPrescription._id)
      .populate("appointment", "date timeSlot status")
      .populate("doctor", "name specialization")
      .populate("patient", "name email phone")
      .lean();

    // === SUCCESS RESPONSE ===
    return NextResponse.json(
      {
        success: true,
        message: "Prescription created successfully. Medical record auto-added.",
        data: {
          prescription: {
            id: populated._id,
            appointment: {
              id: populated.appointment._id,
              date: populated.appointment.date,
              timeSlot: populated.appointment.timeSlot,
              status: populated.appointment.status,
            },
            doctor: {
              id: populated.doctor._id,
              name: populated.doctor.name,
              specialization: populated.doctor.specialization,
            },
            patient: {
              id: populated.patient._id,
              name: populated.patient.name,
              email: populated.patient.email || null,
              phone: populated.patient.phone || null,
            },
            medicines: populated.medicines,
            diagnosis: populated.diagnosis,
            advice: populated.advice,
            followUpDate: populated.followUpDate,
            createdAt: populated.createdAt,
          },
        },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Doctor Create Prescription Error:", error);
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