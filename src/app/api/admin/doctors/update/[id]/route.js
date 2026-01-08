
import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Doctor from "@/backend/models/Doctor";
import { verifyToken } from "@/backend/lib/jwt";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export async function PUT(request, { params }) {
  try {
    await connectDB();

    // === AUTHENTICATION ===
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: "Login required" }, { status: 401 });
    }

    const verification = verifyToken(token);
    if (!verification.valid) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    // === SMART ACCESS CONTROL ===
    const role = verification.decoded.role;
    const permissions = verification.decoded.permissions || [];

    if (role !== "superadmin" && role !== "admin") {
      if (!permissions.includes("update_doctors")) {
        return NextResponse.json(
          {
            success: false,
            message: "Access Denied: You don't have 'update_doctors' permission",
          },
          { status: 403 }
        );
      }
    }

    // === GET DOCTOR ID ===
    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid doctor ID" }, { status: 400 });
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
      qualifications,
      consultationFee,
      availableDays,
      availableTimeSlots,
      avatar,
      permissions: providedPermissions,
      status,
      isAvailable,
    } = body;

    // === FIND DOCTOR ===
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return NextResponse.json({ success: false, message: "Doctor not found" }, { status: 404 });
    }

    // === VALID CONSTANTS ===
    const validDepartments = ["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Dermatology", "General", "Emergency"];
    const validDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const validStatuses = ["active", "inactive", "on_leave"];

    const defaultPermissions = [
            "view_patients",
        "view_patient_details",
        "view_patient_history",
        "view_appointments",
        "delete_appointments",
        "create_appointments",
        "update_appointments",
        "create_prescription",
        "update_prescription",
        "delete_prescription",
        "view_prescription",
        "view_reports",
        "update_patient_notes",
        "reports_view",
        "reports_download",
        "reports_generate",
        "reports_delete",
        "reports_update",
        "reports_create",
    ];

    // === FIELD-WISE VALIDATION & UPDATE ===
    if (name !== undefined) {
      if (!name?.trim() || name.trim().length < 3) {
        return NextResponse.json({ success: false, message: "Name must be at least 3 characters" }, { status: 400 });
      }
      doctor.name = name.trim();
    }

    if (email !== undefined) {
      const trimmedEmail = email?.toLowerCase().trim();
      if (!trimmedEmail || !/^[\w.-]+@[\w.-]+\.\w+$/.test(trimmedEmail)) {
        return NextResponse.json({ success: false, message: "Invalid email format" }, { status: 400 });
      }
      const emailExists = await Doctor.findOne({ email: trimmedEmail, _id: { $ne: id } });
      if (emailExists) return NextResponse.json({ success: false, message: "Email already in use" }, { status: 400 });
      doctor.email = trimmedEmail;
    }
 
    if (phone !== undefined) {
      const cleanPhone = phone?.replace(/\D/g, "") || "";
      if (cleanPhone.length < 10 || cleanPhone.length > 15) {
        return NextResponse.json({ success: false, message: "Phone must be 10-15 digits" }, { status: 400 });
      }
      const phoneExists = await Doctor.findOne({ phone: cleanPhone, _id: { $ne: id } });
      if (phoneExists) return NextResponse.json({ success: false, message: "Phone already in use" }, { status: 400 });
      doctor.phone = cleanPhone;
    }

    if (password !== undefined && password?.trim() !== "") {
      if (password.trim().length < 6) {
        return NextResponse.json({ success: false, message: "Password must be at least 6 characters" }, { status: 400 });
      }
      doctor.password = await bcrypt.hash(password.trim(), 12);
    }

    if (specialization !== undefined) {
      if (!specialization?.trim()) {
        return NextResponse.json({ success: false, message: "Specialization is required" }, { status: 400 });
      }
      doctor.specialization = specialization.trim();
    }

    if (licenseNumber !== undefined) {
      const trimmedLicense = licenseNumber?.trim();
      if (!trimmedLicense) {
        return NextResponse.json({ success: false, message: "License number is required" }, { status: 400 });
      }
      const licenseExists = await Doctor.findOne({ licenseNumber: trimmedLicense, _id: { $ne: id } });
      if (licenseExists) return NextResponse.json({ success: false, message: "License number already in use" }, { status: 400 });
      doctor.licenseNumber = trimmedLicense;
    }

    if (department !== undefined) {
      if (!validDepartments.includes(department)) {
        return NextResponse.json({ success: false, message: "Invalid department" }, { status: 400 });
      }
      doctor.department = department;
    }

    if (experience !== undefined) {
      const exp = Number(experience);
      if (isNaN(exp) || exp < 0) {
        return NextResponse.json({ success: false, message: "Valid experience required" }, { status: 400 });
      }
      doctor.experience = exp;
    }

    if (qualifications !== undefined) {
      doctor.qualifications = Array.isArray(qualifications) ? qualifications : [];
    }

    if (consultationFee !== undefined) {
      const fee = Number(consultationFee);
      if (isNaN(fee) || fee < 0) {
        return NextResponse.json({ success: false, message: "Valid consultation fee required" }, { status: 400 });
      }
      doctor.consultationFee = fee;
    }

    if (availableDays !== undefined) {
      if (!Array.isArray(availableDays) || availableDays.some(d => !validDays.includes(d))) {
        return NextResponse.json({ success: false, message: "Invalid available days" }, { status: 400 });
      }
      doctor.availableDays = availableDays;
    }

    if (availableTimeSlots !== undefined) {
      if (!Array.isArray(availableTimeSlots)) {
        return NextResponse.json({ success: false, message: "availableTimeSlots must be an array" }, { status: 400 });
      }
      for (const slot of availableTimeSlots) {
        if (!slot.startTime || !slot.endTime) {
          return NextResponse.json({ success: false, message: "Each slot must have startTime and endTime" }, { status: 400 });
        }
        const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(slot.startTime) || !timeRegex.test(slot.endTime)) {
          return NextResponse.json({ success: false, message: "Invalid time format (use HH:MM)" }, { status: 400 });
        }
      }
      doctor.availableTimeSlots = availableTimeSlots;
    }

    if (avatar !== undefined) {
      doctor.avatar = avatar?.trim() || doctor.avatar;
    }

    if (providedPermissions !== undefined) {
      if (!Array.isArray(providedPermissions) || providedPermissions.length === 0) {
        return NextResponse.json({ success: false, message: "Permissions must be a non-empty array" }, { status: 400 });
      }
      const invalid = providedPermissions.filter(p => !defaultPermissions.includes(p));
      if (invalid.length > 0) {
        return NextResponse.json({ success: false, message: `Invalid permissions: ${invalid.join(", ")}` }, { status: 400 });
      }
      doctor.permissions = providedPermissions;
    }

    if (status !== undefined) {
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ success: false, message: "Invalid status" }, { status: 400 });
      }
      doctor.status = status;
    }

    if (isAvailable !== undefined) {
      doctor.isAvailable = Boolean(isAvailable);
    }

    // === SAVE UPDATED DOCTOR ===
    await doctor.save();

    // === RE-FETCH WITH POPULATED createdBy FOR RESPONSE ===
    const updatedDoctor = await Doctor.findById(id)
      .select("-password")
      .populate("createdBy", "name email role")
      .lean();

    // === CLEAN TIME SLOTS ===
    const cleanTimeSlots = (updatedDoctor.availableTimeSlots || []).map(slot => ({
      startTime: slot.startTime,
      endTime: slot.endTime,
    }));

    // === SUCCESS RESPONSE WITH createdBy DETAILS ===
    return NextResponse.json(
      {
        success: true,
        message: "Doctor updated successfully",
        updatedBy: {
          id: verification.decoded.id,
          name: verification.decoded.name || verification.decoded.email,
          role: verification.decoded.role,
          type: role === "superadmin" ? "SuperAdmin" : "Admin",
        },
        data: {
          doctor: {
            id: updatedDoctor._id,
            name: updatedDoctor.name,
            email: updatedDoctor.email,
            phone: updatedDoctor.phone,
            avatar: updatedDoctor.avatar,
            specialization: updatedDoctor.specialization,
            licenseNumber: updatedDoctor.licenseNumber,
            department: updatedDoctor.department,
            experience: updatedDoctor.experience,
            qualifications: updatedDoctor.qualifications || [],
            consultationFee: updatedDoctor.consultationFee || 0,
            availableDays: updatedDoctor.availableDays || [],
            availableTimeSlots: cleanTimeSlots,
            permissions: updatedDoctor.permissions || [],
            status: updatedDoctor.status,
            isAvailable: updatedDoctor.isAvailable,
            rating: updatedDoctor.rating || 0,
            totalReviews: updatedDoctor.totalReviews || 0,
            createdAt: updatedDoctor.createdAt,
            updatedAt: updatedDoctor.updatedAt,
            createdBy: updatedDoctor.createdBy
              ? {
                  id: updatedDoctor.createdBy._id,
                  name: updatedDoctor.createdBy.name,
                  email: updatedDoctor.createdBy.email,
                  role: updatedDoctor.createdBy.role,
                }
              : null,
          },
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Admin Update Doctor Error:", error);
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