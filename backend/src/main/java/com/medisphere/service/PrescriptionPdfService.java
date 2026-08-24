package com.medisphere.service;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.*;
import com.medisphere.entity.Prescription;
import com.medisphere.exception.ResourceNotFoundException;
import com.medisphere.repository.PrescriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class PrescriptionPdfService {

    private final PrescriptionRepository prescriptionRepository;

    public byte[] generatePrescriptionPdf(Long prescriptionId) {

        Prescription prescription = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found"));

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            Document document = new Document(PageSize.A4, 50, 50, 60, 60);
            PdfWriter.getInstance(document, baos);
            document.open();

            // ── Fonts ──────────────────────────────────────────────────────
            Font titleFont    = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, new Color(13, 110, 253));
            Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA, 11, new Color(100, 100, 100));
            Font sectionFont  = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 13, new Color(30, 30, 30));
            Font labelFont    = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, new Color(60, 60, 60));
            Font valueFont    = FontFactory.getFont(FontFactory.HELVETICA, 11, new Color(40, 40, 40));
            Font footerFont   = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 9, new Color(130, 130, 130));

            // ── Header ─────────────────────────────────────────────────────
            Paragraph hospitalName = new Paragraph("🏥 MediSphere Healthcare", titleFont);
            hospitalName.setAlignment(Element.ALIGN_CENTER);
            document.add(hospitalName);

            Paragraph hospitalSubtitle = new Paragraph("Premium Healthcare Management System", subtitleFont);
            hospitalSubtitle.setAlignment(Element.ALIGN_CENTER);
            hospitalSubtitle.setSpacingAfter(4);
            document.add(hospitalSubtitle);

            // ── Divider ────────────────────────────────────────────────────
            PdfPTable headerLine = new PdfPTable(1);
            headerLine.setWidthPercentage(100);
            PdfPCell lineCell = new PdfPCell();
            lineCell.setBackgroundColor(new Color(13, 110, 253));
            lineCell.setFixedHeight(3);
            lineCell.setBorder(Rectangle.NO_BORDER);
            headerLine.addCell(lineCell);
            headerLine.setSpacingAfter(20);
            document.add(headerLine);

            // ── Prescription Title ─────────────────────────────────────────
            Paragraph prescTitle = new Paragraph("MEDICAL PRESCRIPTION", sectionFont);
            prescTitle.setAlignment(Element.ALIGN_CENTER);
            prescTitle.setSpacingAfter(20);
            document.add(prescTitle);

            // ── Patient & Doctor Info ──────────────────────────────────────
            PdfPTable infoTable = new PdfPTable(2);
            infoTable.setWidthPercentage(100);
            infoTable.setSpacingAfter(20);

            addInfoCell(infoTable, "Patient Name", prescription.getAppointment().getPatient().getPatientName(), labelFont, valueFont);
            addInfoCell(infoTable, "Doctor Name", "Dr. " + prescription.getAppointment().getDoctor().getDoctorName(), labelFont, valueFont);
            addInfoCell(infoTable, "Date", LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy")), labelFont, valueFont);
            addInfoCell(infoTable, "Specialization", prescription.getAppointment().getDoctor().getSpecialization(), labelFont, valueFont);

            document.add(infoTable);

            // ── Prescription Details ───────────────────────────────────────
            Paragraph detailsTitle = new Paragraph("Prescription Details", sectionFont);
            detailsTitle.setSpacingAfter(10);
            document.add(detailsTitle);

            PdfPTable detailsTable = new PdfPTable(new float[]{2, 4});
            detailsTable.setWidthPercentage(100);
            detailsTable.setSpacingAfter(20);

            addDetailRow(detailsTable, "Medicine", prescription.getMedicine(), labelFont, valueFont);
            addDetailRow(detailsTable, "Dosage", prescription.getDosage(), labelFont, valueFont);
            addDetailRow(detailsTable, "Duration", prescription.getDuration(), labelFont, valueFont);

            if (prescription.getNotes() != null && !prescription.getNotes().isBlank()) {
                addDetailRow(detailsTable, "Notes", prescription.getNotes(), labelFont, valueFont);
            }

            document.add(detailsTable);

            // ── Disclaimer ─────────────────────────────────────────────────
            PdfPTable disclaimer = new PdfPTable(1);
            disclaimer.setWidthPercentage(100);
            disclaimer.setSpacingAfter(30);
            PdfPCell disclaimerCell = new PdfPCell(new Phrase(
                    "⚠ This prescription is system-generated. Please consult your doctor before making any changes to medication.",
                    FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 9, new Color(150, 80, 0))
            ));
            disclaimerCell.setBackgroundColor(new Color(255, 248, 230));
            disclaimerCell.setPadding(10);
            disclaimerCell.setBorderColor(new Color(255, 193, 7));
            disclaimer.addCell(disclaimerCell);
            document.add(disclaimer);

            // ── Footer ─────────────────────────────────────────────────────
            PdfPTable footerLine = new PdfPTable(1);
            footerLine.setWidthPercentage(100);
            PdfPCell fl = new PdfPCell();
            fl.setBackgroundColor(new Color(200, 200, 200));
            fl.setFixedHeight(1);
            fl.setBorder(Rectangle.NO_BORDER);
            footerLine.addCell(fl);
            footerLine.setSpacingAfter(6);
            document.add(footerLine);

            Paragraph footer = new Paragraph("Generated by MediSphere — " +
                    LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy")), footerFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF: " + e.getMessage(), e);
        }
    }

    private void addInfoCell(PdfPTable table, String label, String value, Font labelFont, Font valueFont) {
        PdfPCell cell = new PdfPCell();
        cell.setBorder(Rectangle.NO_BORDER);
        cell.setPadding(6);
        Paragraph p = new Paragraph();
        p.add(new Chunk(label + ": ", labelFont));
        p.add(new Chunk(value != null ? value : "N/A", valueFont));
        cell.addElement(p);
        table.addCell(cell);
    }

    private void addDetailRow(PdfPTable table, String label, String value, Font labelFont, Font valueFont) {
        PdfPCell labelCell = new PdfPCell(new Phrase(label, labelFont));
        labelCell.setBackgroundColor(new Color(240, 245, 255));
        labelCell.setPadding(10);
        labelCell.setBorderColor(new Color(200, 210, 240));

        PdfPCell valueCell = new PdfPCell(new Phrase(value != null ? value : "N/A", valueFont));
        valueCell.setPadding(10);
        valueCell.setBorderColor(new Color(200, 210, 240));

        table.addCell(labelCell);
        table.addCell(valueCell);
    }
}
