// backend/models/Consultation.js
import mongoose from 'mongoose';

// Agar model pehle se bana hua hai to usi ko return karo (prevents overwrite)
const ConsultationSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: false,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    type: {
      type: String,
      enum: ['in-person', 'video', 'phone', 'follow-up'],
      default: 'in-person',
    },
    durationMinutes: {
      type: Number,
      default: 15,
    },
    chiefComplaint: { type: String, trim: true },
    historyOfPresentIllness: { type: String, trim: true },
    examinationFindings: { type: String, trim: true },
    diagnosis: { type: String, trim: true },
    treatmentPlan: { type: String, trim: true },
    prescriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prescription' }],
    notes: { type: String, trim: true },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'no-show'],
      default: 'scheduled',
    },
    followUpDate: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, refPath: 'createdByModel' },
    createdByModel: { type: String, enum: ['Doctor', 'Admin'] },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, refPath: 'updatedByModel' },
    updatedByModel: { type: String, enum: ['Doctor', 'Admin'] },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexes for better performance
ConsultationSchema.index({ doctor: 1, patient: 1, date: -1 });
ConsultationSchema.index({ status: 1 });

// Prevent overwrite error in dev mode
const Consultation =
  mongoose.models.Consultation ||
  mongoose.model('Consultation', ConsultationSchema);

export default Consultation;