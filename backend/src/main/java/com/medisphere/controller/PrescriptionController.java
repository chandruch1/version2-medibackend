package com.medisphere.controller;

import com.medisphere.dto.PrescriptionRequest;
import com.medisphere.dto.PrescriptionResponse;
import com.medisphere.service.PrescriptionPdfService;
import com.medisphere.service.PrescriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/prescriptions")
@RequiredArgsConstructor
public class PrescriptionController {

    private final PrescriptionService prescriptionService;
    private final PrescriptionPdfService prescriptionPdfService;

    // ==========================
    // Doctor - Add Prescription
    // ==========================
    @PostMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public PrescriptionResponse addPrescription(
            @Valid @RequestBody PrescriptionRequest request) {

        return prescriptionService.addPrescription(request);
    }

    // ==========================
    // Admin - Get All Prescriptions
    // ==========================
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<PrescriptionResponse> getAllPrescriptions() {

        return prescriptionService.getAllPrescriptions();
    }

    // ==========================
    // Get Prescription By Id
    // ==========================
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR')")
    public PrescriptionResponse getPrescription(
            @PathVariable Long id) {

        return prescriptionService.getPrescription(id);
    }

    // ==========================
    // Patient - My Prescriptions
    // ==========================
    @GetMapping("/my")
    @PreAuthorize("hasRole('PATIENT')")
    public List<PrescriptionResponse> getMyPrescriptions(
            Authentication authentication) {

        return prescriptionService.getMyPrescriptions(
                authentication.getName());
    }

    // ==========================
    // Patient - Search Prescriptions
    // ==========================
    @GetMapping("/my/search")
    @PreAuthorize("hasRole('PATIENT')")
    public List<PrescriptionResponse> searchMyPrescriptions(
            Authentication authentication,
            @RequestParam String keyword) {

        return prescriptionService.searchMyPrescriptions(
                authentication.getName(), keyword);
    }

    // ==========================
    // Doctor - Update Prescription
    // ==========================
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public PrescriptionResponse updatePrescription(
            @PathVariable Long id,
            @Valid @RequestBody PrescriptionRequest request) {

        return prescriptionService.updatePrescription(id, request);
    }

    // ==========================
    // Admin - Delete Prescription
    // ==========================
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deletePrescription(
            @PathVariable Long id) {

        prescriptionService.deletePrescription(id);

        return "Prescription deleted successfully.";
    }

    // ==========================
    // Patient - Download Prescription PDF
    // ==========================
    @GetMapping("/{id}/pdf")
    @PreAuthorize("hasAnyRole('PATIENT','DOCTOR','ADMIN')")
    public ResponseEntity<byte[]> downloadPrescriptionPdf(@PathVariable Long id) {

        byte[] pdf = prescriptionPdfService.generatePrescriptionPdf(id);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"prescription-" + id + ".pdf\"")
                .body(pdf);
    }
}