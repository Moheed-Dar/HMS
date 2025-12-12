
import { NextResponse } from "next/server";
import SuperAdmin from "@/backend/models/SuperAdmin";
import { generateToken } from "@/backend/lib/jwt";
import { connectDB } from "@/backend/lib/db";
import bcrypt from "bcryptjs";   // ← YE ADD KARNA ZAROORI (agar comparePassword nahi hai)

export async function POST(request) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password required" },
        { status: 400 }
      );
    }

    // Find SuperAdmin
    const user = await SuperAdmin.findOne({ 
      email: email.toLowerCase().trim() 
    }).select("+password");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Agar status field hai to check karo
    if (user.status && user.status !== "active") {
      return NextResponse.json(
        { success: false, message: "Account deactivated" },
        { status: 403 }
      );
    }

    // Password verify (agar model mein comparePassword nahi hai to manually karo)
    const isMatch = user.comparePassword 
      ? await user.comparePassword(password)
      : await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    
    }

    // Last login update
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Token generate (tere token mein "superadmin" hai)
    const token = generateToken({
      id: user._id,
      role: "superadmin",           // ← YE CONFIRM KARO
      email: user.email,
      name: user.name || "SuperAdmin"
    });

    // RESPONSE + COOKIE SET (Yeh sabse important hai)
    const response = NextResponse.json({
      success: true,
      message: "SuperAdmin logged in successfully",
      user: {
        id: user._id,
        name: user.name || "SuperAdmin",
        email: user.email,
        role: "superadmin",
        lastLogin: user.lastLogin
      },
      token // frontend ke liye bhi bhej do
    });

    // TOKEN COOKIE MEIN SAVE HO RAHA HAI AB
    response.cookies.set("token", token, {
      httpOnly: true,                    // JavaScript se access nahi hoga
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,          // 7 days
      path: "/"                          // har jagah available
    });

    return response;

  } catch (error) {
    console.error("SuperAdmin Login Error:", error.message);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}