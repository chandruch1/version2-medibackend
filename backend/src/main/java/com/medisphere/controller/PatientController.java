package com.medisphere.controller;

import com.medisphere.dto.*;
import com.medisphere.service.AppointmentService;
import com.medisphere.service.PatientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import com.medisphere.dto.AppointmentResponse;

import java.util.List;



@RestController
@RequestMapping("/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;
    private final AppointmentService appointmentService;

    // Add Patient
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public PatientResponse addPatient(
            @Valid @RequestBody PatientRequest request) {

        return patientService.addPatient(request);
    }

    // Get All Patients
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<PatientResponse> getAllPatients() {

        return patientService.getAllPatients();
    }

    // Get Patient By Id
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public PatientResponse getPatientById(
            @PathVariable Long id) {

        return patientService.getPatientById(id);
    }

    // Update Patient
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public PatientResponse updatePatient(
            @PathVariable Long id,
            @Valid @RequestBody PatientRequest request) {

        return patientService.updatePatient(id, request);
    }

    // Delete Patient
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deletePatient(
            @PathVariable Long id) {

        patientService.deletePatient(id);

        return "Patient deleted successfully.";
    }

    @GetMapping("/search/name")
    @PreAuthorize("hasRole('ADMIN')")
    public List<PatientResponse> searchPatientByName(
            @RequestParam String name) {

        return patientService.searchPatientByName(name);
    }

    @GetMapping("/search/disease")
    @PreAuthorize("hasRole('ADMIN')")
    public List<PatientResponse> searchPatientByDisease(
            @RequestParam String disease) {

        return patientService.searchPatientByDisease(disease);
    }

    @GetMapping("/page")
    @PreAuthorize("hasRole('ADMIN')")
    public Page<PatientResponse> getPatientsWithPagination(

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "5") int size,

            @RequestParam(defaultValue = "patientName") String sortBy,

            @RequestParam(defaultValue = "asc") String direction) {

        return patientService.getPatientsWithPagination(
                page,
                size,
                sortBy,
                direction
        );
    }

    @PostMapping("/register")
    public String register(
            @Valid @RequestBody PatientRegisterRequest request) {

        return patientService.register(request);
    }

    @PostMapping("/login")
    public PatientLoginResponse login(
            @Valid @RequestBody PatientLoginRequest request) {

        return patientService.login(request);
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('PATIENT')")
    public PatientResponse getProfile(Authentication authentication) {

        return patientService.getProfile(authentication.getName());
    }

    @GetMapping("/appointments")
    @PreAuthorize("hasRole('PATIENT')")
    public List<AppointmentResponse> getMyAppointments(
            Authentication authentication) {

        return appointmentService.getMyAppointmentsPatient(
                authentication.getName());
    }
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('PATIENT')")
    public PatientDashboardResponse getDashboard(
            Authentication authentication) {

        return appointmentService.getPatientDashboard(
                authentication.getName());
    }
    @PutMapping("/change-password")
    @PreAuthorize("hasRole('PATIENT')")
    public String changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request) {

        return patientService.changePassword(
                authentication.getName(),
                request);
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('PATIENT')")
    public PatientResponse updateProfile(
            Authentication authentication,
            @Valid @RequestBody PatientProfileUpdateRequest request) {

        return patientService.updateProfile(
                authentication.getName(),
                request);
    }
    @PostMapping("/forgot-password")
    public String forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {

        return patientService.forgotPassword(request);
    }

    @PostMapping("/verify-otp")
    public String verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request) {

        return patientService.verifyOtp(request);
    }

    @PostMapping("/reset-password")
    public String resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        return patientService.resetPassword(request);
    }

}