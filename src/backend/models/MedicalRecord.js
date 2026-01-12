// backend/models/MedicalRecord.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const MedicalRecordSchema = new Schema(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Patient reference is required"],
      index: true,
    },
    appointment: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      required: false,
      index: true,
    },
    prescription: {
      type: Schema.Types.ObjectId,
      ref: "Prescription",
      required: false,
      index: true,
    },
    details: {
      type: String,
      required: [true, "Medical record details are required"],
      trim: true,
      minlength: [10, "Details must be at least 10 characters"],
      maxlength: [5000, "Details cannot exceed 5000 characters"],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [2000, "Notes cannot exceed 2000 characters"],
      default: "",
    },
    status: {
      type: String,
      enum: {
        values: ["active", "archived", "deleted"],
        message: "{VALUE} is not a valid status",
      },
      default: "active",
      index: true,
    },

    // === AUDIT FIELDS ===
    createdBy: {
      type: Schema.Types.ObjectId,
      refPath: "createdByModel",
      required: [true, "Creator reference is required"],
      index: true,
    },
    createdByModel: {
      type: String,
      enum: {
        values: ["Doctor", "Admin", "Superadmin"],
        message: "{VALUE} is not a valid creator model",
      },
      required: [true, "Creator model type is required"],
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor", // Sirf Doctor hi update karega
      default: null,
    },
    updatedByModel: {
      type: String,
      enum: ["Doctor", "Admin", "Superadmin", "Receptionist"], // Add all possible roles
      default: null,
    },
    // === SOFT DELETE ===
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deletedBy: {
      type: Schema.Types.ObjectId,
      refPath: "deletedByModel",
      default: null,
    },
    deletedByModel: {
      type: String,
      enum: ["Doctor", "Admin", "Superadmin"],
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// === INDEXES FOR PERFORMANCE ===
MedicalRecordSchema.index({ patient: 1, createdAt: -1 });
MedicalRecordSchema.index({ status: 1, isDeleted: 1 });
MedicalRecordSchema.index({ createdAt: -1 });

// === MODEL EXPORT ===
const MedicalRecord =
  mongoose.models.MedicalRecord ||
  mongoose.model("MedicalRecord", MedicalRecordSchema);

export default MedicalRecord;
