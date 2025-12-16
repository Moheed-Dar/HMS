import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import Notification from "@/backend/models/Notification";
import jwt from "jsonwebtoken";

// Helper function to get user from token
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

    const { userId, role } = user;

    const { searchParams } = new URL(request.url);
    const queryUserId = searchParams.get("userId") || userId;
    const queryRole = searchParams.get("role") || role;
    const isRead = searchParams.get("isRead");

    const query = {
      recipients: {
        $elemMatch: {
          userId: queryUserId,
          role: queryRole,
        },
      },
    };

    if (isRead !== null && isRead !== undefined) {
      query["recipients.isRead"] = isRead === "true";
    }

    // Notifications fetch with populate
    const notifications = await Notification.find(query)
      .populate("createdBy", "name email role profileImage") // Creator ki details
      .populate({
        path: "recipients.userId",
        select: "name email role profileImage phone", // Recipient ki details
      })
      .sort({ createdAt: -1 })
      .limit(50);

    // Format notifications with recipient details
    const formattedNotifications = notifications.map((notif) => {
      const recipient = notif.recipients.find(
        (r) => r.userId._id.toString() === queryUserId && r.role === queryRole
      );

      return {
        id: notif._id,
        title: notif.title,
        Notification: "Notification received",
        message: notif.message,
        type: notif.type,
        
        // Recipient ki complete info
        recipient: {
          userId: recipient?.userId._id,
          name: recipient?.userId.name,
          email: recipient?.userId.email,
          role: recipient?.role,
          profileImage: recipient?.userId.profileImage,
          phone: recipient?.userId.phone,
          isRead: recipient?.isRead || false,
          readAt: recipient?.readAt || null,
        },
        
        // Creator (jo ne send kiya) ki info
        createdBy: {
          id: notif.createdBy._id,
          name: notif.createdBy.name,
          email: notif.createdBy.email,
          role: notif.createdBy.role,
          profileImage: notif.createdBy.profileImage,
        },
        
        createdAt: notif.createdAt,
        updatedAt: notif.updatedAt,
      };
    });

    const unreadCount = formattedNotifications.filter((n) => !n.recipient.isRead).length;

    return NextResponse.json({
      success: true,
      notifications: formattedNotifications,
      unreadCount,
      currentUser: {
        userId: queryUserId,
        role: queryRole,
      },
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

