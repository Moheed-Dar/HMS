// src/backend/models/Prescription.js

import mongoose from "mongoose";

const PrescriptionSchema = new mongoose.Schema(
  {
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: [true, "Appointment ID is required"],
      index: true, // Fast lookup by appointment
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: [true, "Doctor is required"],
      index: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Patient is required"],
    },
    // Medicines list
    medicines: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        dosage: {
          type: String,
          trim: true,
          // e.g., "500mg", "1 tablet"
        },
        frequency: {
          type: String,
          trim: true,
          // e.g., "Twice a day", "After meal"
        },
        duration: {
          type: String,
          trim: true,
          // e.g., "7 days", "1 month"
        },
        instructions: {
          type: String,
          trim: true,
          maxlength: 300,
        },
      },
    ],
    // Additional doctor notes
    diagnosis: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    advice: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    followUpDate: {
      type: Date,
      default: null,
    },
    // Who created/updated
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor", // Sirf Doctor hi create karega
      required: true,
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
    // Soft delete
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "deletedByModel",
      default: null,
    },
    deletedByModel: {
      type: String,
      enum: ["Doctor", "Admin", "SuperAdmin"],
      default: null,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Indexes for performance
PrescriptionSchema.index({ appointment: 1, isDeleted: 1 });
PrescriptionSchema.index({ doctor: 1, isDeleted: 1 });
PrescriptionSchema.index({ patient: 1, isDeleted: 1 });

export default mongoose.models.Prescription ||
  mongoose.model("Prescription", PrescriptionSchema);
