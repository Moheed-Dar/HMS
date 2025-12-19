// app/api/profile/admin/me/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Admin from "@/backend/models/Admin";
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

    // 2. Token verify karo
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token. Please login again." },
        { status: 401 }
      );
    }

    // 3. Role check - sirf admin ya uske sub-roles allow
    const allowedRoles = ["admin", "doctor_manager", "billing_admin", "staff_manager", "IT_admin"];
    if (!allowedRoles.includes(decoded.role)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Admin access only" },
        { status: 403 }
      );
    }

    // 4. Admin ko ID se fetch karo
    const admin = await Admin.findById(decoded.id || decoded._id)
      .select("-password") // password exclude
      .populate("createdBy", "name email") // agar createdBy reference hai
      .lean();

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin not found" },
        { status: 404 }
      );
    }

    // 5. Full profile response
    return NextResponse.json(
      {
        success: true,
        message: "Admin profile fetched successfully",
        data: {
          profile: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            phone: admin.phone || null,
            role: admin.role, // yeh billing_admin wagera bhi ho sakta hai
            department: admin.department,
            employeeId: admin.employeeId,
            permissions: admin.permissions || [],
            status: admin.status,
            isApproved: admin.isApproved,
            expiresAt: admin.expiresAt || null,
            createdBy: admin.createdBy
              ? {
                  id: admin.createdBy._id,
                  name: admin.createdBy.name,
                  email: admin.createdBy.email,
                }
              : null,
            createdAt: admin.createdAt,
            updatedAt: admin.updatedAt,
          },
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Admin profile fetch error:", error.message);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}