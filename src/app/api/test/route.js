import {connectDB} from "@backend/lib/db";// <-- curly braces for named export
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({
      success: true,
      message: "MongoDB connection successful ✅",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: `MongoDB connection failed ❌: ${error.message}`,
    });
  }
}
