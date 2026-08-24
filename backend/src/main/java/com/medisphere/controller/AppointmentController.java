package com.medisphere.controller;

import com.medisphere.dto.AppointmentRequest;
import com.medisphere.dto.AppointmentResponse;
import com.medisphere.dto.DoctorDashboardResponse;
import com.medisphere.dto.PatientAppointmentRequest;
import com.medisphere.dto.PatientDashboardResponse;
import com.medisphere.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    // ==========================
    // ADMIN
    // ==========================

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public AppointmentResponse bookAppointment(
            @Valid @RequestBody AppointmentRequest request) {

        return appointmentService.bookAppointment(request);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<AppointmentResponse> getAllAppointments() {

        return appointmentService.getAllAppointments();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public AppointmentResponse getAppointmentById(
            @PathVariable Long id) {

        return appointmentService.getAppointmentById(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'PATIENT')")
    public AppointmentResponse updateAppointment(
            @PathVariable Long id,
            @Valid @RequestBody AppointmentRequest request) {

        return appointmentService.updateAppointment(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PATIENT')")
    public String deleteAppointment(
            @PathVariable Long id) {

        appointmentService.deleteAppointment(id);

        return "Appointment deleted successfully.";
    }

    @GetMapping("/search/date")
    @PreAuthorize("hasRole('ADMIN')")
    public List<AppointmentResponse> searchByDate(
            @RequestParam LocalDate date) {

        return appointmentService.searchByDate(date);
    }

    @GetMapping("/search/doctor")
    @PreAuthorize("hasRole('ADMIN')")
    public List<AppointmentResponse> searchByDoctor(
            @RequestParam String doctorName) {

        return appointmentService.searchByDoctor(doctorName);
    }

    @GetMapping("/search/patient")
    @PreAuthorize("hasRole('ADMIN')")
    public List<AppointmentResponse> searchByPatient(
            @RequestParam String patientName) {

        return appointmentService.searchByPatient(patientName);
    }

    @GetMapping("/page")
    @PreAuthorize("hasRole('ADMIN')")
    public Page<AppointmentResponse> getAppointmentsWithPagination(

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "5") int size,

            @RequestParam(defaultValue = "appointmentDate") String sortBy,

            @RequestParam(defaultValue = "asc") String direction) {

        return appointmentService.getAppointmentsWithPagination(
                page,
                size,
                sortBy,
                direction);
    }

    @PutMapping("/{id}/complete")
    @PreAuthorize("hasRole('ADMIN')")
    public AppointmentResponse completeAppointment(
            @PathVariable Long id) {

        return appointmentService.completeAppointment(id);
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasRole('ADMIN')")
    public AppointmentResponse cancelAppointment(
            @PathVariable Long id) {

        return appointmentService.cancelAppointment(id);
    }

    // ==========================
    // DOCTOR
    // ==========================

    @GetMapping("/my")
    @PreAuthorize("hasRole('DOCTOR')")
    public List<AppointmentResponse> getMyAppointments(
            Authentication authentication) {

        return appointmentService.getMyAppointments(authentication.getName());
    }

    @GetMapping("/my/search")
    @PreAuthorize("hasRole('DOCTOR')")
    public List<AppointmentResponse> searchMyAppointments(
            Authentication authentication,
            @RequestParam String keyword) {

        return appointmentService.searchMyAppointments(authentication.getName(), keyword);
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('DOCTOR')")
    public AppointmentResponse approveAppointment(
            @PathVariable Long id) {

        return appointmentService.approveAppointment(id);
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('DOCTOR')")
    public AppointmentResponse rejectAppointment(
            @PathVariable Long id) {

        return appointmentService.rejectAppointment(id);
    }

    // ==========================
    // PATIENT
    // ==========================

    @PostMapping("/book")
    @PreAuthorize("hasRole('PATIENT')")
    public AppointmentResponse patientBookAppointment(

            Authentication authentication,

            @Valid @RequestBody PatientAppointmentRequest request) {

        return appointmentService.bookAppointmentByPatient(
                authentication.getName(),
                request);
    }

    @GetMapping("/doctor/dashboard")
    @PreAuthorize("hasRole('DOCTOR')")
    public DoctorDashboardResponse getDoctorDashboard(
            Authentication authentication) {

        return appointmentService.getDoctorDashboard(
                authentication.getName());
    }

    @GetMapping("/patient/dashboard")
    @PreAuthorize("hasRole('PATIENT')")
    public PatientDashboardResponse getPatientDashboard(
            Authentication authentication) {

        return appointmentService.getPatientDashboard(
                authentication.getName());
    }
}