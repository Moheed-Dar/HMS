
import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Appointment from "@/backend/models/Appointment";
import Patient from "@/backend/models/Patient";
import { verifyToken } from "@/backend/lib/jwt";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/6596/6596121.png";

export async function GET(request) {
  try {
    await connectDB();

    // === TOKEN VERIFICATION ===
    const token =
      request.cookies.get("token")?.value ||
      request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ success: false, message: "Login required" }, { status: 401 });
    }

    const verification = verifyToken(token);
    if (!verification.valid || !verification.decoded) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    const { id: doctorId, role } = verification.decoded;

    if (role !== "doctor") {
      return NextResponse.json(
        { success: false, message: "Only doctors can access their patients" },
        { status: 403 }
      );
    }

    // === QUERY PARAMS ===
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const search = searchParams.get("search")?.trim() || "";

    const skip = (page - 1) * limit;

    // === STEP 1: Doctor ke saare appointments se unique patient IDs nikaalen
    const appointments = await Appointment.find({
      doctor: doctorId,
      isDeleted: { $ne: true },
    }).distinct("patient"); // sirf unique patient IDs

    if (appointments.length === 0) {
      return NextResponse.json(
        {
          success: true,
          message: "You haven't created any appointments yet",
          patients: [],
          pagination: { currentPage: 1, totalPages: 0, totalPatients: 0 },
        },
        { status: 200 }
      );
    }

    // === STEP 2: Unique patient IDs se patients fetch karo ===
    let query = {
      _id: { $in: appointments },
      role: "patient",
    };

    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
      ];
    }

    const patients = await Patient.find(query)
      .select("-password")
      .populate("assignedDoctor", "name email specialization")
      .populate("createdBy", "name email role")
      .populate("updatedBy", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalPatients = await Patient.countDocuments(query);

    // === FORMAT RESPONSE ===
    const patientsList = patients.map((patient) => ({
      id: patient._id,
      name: patient.name?.trim() || "Unknown Patient",
      email: patient.email || null,
      phone: patient.phone || null,
      avatar: patient.avatar?.trim() || DEFAULT_AVATAR,
      gender: patient.gender || null,
      dateOfBirth: patient.dateOfBirth || null,
      status: patient.status || "active",
      assignedDoctor: patient.assignedDoctor
        ? {
            id: patient.assignedDoctor._id,
            name: patient.assignedDoctor.name,
          }
        : null,
      lastAppointment: patient.lastAppointment || null, // optional field agar rakha ho
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,
    }));

    return NextResponse.json(
      {
        success: true,
        message: "Your patients (from appointments) fetched successfully",
        patients: patientsList,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalPatients / limit),
          totalPatients,
          hasNextPage: page < Math.ceil(totalPatients / limit),
          hasPrevPage: page > 1,
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Doctor My Patients Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}