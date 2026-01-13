// app/api/doctor/reports/download-report/[id]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";
import MedicalRecord from "@/backend/models/MedicalRecord";
import Consultation from "@/backend/models/Consultation"; // ← added
import Patient from "@/backend/models/Patient";
import Appointment from "@/backend/models/Appointment";
import Prescription from "@/backend/models/Prescription";
import { verifyToken } from "@/backend/lib/jwt";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function GET(request, context) {
  try {
    await connectDB();

    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: "Login required" }, { status: 401 });
    }

    const verification = verifyToken(token);
    if (!verification.valid || !verification.decoded) {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
    }

    const doctorId = verification.decoded.id;
    if (!doctorId) {
      return NextResponse.json({ success: false, message: "Token missing doctor ID" }, { status: 400 });
    }

    // Await params (Next.js App Router fix)
    const { params } = context;
    const { id: recordId } = await params;

    if (!recordId || !recordId.match(/^[0-9a-fA-F]{24}$/)) {
      console.log(`[DOWNLOAD] Invalid ID: "${recordId || 'missing'}"`);
      return NextResponse.json(
        { 
          success: false, 
          message: "Invalid report ID format. Must be 24-character hex string.",
          received: recordId || "missing"
        }, 
        { status: 400 }
      );
    }

    console.log(`[DOWNLOAD] Doctor: ${doctorId} | Record: ${recordId}`);

    // Fetch the main medical record with ownership check
    const record = await MedicalRecord.findOne({
      _id: recordId,
      isDeleted: { $ne: true },
      $or: [
        { createdBy: doctorId, createdByModel: "Doctor" },
        { updatedBy: doctorId, updatedByModel: "Doctor" },
      ],
    })
      .populate("patient", "name email phone gender dateOfBirth")
      .populate("appointment", "date timeSlot status reason")
      .populate({
        path: "prescription",
        select: "medicines diagnosis advice followUpDate",
      })
      .lean();

    if (!record) {
      const exists = await MedicalRecord.findById(recordId).select("_id createdBy updatedBy isDeleted").lean();
      
      if (!exists) {
        console.log(`[DOWNLOAD] Record not found: ${recordId}`);
        return NextResponse.json({ success: false, message: "Report does not exist" }, { status: 404 });
      }

      console.log(`[DOWNLOAD] Ownership mismatch:`, {
        createdBy: exists.createdBy?.toString(),
        updatedBy: exists.updatedBy?.toString(),
        doctorId
      });

      return NextResponse.json(
        { success: false, message: "You don't have permission to download this report" },
        { status: 403 }
      );
    }

    // Fetch all related consultations for this patient + doctor
    const consultations = await Consultation.find({
      patient: record.patient._id,
      doctor: doctorId,
      isDeleted: { $ne: true },
    })
      .populate("appointment", "date timeSlot status reason notes")
      .populate({
        path: "prescriptions",
        select: "medicines diagnosis advice followUpDate",
      })
      .sort({ date: -1 })
      .lean();

    // PDF generation
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const drawText = (text, x, y, size = 12, isBold = false, color = rgb(0, 0, 0)) => {
      page.drawText(text, {
        x,
        y,
        size,
        font: isBold ? boldFont : font,
        color,
      });
    };

    let yPos = 780;

    // Header
    drawText("Medical Consultation Report", 50, yPos, 18, true);
    yPos -= 50;

    // Report Info
    drawText(`Report ID: ${recordId}`, 50, yPos, 12);
    yPos -= 20;
    drawText(`Date: ${new Date(record.createdAt).toLocaleDateString("en-PK")}`, 50, yPos);
    yPos -= 30;

    // Patient Info
    drawText("Patient Information:", 50, yPos, 14, true);
    yPos -= 25;
    drawText(`Name: ${record.patient?.name || "N/A"}`, 70, yPos);
    yPos -= 20;
    drawText(`Gender: ${record.patient?.gender || "N/A"}`, 70, yPos);
    yPos -= 20;
    drawText(`Phone: ${record.patient?.phone || "N/A"}`, 70, yPos);
    yPos -= 20;
    drawText(`Date of Birth: ${record.patient?.dateOfBirth ? new Date(record.patient.dateOfBirth).toLocaleDateString("en-PK") : "N/A"}`, 70, yPos);
    yPos -= 40;

    // Appointment
    drawText("Appointment Details:", 50, yPos, 14, true);
    yPos -= 25;
    drawText(`Date: ${record.appointment?.date ? new Date(record.appointment.date).toLocaleDateString("en-PK") : "N/A"}`, 70, yPos);
    yPos -= 20;
    drawText(`Time Slot: ${record.appointment?.timeSlot || "N/A"}`, 70, yPos);
    yPos -= 20;
    drawText(`Status: ${record.appointment?.status || "N/A"}`, 70, yPos);
    yPos -= 20;
    drawText(`Reason: ${record.appointment?.reason || "N/A"}`, 70, yPos);
    yPos -= 40;

    // Diagnosis
    drawText("Diagnosis:", 50, yPos, 14, true);
    yPos -= 25;
    drawText(record.prescription?.diagnosis || "Not specified", 70, yPos, 12);
    yPos -= 40;

    // Medicines
    drawText("Prescribed Medicines:", 50, yPos, 14, true);
    yPos -= 25;
    (record.prescription?.medicines || []).forEach((m, index) => {
      const medLine = `${index + 1}. ${m.name || "N/A"} - Dosage: ${m.dosage || "N/A"} - ${m.frequency || "N/A"} - ${m.duration || "N/A"}`;
      drawText(medLine, 70, yPos, 11);
      yPos -= 20;
    });
    yPos -= 20;

    // Advice
    drawText("Advice:", 50, yPos, 14, true);
    yPos -= 25;
    drawText(record.prescription?.advice || "No specific advice given", 70, yPos, 12);
    yPos -= 40;

    // Follow-up
    drawText("Follow-up:", 50, yPos, 14, true);
    yPos -= 25;
    drawText(record.prescription?.followUpDate ? new Date(record.prescription.followUpDate).toLocaleDateString("en-PK") : "Not scheduled", 70, yPos);
    yPos -= 40;

    // ── Related Consultations Section ─────────────────────────────────────
    if (consultations.length > 0) {
      drawText(`Related Consultations (${consultations.length})`, 50, yPos, 14, true);
      yPos -= 30;

      consultations.forEach((c, index) => {
        drawText(`Consultation ${index + 1}: ${new Date(c.date).toLocaleDateString("en-PK")}`, 50, yPos, 12, true);
        yPos -= 20;
        drawText(`Type: ${c.type || "N/A"} | Duration: ${c.durationMinutes || "N/A"} min`, 70, yPos);
        yPos -= 20;
        drawText(`Diagnosis: ${c.diagnosis || "N/A"}`, 70, yPos);
        yPos -= 20;
        drawText(`Follow-up: ${c.followUpDate ? new Date(c.followUpDate).toLocaleDateString("en-PK") : "None"}`, 70, yPos);
        yPos -= 30;
      });
    } else {
      drawText("No related consultations found", 50, yPos, 12);
      yPos -= 30;
    }

    // Generate PDF bytes
    const pdfBytes = await pdfDoc.save();

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Medical-Report-${recordId}.pdf"`,
      },
    });

  } catch (error) {
    console.error("Doctor PDF Download Error:", error.message, error.stack);
    return NextResponse.json({ success: false, message: "Server error while generating PDF" }, { status: 500 });
  }
}