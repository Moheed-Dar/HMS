import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const PatientSchema = new mongoose.Schema(
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
      default: "patient",
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
      enum: ["active", "inactive"],
      default: "active",
    },
    
    // Patient-specific fields
    dateOfBirth: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["male", "female", "other"],
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: { type: String, default: "Pakistan" },
    },
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
    },
    medicalHistory: {
      allergies: [String],
      chronicDiseases: [String],
      previousSurgeries: [String],
      currentMedications: [String],
    },
    assignedDoctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },
    registeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "registeredByModel",
    },
    registeredByModel: {
      type: String,
      enum: ["Admin", "Doctor"],
    },
  },
  { timestamps: true }
);

// Virtual field for age
PatientSchema.virtual("age").get(function () {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

PatientSchema.set("toJSON", { virtuals: true });

// Password Hash
PatientSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password Compare
PatientSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON
PatientSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.models.Patient || mongoose.model("Patient", PatientSchema);