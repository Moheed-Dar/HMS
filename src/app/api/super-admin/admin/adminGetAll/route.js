// app/api/super-admin/admin/adminGetAll/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Admin from "@/backend/models/Admin";
import { verifyToken } from "@/backend/lib/jwt";

export async function GET(request) {
  try {
    await connectDB();

    // AB TOKEN COOKIE SE PADHO — HEADER SE BILKUL NAHI!
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Login required" },
        { status: 401 }
      );
    }

    const verification = verifyToken(token);

    // Tere token mein "superadmin" hai (hyphen nahi)
    if (!verification.valid || verification.decoded.role !== "superadmin") {
      return NextResponse.json(
        { success: false, message: "Access Denied: SuperAdmin only" },
        { status: 403 }
      );
    }

    // Only active + inactive admins (deleted nahi dikhega)
    const admins = await Admin.find({
      $and: [
        { status: { $ne: "deleted" } },
        { $or: [
          { isDeleted: false },
          { isDeleted: { $exists: false } }
        ]}
      ]
    })
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      count: admins.length,
      fetchedBy: verification.decoded.name || verification.decoded.email || "SuperAdmin",
      data: admins
    });

  } catch (error) {
    console.error("Get All Admins Error:", error.message);
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: process.env.NODE_ENV === "development" ? error.message : undefined
      },
      { status: 500 }
    );
  }
}