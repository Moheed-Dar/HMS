// src/backend/models/SuperAdmin.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const SuperAdminSchema = new mongoose.Schema(
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
      select: false,
    },
    role: {
      type: String,
      default: "superadmin",
      immutable: true,
    },
    phone: {
      type: String,
      default: null,
      // validate: {
      //   validator: function (v) {
      //     return !v || /^\+?[1-9]\d{1,14}$/.test(v);
      //   },
    },
    avatar: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/6596/6596121.png",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

SuperAdminSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return NextResponse.json({ success: true, message: "No password change" }, { status: 200 });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // YEHI LINE ZAROORI HAI!
    return NextResponse.json({ success: true, message: "Password hashed" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Error hashing password" }, { status: 500 });
  }
});

// Password compare method
SuperAdminSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Password hide karne ke liye
SuperAdminSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Model export
const SuperAdmin = mongoose.models.SuperAdmin || mongoose.model("SuperAdmin", SuperAdminSchema);

export default SuperAdmin;