// app/api/profile/superadmin/me/route.js
import { NextResponse } from "next/server";
import {connectDB} from "@/backend/lib/db";
import SuperAdmin from "@/backend/models/SuperAdmin";
import jwt from "jsonwebtoken"; // direct jwt use kar rahe hain

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
      decoded = jwt.verify(token, process.env.JWT_SECRET); // ← YEH SECRET SAME HONA CHAHIYE JO generateToken mein use hota hai
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token. Please login again." },
        { status: 401 }
      );
    }

    // 3. Role check - EXACTLY "superadmin" (lowercase) match karna chahiye
    if (!decoded.role || decoded.role !== "superadmin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized: SuperAdmin access only" },
        { status: 403 }
      );
    }

    // 4. SuperAdmin fetch karo
    const superAdmin = await SuperAdmin.findById(decoded.id || decoded._id)
      .select("-password") // password exclude
      .lean();

    if (!superAdmin) {
      return NextResponse.json(
        { success: false, message: "SuperAdmin not found" },
        { status: 404 }
      );
    }

    // 5. Clean profile response
    return NextResponse.json(
      {
        success: true,
        message: "SuperAdmin profile fetched successfully",
        data: {
          profile: {
            id: superAdmin._id,
            name: superAdmin.name || "SuperAdmin",
            email: superAdmin.email,
            phone: superAdmin.phone || null,
            role: "superadmin",
            avatar: superAdmin.avatar || null,
            status: superAdmin.status || "active",
            lastLogin: superAdmin.lastLogin || null,
            createdAt: superAdmin.createdAt,
            updatedAt: superAdmin.updatedAt,
          },
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("SuperAdmin profile fetch error:", error.message);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}