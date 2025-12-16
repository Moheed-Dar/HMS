
// src/backend/models/Admin.js

import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
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
      select: false, // login ke time bhi password na aaye
    },
    role: {
      type: String,
      enum: ["doctor_manager", "billing_admin", "staff_manager", "admin"],
      default: "admin",
    },
    phone: {
      type: String,
      match: [/^[0-9]{10,15}$/, "Invalid phone number"],
    },
    avatar: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/6596/6596121.png",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "deleted"],
      default: "active",
    },
    isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    default: null
  },
    isApproved: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SuperAdmin",
      required: true,
    },
    assignedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: Date,
    department: {
      type: String,
      enum: ["IT", "HR", "Finance", "Operations", "Medical"],
      required: [true, "Department is required"],
    },
    employeeId: {
      type: String,
      unique: true,
      required: [true, "Employee ID is required"],
      trim: true,
    },
    permissions: {
      type: [String],
      default: ["view_doctors", "view_patients","create_doctors", "delete_doctors", "update_doctors"],
    },
    
  },
  { timestamps: true }
);

// Password hata do response se
AdminSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema);