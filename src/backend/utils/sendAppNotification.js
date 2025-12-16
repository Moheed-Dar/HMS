// backend/utils/sendAppNotification.js
import Notification from "@/backend/models/Notification.js";
import SuperAdmin from "@/backend/models/SuperAdmin.js"; // apne model import karo
import Admin from "@/backend/models/Admin.js";
import Doctor from "@/backend/models/Doctor.js";

export const sendAppNotification = async ({
  title,
  message,
  type = "info",
  createdBy, // ObjectId of sender
  createdByModel, // "SuperAdmin" | "Admin" | "Doctor"
  recipients, // [{ userId, role }]
}) => {
  try {
    // Sender ka role dynamically fetch karo
    let createdByRole;

    switch (createdByModel) {
      case "SuperAdmin":
        const superAdmin = await SuperAdmin.findById(createdBy).select("role");
        if (!superAdmin) throw new Error("SuperAdmin not found");
        createdByRole = superAdmin.role || "superadmin"; // fallback
        break;
      case "Admin":
        const admin = await Admin.findById(createdBy).select("role");
        if (!admin) throw new Error("Admin not found");
        createdByRole = admin.role || "admin"; // fallback
        break;
      case "Doctor":
        const doctor = await Doctor.findById(createdBy).select("role");
        if (!doctor) throw new Error("Doctor not found");
        createdByRole = doctor.role || "doctor"; // fallback
        break;
      default:
        throw new Error("Invalid createdByModel");
    }

    // Validation for recipients
    if (!title || !message || !createdBy || !createdByModel || !recipients || recipients.length === 0) {
      throw new Error("Missing required fields for notification");
    }

    // Create notification
    const notification = await Notification.create({
      title,
      message,
      type,
      createdBy,
      createdByModel,
      createdByRole, 
      recipients: recipients.map((r) => ({
        userId: r.userId,
        role: r.role,
        read: false,
      })),
    });

    console.log("Notification created:", notification._id);
    return { success: true, notification };
  } catch (error) {
    console.error("Failed to send notification:", error.message);
    return { success: false, error: error.message };
  }
};