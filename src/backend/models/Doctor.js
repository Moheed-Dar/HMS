// backend/models/Doctor.js

import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // Important: password query mein na aaye
    },
    role: {
      type: String,
      default: "doctor",
      immutable: true,
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      match: [/^[0-9]{10,15}$/, "Please enter a valid phone number"],
    },
    avatar: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/6596/6596121.png",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "on_leave"],
      default: "active",
    },
    specialization: {
      type: String,
      required: [true, "Specialization is required"],
    },
    permissions: {
      type: [String],
      default: [
        "view_patients",
        "view_patient_details",
        "view_patient_history",
        "view_appointments",
        "delete_appointments",
        "create_appointments",
        "update_appointments",
        "create_prescription",
        "update_prescription",
        "delete_prescription",
        "view_prescription",
        "view_reports",
        "update_patient_notes",
        "reports_view",
        "reports_download",
        "reports_generate",
        "reports_delete",
        "reports_update",
        "reports_create",
        "view_doctors",
        "reports_download",
        "consultation_create"
      ],
    },
    licenseNumber: {
      type: String,
      required: [true, "License number is required"],
      unique: true,
      trim: true,
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      enum: [
        "Cardiology",
        "Neurology",
        "Orthopedics",
        "Pediatrics",
        "Dermatology",
        "General",
        "Emergency",
      ],
    },
    experience: {
      type: Number,
      required: [true, "Experience is required"],
      min: [0, "Experience cannot be negative"],
    },
    qualifications: {
      type: [String],
      default: [],
    },
    consultationFee: {
      type: Number,
      default: 0,
    },
    availableDays: {
      type: [String],
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
    availableTimeSlots: {
      type: [
        {
          startTime: {
            type: String,
            required: [true, "Start time is required"],
          },
          endTime: {
            type: String,
            required: [true, "End time is required"],
          },
        },
      ],
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "createdByModel",
      required: true,
    },
    createdByModel: {
      type: String,
      required: true,
      enum: ["SuperAdmin", "Admin"],
    },
  },
  { timestamps: true }
);

// Password ko JSON response se hatao
DoctorSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.models.Doctor || mongoose.model("Doctor", DoctorSchema);
