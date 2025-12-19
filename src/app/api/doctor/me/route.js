// app/api/profile/doctor/me/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Doctor from "@/backend/models/Doctor";
import jwt from "jsonwebtoken";

export async function GET(request) {
  try {
    await connectDB();

    // 1. Token cookie se le rahe hain
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "No token provided. Please login again." },
        { status: 401 }
      );
    }

    // 2. Token verify
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token. Please login again." },
        { status: 401 }
      );
    }

    // 3. Role check - sirf doctor allow
    if (decoded.role !== "doctor") {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Doctor access only" },
        { status: 403 }
      );
    }

    // 4. Doctor ko ID se fetch karo
    const doctor = await Doctor.findById(decoded.id || decoded._id)
      .select("-password") // password exclude
      .populate("createdBy", "name email role") // SuperAdmin details
      .lean();

    if (!doctor) {
      return NextResponse.json(
        { success: false, message: "Doctor not found" },
        { status: 404 }
      );
    }

    // 5. Clean time slots (agar objectId ya extra fields hain)
    const cleanTimeSlots = (doctor.availableTimeSlots || []).map(slot => ({
      startTime: slot.startTime,
      endTime: slot.endTime,
    }));

    // 6. Full profile response
    return NextResponse.json(
      {
        success: true,
        message: "Doctor profile fetched successfully",
        data: {
          profile: {
            id: doctor._id,
            name: doctor.name,
            email: doctor.email,
            phone: doctor.phone,
            avatar: doctor.avatar || null,
            specialization: doctor.specialization,
            licenseNumber: doctor.licenseNumber,
            department: doctor.department,
            experience: doctor.experience,
            qualifications: doctor.qualifications || [],
            consultationFee: doctor.consultationFee || 0,
            availableDays: doctor.availableDays || [],
            availableTimeSlots: cleanTimeSlots,
            permissions: doctor.permissions || [],
            status: doctor.status,
            isAvailable: doctor.isAvailable,
            createdBy: doctor.createdBy
              ? {
                  id: doctor.createdBy._id,
                  name: doctor.createdBy.name,
                  email: doctor.createdBy.email,
                  role: doctor.createdBy.role || "superadmin",
                }
              : null,
            createdAt: doctor.createdAt,
            updatedAt: doctor.updatedAt,
          },
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Doctor profile fetch error:", error.message);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}