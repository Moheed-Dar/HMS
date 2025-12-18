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
      return NextResponse.json({ success: false, message: "Login required" }, { status: 401 });
    }

    const verification = verifyToken(token);
    if (!verification.valid || verification.decoded.role !== "superadmin") {
      return NextResponse.json({ success: false, message: "Access Denied: Super Admin only" }, { status: 403 });
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

    // === VALIDATIONS ===
    if (!name?.trim()) return NextResponse.json({ success: false, message: "Name is required" }, { status: 400 });
    if (!email?.trim()) return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
    if (!password?.trim()) return NextResponse.json({ success: false, message: "Password is required" }, { status: 400 });
    if (!phone?.trim()) return NextResponse.json({ success: false, message: "Phone is required" }, { status: 400 });
    if (!specialization?.trim()) return NextResponse.json({ success: false, message: "Specialization is required" }, { status: 400 });
    if (!licenseNumber?.trim()) return NextResponse.json({ success: false, message: "License number is required" }, { status: 400 });
    if (!department?.trim()) return NextResponse.json({ success: false, message: "Department is required" }, { status: 400 });
    if (experience === undefined || experience < 0) return NextResponse.json({ success: false, message: "Valid experience is required" }, { status: 400 });

    if (name.trim().length < 3) return NextResponse.json({ success: false, message: "Name must be at least 3 characters" }, { status: 400 });
    if (password.trim().length < 6) return NextResponse.json({ success: false, message: "Password must be at least 6 characters" }, { status: 400 });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.toLowerCase())) return NextResponse.json({ success: false, message: "Invalid email format" }, { status: 400 });

    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10 || cleanPhone.length > 15) return NextResponse.json({ success: false, message: "Phone number must be 10-15 digits" }, { status: 400 });

    const validDepartments = ["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Dermatology", "General", "Emergency"];
    if (!validDepartments.includes(department)) return NextResponse.json({ success: false, message: "Invalid department" }, { status: 400 });

    const validDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    if (!Array.isArray(availableDays) || availableDays.some(d => !validDays.includes(d))) {
      return NextResponse.json({ success: false, message: "Invalid available days" }, { status: 400 });
    }

    if (!Array.isArray(availableTimeSlots)) {
      return NextResponse.json({ success: false, message: "availableTimeSlots must be an array" }, { status: 400 });
    }
    for (const slot of availableTimeSlots) {
      if (!slot.startTime || !slot.endTime) {
        return NextResponse.json({ success: false, message: "Each time slot must have startTime and endTime" }, { status: 400 });
      }
      const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(slot.startTime) || !timeRegex.test(slot.endTime)) {
        return NextResponse.json({ success: false, message: "Time format must be HH:MM (24-hour)" }, { status: 400 });
      }
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
        return NextResponse.json({ success: false, message: "If permissions are provided, it must be a non-empty array" }, { status: 400 });
      }
      const invalidPerms = providedPermissions.filter(p => !defaultPermissions.includes(p));
      if (invalidPerms.length > 0) {
        return NextResponse.json({ success: false, message: `Invalid permissions: ${invalidPerms.join(", ")}` }, { status: 400 });
      }
      finalPermissions = providedPermissions;
    }

    // === DUPLICATE CHECK ===
    const existingDoctor = await Doctor.findOne({
      $or: [
        { email: email.toLowerCase().trim() },
        { licenseNumber: licenseNumber.trim() },
        { phone: cleanPhone }
      ]
    });

    if (existingDoctor) {
      const field = existingDoctor.email === email.toLowerCase().trim()
        ? "Email"
        : existingDoctor.licenseNumber === licenseNumber.trim()
        ? "License Number"
        : "Phone";
      return NextResponse.json({ success: false, message: `${field} already registered` }, { status: 409 });
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
      createdByModel: "SuperAdmin",
      status: "active",
      isAvailable: true,
    });

    // === POPULATE createdBy FOR FULL DETAILS IN RESPONSE ===
    const populatedDoctor = await Doctor.findById(newDoctor._id)
      .select("-password")
      .populate("createdBy", "name email role")
      .lean();

    // === CLEAN TIME SLOTS ===
    const cleanTimeSlots = (populatedDoctor.availableTimeSlots || []).map(slot => ({
      startTime: slot.startTime,
      endTime: slot.endTime,
    }));

    // === SUCCESS RESPONSE WITH createdBy DETAILS ===
    return NextResponse.json({
      success: true,
      message: "Doctor registered successfully!",
      createdBy: {
        id: populatedDoctor.createdBy?._id || verification.decoded.id,
        name: populatedDoctor.createdBy?.name || verification.decoded.name || verification.decoded.email,
        email: populatedDoctor.createdBy?.email || verification.decoded.email,
        role: populatedDoctor.createdBy?.role || "superadmin",
        type: "SuperAdmin",
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
        }
      }
    }, { status: 201 });

  } catch (error) {
    console.error("SuperAdmin Doctor Register Error:", error);
    return NextResponse.json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : "Something went wrong"
    }, { status: 500 });
  }
}