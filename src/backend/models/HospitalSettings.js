// backend/models/HospitalSettings.js
import mongoose from "mongoose";

const HospitalSettingsSchema = new mongoose.Schema(
  {
    hospitalName: { type: String, default: "My Hospital" },
    tagline: { type: String, default: "Caring for Life" },
    address: { type: String, default: "123 Hospital Street, City, Country" },
    phone: { type: String, default: "+92 300 1234567" },
    email: { type: String, default: "info@myhospital.com" },
    website: { type: String },
    logo: { type: String }, // URL
    workingHours: { type: String, default: "09:00 AM - 09:00 PM" },
    emergencyContact: { type: String, default: "+92 300 0000000" },
    departments: {
      type: [String],
      default: [
        // Main Departments
        "General Medicine",
        "Emergency",
        "Cardiology",
        "Neurology",
        "Orthopedics",
        "Pediatrics",
        "Dermatology",
        "Gynecology & Obstetrics",
        "ENT (Ear, Nose, Throat)",
        "Ophthalmology (Eye)",
        "Dentistry",
        "Psychiatry",
        "Gastroenterology",
        "Pulmonology (Chest)",
        "Nephrology (Kidney)",
        "Urology",
        "Endocrinology",
        "Rheumatology",
        "Oncology (Cancer)",
        "Hematology",

        // Surgical Departments
        "General Surgery",
        "Neurosurgery",
        "Cardiac Surgery",
        "Plastic Surgery",
        "Orthopedic Surgery",
        "Pediatric Surgery",

        // Other Important
        "Radiology",
        "Pathology & Laboratory",
        "Anesthesiology",
        "Physiotherapy & Rehabilitation",
        "Nutrition & Dietetics",
        "Pharmacy",
        "Blood Bank",
        "ICU (Intensive Care Unit)",
        "NICU (Neonatal ICU)",
        "CCU (Critical Care Unit)"
      ]
    },
    currency: { type: String, default: "PKR" },
    currencySymbol: { type: String, default: "Rs." },
  },
  { timestamps: true }
);

// Optional: Ensure only one document exists
HospitalSettingsSchema.index({ _id: true });

const HospitalSettings = mongoose.models.HospitalSettings || mongoose.model("HospitalSettings", HospitalSettingsSchema);

export default HospitalSettings;