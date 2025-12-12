// backend/middleware/auth.js
import { NextResponse } from "next/server";
import superAdmin from "../models/SuperAdmin";
import { verifyToken } from "../lib/jwt";

// Sirf SuperAdmin ke liye middleware
export const protectSuperAdmin = async (request) => {
  let token;

  // Header se token nikalo (Bearer token)
  if (
    request.headers.get("authorization")?.startsWith("Bearer ")
  ) {
    token = request.headers.get("authorization").split(" ")[1];
  }

  // Agar token hi nahi mila
  if (!token) {
    return NextResponse.json(
      { error: "Access denied. No token provided." },
      { status: 401 }
    );
  }

  // Token verify karo
  const decoded = verifyToken(token);

  if (!decoded || !decoded.id) {
    return NextResponse.json(
      { error: "Invalid or expired token. Please login again." },
      { status: 401 }
    );
  }

  try {
    // Database se SuperAdmin fetch karo
    const admin = await superAdmin.findById(decoded.id).select("-password");

    if (!admin) {
      return NextResponse.json(
        { error: "SuperAdmin not found." },
        { status: 404 }
      );
    }

    if (admin.status !== "active") {
      return NextResponse.json(
        { error: "Your account is inactive. Contact support." },
        { status: 403 }
      );
    }

    // Request mein user attach kar do (baad mein use karne ke liye)
    request.user = admin;
    return null; // Matlab success, aage chalo

  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return NextResponse.json(
      { error: "Server error during authentication" },
      { status: 500 }
    );
  }
};