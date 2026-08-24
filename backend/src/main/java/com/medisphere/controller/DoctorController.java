package com.medisphere.controller;

import com.medisphere.dto.*;
import com.medisphere.service.DoctorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.medisphere.service.AppointmentService;

import java.util.List;

@RestController
@RequestMapping("/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;
    private final AppointmentService appointmentService;

    // ==========================
    // Doctor Login
    // ==========================
    @PostMapping("/login")
    public DoctorLoginResponse login(
            @Valid @RequestBody DoctorLoginRequest request) {

        return doctorService.login(request);
    }

    // ==========================
    // Doctor Profile
    // ==========================
    @GetMapping("/profile")
    @PreAuthorize("hasRole('DOCTOR')")
    public DoctorResponse getDoctorProfile(Authentication authentication) {

        return doctorService.getDoctorProfile(authentication.getName());
    }

    // ==========================
    // Add Doctor
    // ==========================
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public DoctorResponse addDoctor(
            @Valid @RequestBody DoctorRequest request) {

        return doctorService.addDoctor(request);
    }

    // ==========================
    // Get All Doctors
    // ==========================
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<DoctorResponse> getAllDoctors() {

        return doctorService.getAllDoctors();
    }

    // ==========================
    // Get Doctor By Id
    // ==========================
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public DoctorResponse getDoctorById(
            @PathVariable Long id) {

        return doctorService.getDoctorById(id);
    }

    // ==========================
    // Update Doctor
    // ==========================
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public DoctorResponse updateDoctor(
            @PathVariable Long id,
            @Valid @RequestBody DoctorRequest request) {

        return doctorService.updateDoctor(id, request);
    }

    // ==========================
    // Delete Doctor
    // ==========================
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteDoctor(
            @PathVariable Long id) {

        doctorService.deleteDoctor(id);

        return "Doctor deleted successfully.";
    }

    // ==========================
    // Search Doctor By Name
    // ==========================
    @GetMapping("/search/name")
    @PreAuthorize("hasRole('ADMIN')")
    public List<DoctorResponse> searchDoctorByName(
            @RequestParam String name) {

        return doctorService.searchDoctorByName(name);
    }

    // ==========================
    // Search Doctor By Specialization
    // ==========================
    @GetMapping("/search/specialization")
    @PreAuthorize("hasRole('ADMIN')")
    public List<DoctorResponse> searchDoctorBySpecialization(
            @RequestParam String specialization) {

        return doctorService.searchDoctorBySpecialization(specialization);
    }

    // ==========================
    // Pagination
    // ==========================
    @GetMapping("/page")
    @PreAuthorize("hasRole('ADMIN')")
    public Page<DoctorResponse> getDoctorsWithPagination(

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "5") int size,

            @RequestParam(defaultValue = "doctorName") String sortBy,

            @RequestParam(defaultValue = "asc") String direction) {

        return doctorService.getDoctorsWithPagination(
                page,
                size,
                sortBy,
                direction
        );
    }
    @GetMapping("/available")
    @PreAuthorize("hasRole('PATIENT')")
    public List<DoctorResponse> getAvailableDoctors() {

        System.out.println("Available Doctors API Called");

        return doctorService.getAvailableDoctors();
    }
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('DOCTOR')")
    public DoctorDashboardResponse getDoctorDashboard(
            Authentication authentication) {

        return appointmentService.getDoctorDashboard(
                authentication.getName());
    }
    @PutMapping("/change-password")
    @PreAuthorize("hasRole('DOCTOR')")
    public String changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request) {

        return doctorService.changePassword(
                authentication.getName(),
                request);
    }
    @PutMapping("/profile")
    @PreAuthorize("hasRole('DOCTOR')")
    public DoctorResponse updateProfile(
            Authentication authentication,
            @Valid @RequestBody DoctorProfileUpdateRequest request) {

        return doctorService.updateProfile(
                authentication.getName(),
                request);
    }
}