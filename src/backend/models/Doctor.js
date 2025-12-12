import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const DoctorSchema = new mongoose.Schema(
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
    
    // Doctor-specific fields
    specialization: {
      type: String,
      required: [true, "Specialization is required"],
    },
    licenseNumber: {
      type: String,
      required: [true, "License number is required"],
      unique: true,
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      enum: ["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Dermatology", "General", "Emergency"],
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
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
    availableTimeSlots: [
      {
        startTime: String,
        endTime: String,
      },
    ],
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
      refPath: "createdByModel", // Dynamic reference
    },
    createdByModel: {
      type: String,
      enum: ["SuperAdmin", "Admin"],
    },
  },
  { timestamps: true }
);

// Password Hash
DoctorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password Compare
DoctorSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON
DoctorSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.models.Doctor || mongoose.model("Doctor", DoctorSchema);