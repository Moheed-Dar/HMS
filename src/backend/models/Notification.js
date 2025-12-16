// backend/models/Notification.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ["info", "success", "warning", "danger", "announcement"],
    default: "info",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "createdByModel", // dynamic reference abhi rakhte hain
  },
  createdByModel: {
    type: String,
    required: true,
    enum: ["SuperAdmin", "Admin", "Doctor"], // model ke liye rakha, lekin role alag se
  },
  createdByRole: {
    type: String,
    required: true,
    trim: true,
    // No enum → dynamically aayega (billing_admin, cardiologist, etc.)
  },
  recipients: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      role: {
        type: String,
        required: true,
        trim: true,
        // Already enum hata diya tha → koi bhi role
      },
      message:{
        type: String,
        trim: true,
      },
      read: {
        type: Boolean,
        default: false,
      },
      readAt: {
        type: Date,
      },
    },
  ],
}, { timestamps: true });

// Indexes for fast queries
notificationSchema.index({ "recipients.userId": 1 });
notificationSchema.index({ "recipients.role": 1 });

export default mongoose.models.Notification || mongoose.model("Notification", notificationSchema);