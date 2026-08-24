package com.medisphere.controller;

import com.medisphere.dto.NotificationResponse;
import com.medisphere.entity.Patient;
import com.medisphere.entity.Doctor;
import com.medisphere.exception.ResourceNotFoundException;
import com.medisphere.repository.DoctorRepository;
import com.medisphere.repository.PatientRepository;
import com.medisphere.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    // ==========================
    // PATIENT
    // ==========================

    @GetMapping("/my")
    @PreAuthorize("hasRole('PATIENT')")
    public List<NotificationResponse> getPatientNotifications(Authentication authentication) {

        Patient patient = patientRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        return notificationService.getNotifications(patient.getId(), "PATIENT");
    }

    @PutMapping("/{id}/read")
    @PreAuthorize("hasAnyRole('PATIENT', 'DOCTOR')")
    public String markAsRead(@PathVariable Long id) {

        notificationService.markAsRead(id);
        return "Notification marked as read.";
    }

    @PutMapping("/read-all")
    @PreAuthorize("hasRole('PATIENT')")
    public String markAllReadPatient(Authentication authentication) {

        Patient patient = patientRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        notificationService.markAllAsRead(patient.getId(), "PATIENT");
        return "All notifications marked as read.";
    }

    // ==========================
    // DOCTOR
    // ==========================

    @GetMapping("/doctor")
    @PreAuthorize("hasRole('DOCTOR')")
    public List<NotificationResponse> getDoctorNotifications(Authentication authentication) {

        Doctor doctor = doctorRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        return notificationService.getNotifications(doctor.getId(), "DOCTOR");
    }

    @PutMapping("/doctor/read-all")
    @PreAuthorize("hasRole('DOCTOR')")
    public String markAllReadDoctor(Authentication authentication) {

        Doctor doctor = doctorRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        notificationService.markAllAsRead(doctor.getId(), "DOCTOR");
        return "All notifications marked as read.";
    }

    // ==========================
    // ADMIN
    // ==========================

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<NotificationResponse> getAllNotifications() {

        return notificationService.getAllNotifications();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteNotification(@PathVariable Long id) {

        notificationService.deleteNotification(id);
        return "Notification deleted successfully.";
    }
}
