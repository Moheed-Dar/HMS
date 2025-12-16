// app/api/notifications/sent/route.js
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

export async function GET(request) {
  try {
    await connectDB();

    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    const { userId } = user;

    // Jo notifications is user ne SEND kiye hain
    const sentNotifications = await Notification.find({
      createdBy: userId,
    })
      .populate({
        path: "recipients.userId",
        select: "name email role profileImage",
      })
      .sort({ createdAt: -1 })
      .limit(50);

    // Format with read status
    const formattedNotifications = sentNotifications.map((notif) => {
      const recipientsWithStatus = notif.recipients.map((r) => ({
        userId: r.userId._id,
        name: r.userId.name,
        email: r.userId.email,
        role: r.role,
        profileImage: r.userId.profileImage,
        isRead: r.isRead,
        readAt: r.readAt,
      }));

      // Calculate statistics
      const totalRecipients = recipientsWithStatus.length;
      const readCount = recipientsWithStatus.filter((r) => r.isRead).length;
      const unreadCount = totalRecipients - readCount;

      return {
        id: notif._id,
        title: notif.title,
        message: notif.message,
        type: notif.type,
        recipients: recipientsWithStatus,
        stats: {
          total: totalRecipients,
          read: readCount,
          unread: unreadCount,
          readPercentage: totalRecipients > 0 ? ((readCount / totalRecipients) * 100).toFixed(1) : 0,
        },
        createdAt: notif.createdAt,
        updatedAt: notif.updatedAt,
      };
    });

    return NextResponse.json({
      success: true,
      sentNotifications: formattedNotifications,
      totalSent: formattedNotifications.length,
    });
  } catch (error) {
    console.error("Get sent notifications error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}