// app/api/super-admin/doctors/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Doctor from "@/backend/models/Doctor";
import { verifyToken } from "@/backend/lib/jwt";

export async function GET(request) {
  try {
    await connectDB();

    // === AUTHENTICATION & AUTHORIZATION ===
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Login required" },
        { status: 401 }
      );
    }

    const verification = verifyToken(token);
    if (!verification.valid || verification.decoded.role !== "superadmin") {
      return NextResponse.json(
        { success: false, message: "Access Denied: Super Admin only" },
        { status: 403 }
      );
    }

    // === QUERY PARAMETERS ===
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page")) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit")) || 10));
    const search = searchParams.get("search")?.trim() || "";
    const department = searchParams.get("department")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

    const skip = (page - 1) * limit;

    // === BUILD QUERY ===
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { specialization: { $regex: search, $options: "i" } },
        { licenseNumber: { $regex: search, $options: "i" } },
      ];
    }

    if (department) {
      query.department = department;
    }

    if (status && ["active", "inactive", "on_leave"].includes(status)) {
      query.status = status;
    }

    // === SORTING (Secure) ===
    const validSortFields = [
      "name",
      "email",
      "department",
      "specialization",
      "experience",
      "consultationFee",
      "rating",
      "createdAt",
      "status",
    ];

    const finalSortField = validSortFields.includes(sortBy) ? sortBy : "createdAt";
    const sortOption = { [finalSortField]: sortOrder };

    // === FETCH DOCTORS WITH POPULATED createdBy ===
    const doctors = await Doctor.find(query)
      .select("-password")
      .populate("createdBy", "name email role")
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();

    const totalDoctors = await Doctor.countDocuments(query);
    const totalPages = Math.ceil(totalDoctors / limit);

    // === FORMAT RESPONSE WITH createdBy ===
    const cleanedDoctors = doctors.map((doc) => ({
      id: doc._id,
      name: doc.name,
      email: doc.email,
      phone: doc.phone,
      avatar: doc.avatar,
      specialization: doc.specialization,
      licenseNumber: doc.licenseNumber,
      department: doc.department,
      experience: doc.experience,
      consultationFee: doc.consultationFee || 0,
      qualifications: doc.qualifications || [],
      permissions: doc.permissions || [],
      availableDays: doc.availableDays || [],
      availableTimeSlots: (doc.availableTimeSlots || []).map((slot) => ({
        startTime: slot.startTime,
        endTime: slot.endTime,
      })),
      status: doc.status,
      isAvailable: doc.isAvailable,
      rating: doc.rating || 0,
      totalReviews: doc.totalReviews || 0,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      createdBy: doc.createdBy
        ? {
            id: doc.createdBy._id,
            name: doc.createdBy.name,
            email: doc.createdBy.email,
            role: doc.createdBy.role,
          }
        : null,
    }));

    // === SUCCESS RESPONSE ===
    return NextResponse.json(
      {
        success: true,
        message: "Doctors fetched successfully",
        pagination: {
          currentPage: page,
          totalPages,
          totalDoctors,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
        data: {
          doctors: cleanedDoctors,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("SuperAdmin Get All Doctors Error:", error);
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