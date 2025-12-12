// src/app/api/auth/logout/route.js

import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Logout successful! Not You are logged out."
    });
    // Clear the token cookie
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      expires: new Date(0),
      path: "/"
    });

    return response;

  } catch (error) {
    console.error("Logout Error:", error);
    return NextResponse.json(
      { success: false, message: "Logout failed" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  return POST(request); 
}