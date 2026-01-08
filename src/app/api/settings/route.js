// app/api/settings/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import HospitalSettings from "@/backend/models/HospitalSettings";
import jwt from "jsonwebtoken";

// Default settings (pehli baar create hone ke liye)
const DEFAULT_SETTINGS = {
  hospitalName: "MediCare Hospital",
  tagline: "Caring for Life",
  address: "123 Hospital Street, City, Country",
  phone: "+92 300 1234567",
  email: "info@myhospital.com",
  website: "www.myhospital.com",
  logo: "https://example.com/default-hospital-logo.png",
  workingHours: "09:00 AM - 09:00 PM",
  emergencyContact: "+92 300 0000000",
  departments: [
    "General Medicine",
    "Emergency",
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Dermatology",
    "Gynecology & Obstetrics",
    "ENT (Ear, Nose, Throat)",
    "Ophthalmology (Eye)",
    "Dentistry",
    "Psychiatry",
    "Gastroenterology",
    "Pulmonology (Chest)",
    "Nephrology (Kidney)",
    "Urology",
    "Endocrinology",
    "Rheumatology",
    "Oncology (Cancer)",
    "Hematology",
    "General Surgery",
    "Neurosurgery",
    "Cardiac Surgery",
    "Plastic Surgery",
    "Orthopedic Surgery",
    "Pediatric Surgery",
    "Radiology",
    "Pathology & Laboratory",
    "Anesthesiology",
    "Physiotherapy & Rehabilitation",
    "Nutrition & Dietetics",
    "Pharmacy",
    "Blood Bank",
    "ICU (Intensive Care Unit)",
    "NICU (Neonatal ICU)",
    "CCU (Critical Care Unit)"
  ],
  currency: "PKR",
  currencySymbol: "Rs."
};


export async function GET(request) {
  try {
    await connectDB();

    let settings = await HospitalSettings.findOne();

    // Agar record nahi mila to default create kar do
    if (!settings) {
      settings = await HospitalSettings.create(DEFAULT_SETTINGS);
    }

    return NextResponse.json({
      success: true,
      data: { settings },
    });
  } catch (error) {
    console.error("HospitalSettings GET error:", error.message);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// PUT - Sirf SuperAdmin update kar sake
export async function PUT(request) {
  try {
    await connectDB();

    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Login required" },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    if (decoded.role !== "superadmin") {
      return NextResponse.json(
        { success: false, message: "Only SuperAdmin can update hospital settings" },
        { status: 403 }
      );
    }

    const body = await request.json();

    let settings = await HospitalSettings.findOne();

    // Agar pehli baar hai to create karo
    if (!settings) {
      settings = new HospitalSettings();
    }

    // Allowed fields update karo (security ke liye)
    const allowedFields = [
      "hospitalName", "tagline", "address", "phone", "email", "website",
      "logo", "workingHours", "emergencyContact", "departments",
      "currency", "currencySymbol"
    ];

    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        settings[field] = body[field];
      }
    });

    await settings.save();

    return NextResponse.json({
      success: true,
      message: "Hospital settings updated successfully",
      data: { settings },
    });
  } catch (error) {
    console.error("HospitalSettings PUT error:", error.message);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}