// app/api/super-admin/admin/adminDelete/[id]/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Admin from "@/backend/models/Admin";
import { verifyToken } from "@/backend/lib/jwt";

export async function DELETE(request, context) {
  try {
    await connectDB();

    const { id } = await context.params;

    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json({ success: false, message: "Invalid Admin ID" }, { status: 400 });
    }

    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const verification = verifyToken(token);

    const isSuperAdmin = ["super-admin", "superadmin"].includes(verification.decoded?.role);
    if (!verification.valid || !isSuperAdmin) {
      return NextResponse.json({ success: false, message: "SuperAdmin only" }, { status: 403 });
    }

    // PEHLE ADMIN KO FETCH KARO (kyunki delete ke baad data nahi milega)
    const adminToDelete = await Admin.findById(id).select("-password");

    if (!adminToDelete) {
      return NextResponse.json({ success: false, message: "Admin already deleted or not found" }, { status: 404 });
    }

    // HARD DELETE – DATABASE SE PURA RECORD HATA DO
    await Admin.findByIdAndDelete(id);

    // AB YE ADMIN DATABASE MEIN NAHI RAHEGA
    console.log("Admin PERMANENTLY DELETED from DB:", adminToDelete.email);

    return NextResponse.json({
      success: true,
      message: "Admin permanently deleted ",
      deletedBy: verification.decoded.name || verification.decoded.email || "SuperAdmin",
      deletedAdmin: {
        id: adminToDelete._id,
        name: adminToDelete.name,
        email: adminToDelete.email,
        role: adminToDelete.role,
        department: adminToDelete.department,
        employeeId: adminToDelete.employeeId
      }
    }, { status: 200 });

  } catch (error) {
    console.error("DELETE ERROR:", error.message);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}