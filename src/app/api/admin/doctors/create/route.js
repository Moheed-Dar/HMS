// // app/api/admin/doctors/create/route.js

// import { NextResponse } from "next/server";
// import { connectDB } from "@/backend/lib/db";
// import Doctor from "@/backend/models/Doctor";
// import { verifyToken } from "@/backend/lib/jwt";
// import bcrypt from "bcryptjs";

// export async function POST(request) {
//   try {
//     await connectDB();

//     // Token cookie se lo
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

//     // ============ SMART ACCESS CONTROL ============
//     const userRole = verification.decoded.role;
//     const userPermissions = verification.decoded.permissions || [];

//     // SuperAdmin aur simple "admin" ko full access do (bina permission check ke)
//     if (userRole !== "superadmin" && userRole !== "admin") {
//       // Baaki roles (doctor_manager, billing_admin, etc.) ke liye permission check
//       if (!userPermissions.includes("create_doctors")) {
//         return NextResponse.json(
//           {
//             success: false,
//             message:
//               "Access Denied: You don't have 'create_doctors' permission",
//           },
//           { status: 403 }
//         );
//       }
//     }
//     // SuperAdmin aur "admin" role automatically allowed hain
//     // ==============================================

//     const body = await request.json();
//     const {
//       name,
//       email,
//       password,
//       phone,
//       specialization,
//       licenseNumber,
//       department,
//       experience,
//       qualifications = [],
//       consultationFee = 0,
//       availableDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
//       availableTimeSlots = [],
//     } = body;

//     // Validation
//     if (!name?.trim())
//       return NextResponse.json(
//         { success: false, message: "Name is required" },
//         { status: 400 }
//       );
//     if (!email?.trim())
//       return NextResponse.json(
//         { success: false, message: "Email is required" },
//         { status: 400 }
//       );
//     if (!password || password.length < 6)
//       return NextResponse.json(
//         { success: false, message: "Password must be at least 6 characters" },
//         { status: 400 }
//       );
//     if (!phone?.trim())
//       return NextResponse.json(
//         { success: false, message: "Phone is required" },
//         { status: 400 }
//       );
//     if (!specialization?.trim())
//       return NextResponse.json(
//         { success: false, message: "Specialization is required" },
//         { status: 400 }
//       );
//     if (!licenseNumber?.trim())
//       return NextResponse.json(
//         { success: false, message: "License number is required" },
//         { status: 400 }
//       );
//     if (!department?.trim())
//       return NextResponse.json(
//         { success: false, message: "Department is required" },
//         { status: 400 }
//       );
//     if (experience === undefined || experience < 0)
//       return NextResponse.json(
//         { success: false, message: "Valid experience is required" },
//         { status: 400 }
//       );

//     const emailRegex = /^\S+@\S+\.\S+$/;
//     if (!emailRegex.test(email.toLowerCase())) {
//       return NextResponse.json(
//         { success: false, message: "Invalid email format" },
//         { status: 400 }
//       );
//     }

//     // Duplicate check: email ya license number
//     const existing = await Doctor.findOne({
//       $or: [
//         { email: email.toLowerCase().trim() },
//         { licenseNumber: licenseNumber.trim() },
//       ],
//     });

//     if (existing) {
//       const field =
//         existing.email === email.toLowerCase().trim()
//           ? "Email"
//           : "License number";
//       return NextResponse.json(
//         { success: false, message: `${field} already registered` },
//         { status: 400 }
//       );
//     }

//     // Password hash karo
//     const hashedPassword = await bcrypt.hash(password.trim(), 12);

//     // Create doctor
//     const newDoctor = await Doctor.create({
//       name: name.trim(),
//       email: email.toLowerCase().trim(),
//       password: hashedPassword,
//       phone: phone.trim(),
//       specialization: specialization.trim(),
//       licenseNumber: licenseNumber.trim(),
//       department,
//       experience,
//       qualifications,
//       consultationFee,
//       availableDays,
//       availableTimeSlots,
//       createdBy: verification.decoded.id,
//       createdByModel:
//         verification.decoded.model ||
//         (verification.decoded.role === "superadmin" ? "SuperAdmin" : "Admin"),
//       status: "active",
//       isAvailable: true,
//     });

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Doctor registered successfully!",
//         createdBy: {
//           name: verification.decoded.name || verification.decoded.email,
//           role: verification.decoded.role,
//           type:
//             verification.decoded.role === "superadmin" ? "SuperAdmin" : "Admin",
//         },
//         data: {
//           doctor: {
//             id: newDoctor._id,
//             name: newDoctor.name,
//             email: newDoctor.email,
//             phone: newDoctor.phone,
//             specialization: newDoctor.specialization,
//             licenseNumber: newDoctor.licenseNumber,
//             department: newDoctor.department,
//             experience: newDoctor.experience,
//             status: newDoctor.status,
//             createdAt: newDoctor.createdAt,
//           },
//         },
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Doctor Register Error:", error.message);
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Server error",
//         error:
//           process.env.NODE_ENV === "development" ? error.message : undefined,
//       },
//       { status: 500 }
//     );
//   }
// }







// app/api/admin/doctors/create/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Doctor from "@/backend/models/Doctor";
import { verifyToken } from "@/backend/lib/jwt";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    await connectDB();

    // Token cookie se lo
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

    // ============ SMART ACCESS CONTROL ============
    const userRole = verification.decoded.role;
    const userPermissions = verification.decoded.permissions || [];

    if (userRole !== "superadmin" && userRole !== "admin") {
      if (!userPermissions.includes("create_doctors")) {
        return NextResponse.json(
          {
            success: false,
            message: "Access Denied: You don't have 'create_doctors' permission",
          },
          { status: 403 }
        );
      }
    }
    // ==============================================

    const body = await request.json();
    const {
      name,
      email,
      password,
      phone,
      specialization,
      licenseNumber,
      department,
      experience,
      qualifications = [],
      consultationFee = 0,
      availableDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      availableTimeSlots = [],
    } = body;

    // Validation
    if (!name?.trim())
      return NextResponse.json({ success: false, message: "Name is required" }, { status: 400 });
    if (!email?.trim())
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
    if (!password || password.length < 6)
      return NextResponse.json({ success: false, message: "Password must be at least 6 characters" }, { status: 400 });
    if (!phone?.trim())
      return NextResponse.json({ success: false, message: "Phone is required" }, { status: 400 });
    if (!specialization?.trim())
      return NextResponse.json({ success: false, message: "Specialization is required" }, { status: 400 });
    if (!licenseNumber?.trim())
      return NextResponse.json({ success: false, message: "License number is required" }, { status: 400 });
    if (!department?.trim())
      return NextResponse.json({ success: false, message: "Department is required" }, { status: 400 });
    if (experience === undefined || experience < 0)
      return NextResponse.json({ success: false, message: "Valid experience is required" }, { status: 400 });

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email.toLowerCase())) {
      return NextResponse.json({ success: false, message: "Invalid email format" }, { status: 400 });
    }

    // Duplicate check
    const existing = await Doctor.findOne({
      $or: [
        { email: email.toLowerCase().trim() },
        { licenseNumber: licenseNumber.trim() },
      ],
    });

    if (existing) {
      const field = existing.email === email.toLowerCase().trim() ? "Email" : "License number";
      return NextResponse.json({ success: false, message: `${field} already registered` }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password.trim(), 12);

    // Create doctor
    const newDoctor = await Doctor.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone: phone.trim(),
      specialization: specialization.trim(),
      licenseNumber: licenseNumber.trim(),
      department: department.trim(),
      experience,
      qualifications,
      consultationFee,
      availableDays,
      availableTimeSlots,
      createdBy: verification.decoded.id,
      createdByModel:
        verification.decoded.model ||
        (verification.decoded.role === "superadmin" ? "SuperAdmin" : "Admin"),
      status: "active",
      isAvailable: true,
    });

    // ============ UPDATED SUCCESS RESPONSE (Ab sab fields show ho rahe hain) ============
    return NextResponse.json(
      {
        success: true,
        message: "Doctor registered successfully!",
        createdBy: {
          name: verification.decoded.name || verification.decoded.email,
          role: verification.decoded.role,
          type: verification.decoded.role === "superadmin" ? "SuperAdmin" : "Admin",
        },
        data: {
          doctor: {
            id: newDoctor._id,
            name: newDoctor.name,
            email: newDoctor.email,
            phone: newDoctor.phone,
            specialization: newDoctor.specialization,
            licenseNumber: newDoctor.licenseNumber,
            department: newDoctor.department,
            experience: newDoctor.experience,
            qualifications: newDoctor.qualifications,
            consultationFee: newDoctor.consultationFee,
            availableDays: newDoctor.availableDays,
            availableTimeSlots: newDoctor.availableTimeSlots,
            status: newDoctor.status,
            isAvailable: newDoctor.isAvailable,
            createdAt: newDoctor.createdAt,
          },
        },
      },
      { status: 201 }
    );
    // =================================================================================
  } catch (error) {
    console.error("Doctor Register Error:", error.message);
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