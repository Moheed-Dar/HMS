// app/api/super-admin/admin/adminGet/[id]/route.js

import { NextResponse } from "next/server";
import { connectDB } from '@/backend/lib/db';
import Admin from '@/backend/models/Admin';
import { verifyToken } from '@/backend/lib/jwt';

export async function GET(request, context) {
  try {
    await connectDB();

    const { id } = await context.params;

    // ID validation
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid Admin ID format' },
        { status: 400 }
      );
    }

    // AB TOKEN COOKIE SE PADHO — HEADER SE NAHI!
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Login required' },
        { status: 401 }
      );
    }

    const verification = verifyToken(token);

    // Tere token mein "superadmin" hai
    if (!verification.valid || verification.decoded.role !== 'superadmin') {
      return NextResponse.json(
        { success: false, message: 'Access Denied: SuperAdmin only' },
        { status: 403 }
      );
    }

    // Admin dhundo (deleted na dikhe)
    const admin = await Admin.findOne({
      _id: id,
      $or: [
        { isDeleted: false },
        { isDeleted: { $exists: false } }
      ]
    }).select('-password');

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Admin not found or deleted' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Admin fetched successfully',
      fetchedBy: verification.decoded.name || verification.decoded.email,
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone || null,
        role: admin.role,
        department: admin.department,
        employeeId: admin.employeeId,
        permissions: admin.permissions,
        status: admin.status,
        isApproved: admin.isApproved,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt
      }
    });

  } catch (error) {
    console.error('Get Admin By ID Error:', error.message);
    return NextResponse.json(
      {
        success: false,
        message: 'Server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}