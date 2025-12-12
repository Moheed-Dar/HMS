import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const AdminSchema = new mongoose.Schema(
  {
    // Common fields
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
      enum: ["doctor_manager", "billing_admin", "staff_manager", "admin"],
      default: "admin",
    },
    phone: {
      type: String,
      match: [/^[0-9]{10,15}$/, "Please enter a valid phone number"],
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
    
    // Admin-specific fields
    isApproved: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SuperAdmin",
      required: [true, "Creator (SuperAdmin) is required"],
    },
    assignedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
    },
    department: {
      type: String,
      enum: ["IT", "HR", "Finance", "Operations", "Medical"],
      required: [true, "Department is required"],
    },
    employeeId: {
      type: String,
      unique: true,
      required: [true, "Employee ID is required"],
    },
    permissions: {
      type: [String],
      default: ["view_doctors", "view_patients"],
    },
  },
  { timestamps: true }
);

// Password Hash
AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password Compare
AdminSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON
AdminSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

