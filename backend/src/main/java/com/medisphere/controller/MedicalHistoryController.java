package com.medisphere.controller;

import com.medisphere.dto.MedicalHistoryRequest;
import com.medisphere.dto.MedicalHistoryResponse;
import com.medisphere.service.MedicalHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/medical-history")
@RequiredArgsConstructor
public class MedicalHistoryController {

    private final MedicalHistoryService medicalHistoryService;

    // ==========================
    // PATIENT
    // ==========================

    @PostMapping
    @PreAuthorize("hasRole('PATIENT')")
    public MedicalHistoryResponse saveOrUpdate(
            Authentication authentication,
            @RequestBody MedicalHistoryRequest request) {

        return medicalHistoryService.saveOrUpdate(authentication.getName(), request);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('PATIENT')")
    public MedicalHistoryResponse getMyHistory(Authentication authentication) {

        return medicalHistoryService.getMyHistory(authentication.getName());
    }

    // ==========================
    // DOCTOR
    // ==========================

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasRole('DOCTOR')")
    public MedicalHistoryResponse getByPatientId(@PathVariable Long patientId) {

        return medicalHistoryService.getByPatientId(patientId);
    }

    // ==========================
    // ADMIN
    // ==========================

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<MedicalHistoryResponse> getAll() {

        return medicalHistoryService.getAll();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String delete(@PathVariable Long id) {

        medicalHistoryService.delete(id);
        return "Medical history deleted successfully.";
    }
}
