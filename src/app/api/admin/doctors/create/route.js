import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Doctor from "@/backend/models/Doctor";
import { verifyToken } from "@/backend/lib/jwt";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    await connectDB();

    // === AUTHENTICATION ===
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Login required" },
        { status: 401 }
      );
    }

    const verification = verifyToken(token);
    if (!verification.valid) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    // === SMART ACCESS CONTROL ===
    const role = verification.decoded.role;
    const permissions = verification.decoded.permissions || [];

    if (role !== "superadmin" && role !== "admin") {
      if (!permissions.includes("create_doctors")) {
        return NextResponse.json(
          {
            success: false,
            message: "Access Denied: You don't have 'create_doctors' permission",
          },
          { status: 403 }
        );
      }
    }

    // === PARSE BODY ===
    const body = await request.json();
    const {
      name,
      email,
      password,
      phone,
      specialization,
      licenseNumber,
      department,
      experience,
      qualifications = [],
      consultationFee = 0,
      availableDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      availableTimeSlots = [],
      avatar,
      permissions: providedPermissions,
    } = body;

    // === VALIDATIONS (same as before) ===
    if (!name?.trim()) return NextResponse.json({ success: false, message: "Name is required" }, { status: 400 });
    if (!email?.trim()) return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
    if (!password || password.length < 6) return NextResponse.json({ success: false, message: "Password must be at least 6 characters" }, { status: 400 });
    if (!phone?.trim()) return NextResponse.json({ success: false, message: "Phone is required" }, { status: 400 });
    if (!specialization?.trim()) return NextResponse.json({ success: false, message: "Specialization is required" }, { status: 400 });
    if (!licenseNumber?.trim()) return NextResponse.json({ success: false, message: "License number is required" }, { status: 400 });
    if (!department?.trim()) return NextResponse.json({ success: false, message: "Department is required" }, { status: 400 });
    if (experience === undefined || experience < 0) return NextResponse.json({ success: false, message: "Valid experience is required" }, { status: 400 });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.toLowerCase())) return NextResponse.json({ success: false, message: "Invalid email format" }, { status: 400 });

    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10 || cleanPhone.length > 15) return NextResponse.json({ success: false, message: "Phone must be 10-15 digits" }, { status: 400 });

    // === DUPLICATE CHECK ===
    const existing = await Doctor.findOne({
      $or: [
        { email: email.toLowerCase().trim() },
        { licenseNumber: licenseNumber.trim() },
        { phone: cleanPhone },
      ],
    });

    if (existing) {
      const field = existing.email === email.toLowerCase().trim()
        ? "Email"
        : existing.licenseNumber === licenseNumber.trim()
        ? "License number"
        : "Phone";
      return NextResponse.json({ success: false, message: `${field} already registered` }, { status: 400 });
    }

    // === PERMISSIONS HANDLING ===
    const defaultPermissions = [
      "view_patients",
      "view_patient_details",
      "view_patient_history",
      "view_appointments",
      "create_prescription",
      "view_reports",
      "update_patient_notes",
    ];

    let finalPermissions = defaultPermissions;
    if (providedPermissions) {
      if (!Array.isArray(providedPermissions) || providedPermissions.length === 0) {
        return NextResponse.json({ success: false, message: "Permissions must be a non-empty array" }, { status: 400 });
      }
      const invalid = providedPermissions.filter(p => !defaultPermissions.includes(p));
      if (invalid.length > 0) {
        return NextResponse.json({ success: false, message: `Invalid permissions: ${invalid.join(", ")}` }, { status: 400 });
      }
      finalPermissions = providedPermissions;
    }

    // === HASH PASSWORD ===
    const hashedPassword = await bcrypt.hash(password.trim(), 12);

    // === CREATE DOCTOR ===
    const newDoctor = await Doctor.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone: cleanPhone,
      specialization: specialization.trim(),
      licenseNumber: licenseNumber.trim(),
      department,
      experience: Number(experience),
      qualifications,
      consultationFee: Number(consultationFee),
      availableDays,
      availableTimeSlots,
      avatar: avatar?.trim() || undefined,
      permissions: finalPermissions,
      createdBy: verification.decoded.id,
      createdByModel: role === "superadmin" ? "SuperAdmin" : "Admin",
      status: "active",
      isAvailable: true,
    });

    // === POPULATE createdBy FOR RESPONSE ===
    const populatedDoctor = await Doctor.findById(newDoctor._id)
      .select("-password")
      .populate("createdBy", "name email role")
      .lean();

    // === CLEAN TIME SLOTS ===
    const cleanTimeSlots = (populatedDoctor.availableTimeSlots || []).map(slot => ({
      startTime: slot.startTime,
      endTime: slot.endTime,
    }));

    // === SUCCESS RESPONSE WITH FULL createdBy DETAILS ===
    return NextResponse.json(
      {
        success: true,
        message: "Doctor created successfully",
        createdBy: {
          id: populatedDoctor.createdBy?._id || verification.decoded.id,
          name: populatedDoctor.createdBy?.name || verification.decoded.name || verification.decoded.email,
          email: populatedDoctor.createdBy?.email || verification.decoded.email,
          role: populatedDoctor.createdBy?.role || verification.decoded.role,
          type: role === "superadmin" ? "SuperAdmin" : "Admin",
        },
        data: {
          doctor: {
            id: populatedDoctor._id,
            name: populatedDoctor.name,
            email: populatedDoctor.email,
            phone: populatedDoctor.phone,
            avatar: populatedDoctor.avatar,
            specialization: populatedDoctor.specialization,
            licenseNumber: populatedDoctor.licenseNumber,
            department: populatedDoctor.department,
            experience: populatedDoctor.experience,
            qualifications: populatedDoctor.qualifications || [],
            consultationFee: populatedDoctor.consultationFee || 0,
            availableDays: populatedDoctor.availableDays || [],
            availableTimeSlots: cleanTimeSlots,
            permissions: populatedDoctor.permissions || [],
            status: populatedDoctor.status,
            isAvailable: populatedDoctor.isAvailable,
            createdAt: populatedDoctor.createdAt,
            createdBy: populatedDoctor.createdBy
              ? {
                  id: populatedDoctor.createdBy._id,
                  name: populatedDoctor.createdBy.name,
                  email: populatedDoctor.createdBy.email,
                  role: populatedDoctor.createdBy.role,
                }
              : null,
          },
        },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Admin Doctor Create Error:", error);
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