// app/api/test-send-notification/route.js
import { NextResponse } from "next/server";
import { sendAppNotification } from "@/backend/utils/sendAppNotification";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      title,
      message,
      type,
      createdBy,
      createdByModel,
      recipientUserId,
      recipientRole
    } = body;

    if (!title || !message || !createdBy || !createdByModel || !recipientUserId || !recipientRole) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await sendAppNotification({
      title,
      message,
      type: type || "info",
      createdBy,
      createdByModel,
      recipients: [
        {
          userId: recipientUserId,
          role: recipientRole
        }
      ]
    });

    if (result.success) {
      return NextResponse.json({ success: true, message: "Notification sent!", data: result.notification });
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

  } catch (error) {
    console.error("Test notification error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
