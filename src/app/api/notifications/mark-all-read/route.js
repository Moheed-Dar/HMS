// app/api/notifications/mark-all-read/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Notification from "@/backend/models/Notification";
import jwt from "jsonwebtoken";

async function getUserFromRequest(request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return { userId: decoded.id, role: decoded.role };
    }

    const cookies = request.cookies;
    const token = cookies.get("token")?.value || cookies.get("auth-token")?.value;
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return { userId: decoded.id, role: decoded.role };
    }

    return null;
  } catch (error) {
    return null;
  }
}

export async function PATCH(request) {
  try {
    await connectDB();

    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    const { userId, role } = user;

    // Update all unread notifications for this user
    const result = await Notification.updateMany(
      {
        "recipients": {
          $elemMatch: {
            userId: userId,
            role: role,
            isRead: false,
          },
        },
      },
      {
        $set: {
          "recipients.$[elem].isRead": true,
          "recipients.$[elem].readAt": new Date(),
        },
      },
      {
        arrayFilters: [
          { "elem.userId": userId, "elem.role": role, "elem.isRead": false }
        ],
      }
    );

    return NextResponse.json({
      success: true,
      message: "All notifications marked as read",
      updatedCount: result.modifiedCount,
      readAt: new Date(),
    });
  } catch (error) {
    console.error("Mark all read error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}