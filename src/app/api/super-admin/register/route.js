import { NextResponse } from "next/server";
import SuperAdmin from "@/backend/models/SuperAdmin";
import { generateToken } from "@/backend/lib/jwt";
import {connectDB} from "@/backend/lib/db";    


export async function POST(request) {
  try {
    await connectDB();

    const { name, email, password, phone } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: "All fields required" }, { status: 400 });
    }
    const superAdminCount = await SuperAdmin.countDocuments();
    if (superAdminCount >= 1) {
      return NextResponse.json(
        { success: false, message: "SuperAdmin already exists! Only one SuperAdmin is allowed in the system." },
        { status: 403 }
      );
    }
    console.log("Registration attempt for email:", email);

    const existingAdmin = await SuperAdmin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return NextResponse.json({ success: false, message: "Email already in use" }, { status: 409 });
    }

    const superAdmin = await SuperAdmin.create({
      name,
      email: email.toLowerCase(),
      password,
      phone: phone || undefined,
    });

    const token = generateToken({
      id: superAdmin._id,
      role: "superadmin",
      email: superAdmin.email,
      name: superAdmin.name
    });

    // Set cookies 
    const response = NextResponse.json({ success: true, message: "Registration successful", user: superAdmin, token }, { status: 201 });
    response.cookies.set("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60, // 7 days
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return response;

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}