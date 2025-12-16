// // app/api/admin/doctors/get/route.js

// import { NextResponse } from "next/server";
// import { connectDB } from "@/backend/lib/db";
// import Doctor from "@/backend/models/Doctor";
// import { verifyToken } from "@/backend/lib/jwt";

// export async function GET(request) {
//   try {
//     await connectDB();

//     // Token from cookie
//     const token = request.cookies.get("token")?.value;

//     if (!token) {
//       return NextResponse.json(
//         { success: false, message: "Login required" },
//         { status: 401 }
//       );
//     }

//     const verification = verifyToken(token);

//     if (!verification.valid) {
//       return NextResponse.json(
//         { success: false, message: "Invalid token" },
//         { status: 401 }
//       );
//     }
//     const userRole = verification.decoded.role;
//     const userPermissions = verification.decoded.permissions || [];
//     // SuperAdmin aur "admin" role ko full access
//     // Baaki roles ke liye permission check (view_doctors)
//     if (userRole !== "superadmin" && userRole !== "admin") {
//       if (!userPermissions.includes("view_doctors")) {
//         return NextResponse.json(
//           { success: false, message: "Access Denied: You don't have permission to view doctors" },
//           { status: 403 }
//         );
//       }
//     }
//     // Allowed!

//     const { searchParams } = new URL(request.url);

//     // Query parameters
//     const page = parseInt(searchParams.get("page")) || 1;
//     const limit = parseInt(searchParams.get("limit")) || 10;
//     const search = searchParams.get("search")?.trim() || "";
//     const department = searchParams.get("department") || "";
//     const specialization = searchParams.get("specialization") || "";
//     const status = searchParams.get("status") || ""; // active, inactive, on_leave

//     const skip = (page - 1) * limit;

//     // Build query
//     let query = {};

//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { email: { $regex: search, $options: "i" } },
//         { licenseNumber: { $regex: search, $options: "i" } },
//         { phone: { $regex: search, $options: "i" } },
//       ];
//     }

//     if (department) {
//       query.department = department;
//     }

//     if (specialization) {
//       query.specialization = { $regex: specialization, $options: "i" };
//     }

//     if (status) {
//       query.status = status;
//     }

//     // Fetch doctors with pagination
//     const doctors = await Doctor.find(query)
//       .select("-password") // password never return
//       .populate("createdBy", "name email role") // optional: creator ki info
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit);

//     // Total count for pagination
//     const total = await Doctor.countDocuments(query);

//     // Format response
//     const formattedDoctors = doctors.map((doc) => ({
//       id: doc._id,
//       name: doc.name,
//       email: doc.email,
//       phone: doc.phone,
//       specialization: doc.specialization,
//       licenseNumber: doc.licenseNumber,
//       department: doc.department,
//       experience: doc.experience,
//       consultationFee: doc.consultationFee,
//       status: doc.status,
//       isAvailable: doc.isAvailable,
//       rating: doc.rating,
//       totalReviews: doc.totalReviews,
//       createdAt: doc.createdAt,
//       createdBy: doc.createdBy
//         ? {
//             name: doc.createdBy.name,
//             email: doc.createdBy.email,
//             role: doc.createdBy.role,
//           }
//         : null,
//     }));

//     return NextResponse.json({
//       success: true,
//       message: "Doctors fetched successfully",
//       data: {
//         doctors: formattedDoctors,
//         pagination: {
//           currentPage: page,
//           totalPages: Math.ceil(total / limit),
//           totalDoctors: total,
//           hasNext: page < Math.ceil(total / limit),
//           hasPrev: page > 1,
//         },
//       },
//     });

//   } catch (error) {
//     console.error("Get Doctors Error:", error.message);
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Server error",
//         error: process.env.NODE_ENV === "development" ? error.message : undefined,
//       },
//       { status: 500 }
//     );
//   }
// }




// app/api/admin/doctors/get/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Doctor from "@/backend/models/Doctor";
import { verifyToken } from "@/backend/lib/jwt";

export async function GET(request) {
  try {
    await connectDB();

    // Token from cookie
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

    const userRole = verification.decoded.role;
    const userPermissions = verification.decoded.permissions || [];

    // SuperAdmin aur "admin" ko full access
    if (userRole !== "superadmin" && userRole !== "admin") {
      if (!userPermissions.includes("view_doctors")) {
        return NextResponse.json(
          { success: false, message: "Access Denied: You don't have permission to view doctors" },
          { status: 403 }
        );
      }
    }

    const { searchParams } = new URL(request.url);

    // Query parameters
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const search = searchParams.get("search")?.trim() || "";
    const department = searchParams.get("department") || "";
    const specialization = searchParams.get("specialization") || "";
    const status = searchParams.get("status") || "";

    const skip = (page - 1) * limit;

    // Build query
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { licenseNumber: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    if (department) {
      query.department = { $regex: department, $options: "i" }; // case-insensitive
    }

    if (specialization) {
      query.specialization = { $regex: specialization, $options: "i" };
    }

    if (status) {
      query.status = status;
    }

    // Fetch doctors with pagination
    const doctors = await Doctor.find(query)
      .select("-password") // Never return password
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Total count for pagination
    const total = await Doctor.countDocuments(query);

    // Format doctors with ALL needed fields
    const formattedDoctors = doctors.map((doc) => ({
      id: doc._id,
      name: doc.name,
      email: doc.email,
      phone: doc.phone,
      specialization: doc.specialization,
      licenseNumber: doc.licenseNumber,
      department: doc.department,
      experience: doc.experience,
      qualifications: doc.qualifications || [],
      consultationFee: doc.consultationFee || 0,
      availableDays: doc.availableDays || [],
      availableTimeSlots: doc.availableTimeSlots || [],
      status: doc.status,
      isAvailable: doc.isAvailable,
      rating: doc.rating || 0,
      totalReviews: doc.totalReviews || 0,
      createdAt: doc.createdAt,
      createdBy: doc.createdBy
        ? {
            name: doc.createdBy.name,
            email: doc.createdBy.email,
            role: doc.createdBy.role,
          }
        : null,
    }));

    return NextResponse.json({
      success: true,
      message: "Doctors fetched successfully",
      data: {
        doctors: formattedDoctors,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalDoctors: total,
          limit,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get Doctors Error:", error.message);
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