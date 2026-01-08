
import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Patient from "@/backend/models/Patient";
import { verifyToken } from "@/backend/lib/jwt";

const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/6596/6596121.png";

export async function GET(request) {
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

    const { role, permissions = [] } = verification.decoded;

    // === AUTHORIZATION ===
    const canViewPatients =
      role === "superadmin" ||
      role === "admin" ||
      permissions.includes("view_patients");

    if (!canViewPatients) {
      return NextResponse.json(
        {
          success: false,
          message: "Access Denied: You don't have permission to view patients",
        },
        { status: 403 }
      );
    }

    // === QUERY PARAMS ===
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const search = searchParams.get("search")?.trim() || "";
    const statusFilter = searchParams.get("status") || "";

    const skip = (page - 1) * limit;

    // === BUILD QUERY ===
    let query = { role: "patient" };

    if (statusFilter) {
      query.status = statusFilter;
    }

    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
      ];
    }

    // === FETCH PATIENTS WITH POPULATE ===
    const patients = await Patient.find(query)
      .select("-password")
      .populate("assignedDoctor", "name email specialization")
      .populate("createdBy", "name email role")     // ← createdBy populate
      .populate("updatedBy", "name email role")     // ← updatedBy populate
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // === TOTAL COUNT ===
    const totalPatients = await Patient.countDocuments(query);

    // === CLEAN PATIENTS LIST WITH createdBy & updatedBy ===
    const patientsList = patients.map((patient) => {
      const avatar = patient.avatar?.trim() || DEFAULT_AVATAR;

      return {
        id: patient._id,
        name: patient.name?.trim() || "Patient",
        email: patient.email,
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
            }
          : null,
        createdAt: patient.createdAt,
        updatedAt: patient.updatedAt || null,

        // === createdBy full info ===
        createdBy: patient.createdBy
          ? {
              id: patient.createdBy._id,
              name: patient.createdBy.name,
              email: patient.createdBy.email,
              role: patient.createdBy.role,
            }
          : null,

        // === updatedBy full info (agar update hua ho) ===
        updatedBy: patient.updatedBy
          ? {
              id: patient.updatedBy._id,
              name: patient.updatedBy.name,
              email: patient.updatedBy.email,
              role: patient.updatedBy.role,
            }
          : null,
      };
    });

    // === SUCCESS RESPONSE ===
    return NextResponse.json(
      {
        success: true,
        message: "Patients fetched successfully",
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
    console.error("Get All Patients API Error:", error);
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