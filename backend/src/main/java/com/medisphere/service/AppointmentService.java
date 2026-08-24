package com.medisphere.service;

import com.medisphere.dto.AppointmentRequest;
import com.medisphere.dto.AppointmentResponse;
import com.medisphere.dto.DoctorDashboardResponse;
import com.medisphere.dto.PatientAppointmentRequest;
import com.medisphere.entity.*;
import com.medisphere.exception.ResourceNotFoundException;
import com.medisphere.repository.AppointmentRepository;
import com.medisphere.repository.DoctorRepository;
import com.medisphere.repository.PatientRepository;
import com.medisphere.repository.PrescriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import com.medisphere.dto.PatientDashboardResponse;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

import java.time.DayOfWeek;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final MailService mailService;
    private final DoctorLeaveService doctorLeaveService;
    private final NotificationService notificationService;
    private final FeedbackService feedbackService;

    // Book Appointment
    public AppointmentResponse bookAppointment(AppointmentRequest request) {

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Doctor not found"));

        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Patient not found"));

        Appointment appointment = Appointment.builder()
                .doctor(doctor)
                .patient(patient)
                .appointmentDate(request.getAppointmentDate())
                .appointmentTime(request.getAppointmentTime())
                .reason(request.getReason())
                .status(AppointmentStatus.PENDING)
                .build();

        Appointment savedAppointment = appointmentRepository.save(appointment);

        return mapToResponse(savedAppointment);
    }

    // Get All Appointments
    public List<AppointmentResponse> getAllAppointments() {

        return appointmentRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get Appointment By Id
    public AppointmentResponse getAppointmentById(Long id) {

        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Appointment not found"));

        return mapToResponse(appointment);
    }

    // Update Appointment
    public AppointmentResponse updateAppointment(Long id,
                                                 AppointmentRequest request) {

        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Appointment not found"));

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Doctor not found"));

        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Patient not found"));

        appointment.setDoctor(doctor);
        appointment.setPatient(patient);
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setAppointmentTime(request.getAppointmentTime());
        appointment.setReason(request.getReason());

        Appointment updatedAppointment =
                appointmentRepository.save(appointment);

        return mapToResponse(updatedAppointment);
    }

    // Cancel Appointment
    public void deleteAppointment(Long id) {

        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Appointment not found"));

        prescriptionRepository.findByAppointment_Id(id)
                .ifPresent(prescriptionRepository::delete);

        appointmentRepository.delete(appointment);
    }

    // Entity -> Response DTO
    private AppointmentResponse mapToResponse(Appointment appointment) {

        return AppointmentResponse.builder()
                .id(appointment.getId())
                .doctorId(appointment.getDoctor().getId())
                .doctorName(appointment.getDoctor().getDoctorName())
                .patientId(appointment.getPatient().getId())
                .patientName(appointment.getPatient().getPatientName())
                .appointmentDate(appointment.getAppointmentDate())
                .appointmentTime(appointment.getAppointmentTime())
                .reason(appointment.getReason())
                .status(appointment.getStatus())
                .build();
    }

    public List<AppointmentResponse> searchByDate(LocalDate date) {

        return appointmentRepository.findByAppointmentDate(date)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<AppointmentResponse> searchByDoctor(String doctorName) {

        return appointmentRepository
                .findByDoctor_DoctorNameContainingIgnoreCase(doctorName)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<AppointmentResponse> searchByPatient(String patientName) {

        return appointmentRepository
                .findByPatient_PatientNameContainingIgnoreCase(patientName)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public Page<AppointmentResponse> getAppointmentsWithPagination(
            int page,
            int size,
            String sortBy,
            String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return appointmentRepository.findAll(pageable)
                .map(this::mapToResponse);
    }
    public AppointmentResponse completeAppointment(Long id) {

        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Appointment not found"));

        appointment.setStatus(AppointmentStatus.COMPLETED);

        Appointment updatedAppointment =
                appointmentRepository.save(appointment);

        return mapToResponse(updatedAppointment);
    }

    public AppointmentResponse cancelAppointment(Long id) {

        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Appointment not found"));

        appointment.setStatus(AppointmentStatus.CANCELLED);

        Appointment updatedAppointment =
                appointmentRepository.save(appointment);

        return mapToResponse(updatedAppointment);
    }

    public List<AppointmentResponse> getMyAppointments(String email) {

        return appointmentRepository.findByDoctor_Email(email)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }
    // Approve Appointment
    public AppointmentResponse approveAppointment(Long id) {

        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Appointment not found"));

        appointment.setStatus(AppointmentStatus.APPROVED);

        Appointment updatedAppointment =
                appointmentRepository.save(appointment);

        // Notification
        notificationService.createNotification(
                "Appointment Approved",
                "Your appointment with Dr. " + appointment.getDoctor().getDoctorName() +
                        " on " + appointment.getAppointmentDate() + " has been approved.",
                "PATIENT", appointment.getPatient().getId()
        );

// Send Email
        try {
            mailService.sendAppointmentApprovedEmail(
                    appointment.getPatient().getEmail(),
                    appointment.getPatient().getPatientName(),
                    appointment.getDoctor().getDoctorName(),
                    appointment.getAppointmentDate().toString(),
                    appointment.getAppointmentTime().toString()
            );
        } catch (Exception e) {
            System.err.println("Failed to send appointment approved email: " + e.getMessage());
        }

        return mapToResponse(updatedAppointment);
    }

    // Reject Appointment
    public AppointmentResponse rejectAppointment(Long id) {

        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Appointment not found"));

        appointment.setStatus(AppointmentStatus.REJECTED);

        Appointment updatedAppointment =
                appointmentRepository.save(appointment);

        // Notification
        notificationService.createNotification(
                "Appointment Rejected",
                "Your appointment with Dr. " + appointment.getDoctor().getDoctorName() +
                        " on " + appointment.getAppointmentDate() + " has been rejected.",
                "PATIENT", appointment.getPatient().getId()
        );

// Send Email
        try {
            mailService.sendAppointmentRejectedEmail(
                    appointment.getPatient().getEmail(),
                    appointment.getPatient().getPatientName(),
                    appointment.getDoctor().getDoctorName()
            );
        } catch (Exception e) {
            System.err.println("Failed to send appointment rejected email: " + e.getMessage());
        }

        return mapToResponse(updatedAppointment);
    }
    public AppointmentResponse bookAppointmentByPatient(
            String email,
            PatientAppointmentRequest request) {

        Patient patient = patientRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Patient not found"));

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Doctor not found"));

        if (!doctor.getStatus()) {
            throw new RuntimeException("Doctor is currently unavailable");
        }

        if (request.getAppointmentDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("Appointment date cannot be in the past");
        }

        // ── Doctor Leave Check ───────────────────────────────────────────
        if (doctorLeaveService.isDoctorOnLeave(doctor.getId(), request.getAppointmentDate())) {
            throw new RuntimeException(
                    "Doctor is unavailable on the selected date (on approved leave)");
        }

        DayOfWeek day = request.getAppointmentDate().getDayOfWeek();

        String dayName = day.name().substring(0,1)
                + day.name().substring(1).toLowerCase().substring(0,2);

        if (doctor.getAvailableDays().equalsIgnoreCase("Mon-Fri")) {

            if(day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY){
                throw new RuntimeException(
                        "Doctor is not available on " + dayName);
            }
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");

        String[] timeRange = doctor.getAvailableTime().split("-");

        LocalTime startTime = LocalTime.parse(timeRange[0].trim(), formatter);
        LocalTime endTime = LocalTime.parse(timeRange[1].trim(), formatter);

        LocalTime appointmentTime = request.getAppointmentTime();

        if (appointmentTime.isBefore(startTime) || appointmentTime.isAfter(endTime)) {
            throw new RuntimeException("Doctor is not available at this time");
        }

        if (appointmentRepository.existsByDoctor_IdAndAppointmentDateAndAppointmentTime(
                doctor.getId(),
                request.getAppointmentDate(),
                request.getAppointmentTime())) {

            throw new RuntimeException(
                    "Doctor already has an appointment at this date and time");
        }

        Appointment appointment = Appointment.builder()
                .doctor(doctor)
                .patient(patient)
                .appointmentDate(request.getAppointmentDate())
                .appointmentTime(request.getAppointmentTime())
                .reason(request.getReason())
                .status(AppointmentStatus.PENDING)
                .build();

        Appointment saved = appointmentRepository.save(appointment);

        // ── Notification ─────────────────────────────────────────────────
        notificationService.createNotification(
                "Appointment Booked",
                "Your appointment with Dr. " + doctor.getDoctorName() + " on " +
                        saved.getAppointmentDate() + " has been booked and is pending approval.",
                "PATIENT", patient.getId()
        );
        notificationService.createNotification(
                "New Appointment Request",
                "Patient " + patient.getPatientName() + " has booked an appointment on " +
                        saved.getAppointmentDate() + " at " + saved.getAppointmentTime() + ".",
                "DOCTOR", doctor.getId()
        );

// Send Email
        try {
            mailService.sendAppointmentBookedEmail(
                    patient.getEmail(),
                    patient.getPatientName(),
                    doctor.getDoctorName(),
                    saved.getAppointmentDate().toString(),
                    saved.getAppointmentTime().toString()
            );
        } catch (Exception e) {
            System.err.println("Failed to send appointment booked email: " + e.getMessage());
        }

        return mapToResponse(saved);
    }
    public List<AppointmentResponse> getMyAppointmentsPatient(String email) {

        return appointmentRepository.findByPatient_Email(email)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public DoctorDashboardResponse getDoctorDashboard(String email) {

        return DoctorDashboardResponse.builder()
                .totalAppointments(
                        appointmentRepository.countByDoctor_Email(email))
                .pendingAppointments(
                        appointmentRepository.countByDoctor_EmailAndStatus(
                                email, AppointmentStatus.PENDING))
                .approvedAppointments(
                        appointmentRepository.countByDoctor_EmailAndStatus(
                                email, AppointmentStatus.APPROVED))
                .completedAppointments(
                        appointmentRepository.countByDoctor_EmailAndStatus(
                                email, AppointmentStatus.COMPLETED))
                .rejectedAppointments(
                        appointmentRepository.countByDoctor_EmailAndStatus(
                                email, AppointmentStatus.REJECTED))
                .todayAppointments(
                        appointmentRepository.countByDoctor_EmailAndAppointmentDate(
                                email, LocalDate.now()))
                .averageRating(feedbackService.getAverageRating(email))
                .totalReviews(feedbackService.getTotalReviews(email))
                .build();
    }
    public PatientDashboardResponse getPatientDashboard(String email) {

        Patient patient = patientRepository.findByEmail(email).orElse(null);
        long unread = 0;
        long prescriptions = prescriptionRepository.countByAppointment_Patient_Email(email);
        if (patient != null) {
            unread = notificationService.getUnreadCount(patient.getId(), "PATIENT");
        }

        return PatientDashboardResponse.builder()
                .totalAppointments(
                        appointmentRepository.countByPatient_Email(email))
                .pendingAppointments(
                        appointmentRepository.countByPatient_EmailAndStatus(
                                email, AppointmentStatus.PENDING))
                .approvedAppointments(
                        appointmentRepository.countByPatient_EmailAndStatus(
                                email, AppointmentStatus.APPROVED))
                .completedAppointments(
                        appointmentRepository.countByPatient_EmailAndStatus(
                                email, AppointmentStatus.COMPLETED))
                .cancelledAppointments(
                        appointmentRepository.countByPatient_EmailAndStatus(
                                email, AppointmentStatus.CANCELLED))
                .totalPrescriptions(prescriptions)
                .unreadNotifications(unread)
                .build();
    }

    // ==========================
    // Doctor: Search Own Appointments
    // ==========================
    public List<AppointmentResponse> searchMyAppointments(String email, String keyword) {

        List<Appointment> byPatient = appointmentRepository
                .findByDoctor_EmailAndPatient_PatientNameContainingIgnoreCase(email, keyword);

        List<Appointment> byReason = appointmentRepository
                .findByDoctor_EmailAndReasonContainingIgnoreCase(email, keyword);

        return java.util.stream.Stream.concat(byPatient.stream(), byReason.stream())
                .distinct()
                .map(this::mapToResponse)
                .toList();
    }
}
