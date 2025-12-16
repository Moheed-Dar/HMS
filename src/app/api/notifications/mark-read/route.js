// app/api/notifications/mark-read/route.js
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
    console.error("Auth error:", error);
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
    const body = await request.json();
    const { notificationId } = body;

    if (!notificationId) {
      return NextResponse.json(
        { error: "notificationId required" },
        { status: 400 }
      );
    }

    // Find and update notification
    const notification = await Notification.findOneAndUpdate(
      {
        _id: notificationId,
        "recipients.userId": userId,
        "recipients.role": role,
        "recipients.isRead": false,
      },
      {
        $set: {
          "recipients.$.isRead": true,
          "recipients.$.readAt": new Date(),
        },
      },
      { new: true }
    );

    if (!notification) {
      return NextResponse.json(
        { error: "Notification not found or already read" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Notification marked as read",
      notificationId: notification._id,
      readAt: new Date(),
    });
  } catch (error) {
    console.error("Mark read error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}