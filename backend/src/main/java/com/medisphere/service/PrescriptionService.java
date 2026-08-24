package com.medisphere.service;

import com.medisphere.dto.PrescriptionRequest;
import com.medisphere.dto.PrescriptionResponse;
import com.medisphere.entity.Appointment;
import com.medisphere.entity.AppointmentStatus;
import com.medisphere.entity.Prescription;
import com.medisphere.exception.ResourceNotFoundException;
import com.medisphere.repository.AppointmentRepository;
import com.medisphere.repository.PrescriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final AppointmentRepository appointmentRepository;
    private final MailService mailService;
    private final NotificationService notificationService;
    private static final Logger logger =
            LoggerFactory.getLogger(PrescriptionService.class);

    // ==========================
    // Add Prescription
    // ==========================
    public PrescriptionResponse addPrescription(PrescriptionRequest request) {

        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Appointment not found"));

        if (appointment.getStatus() != AppointmentStatus.APPROVED &&
                appointment.getStatus() != AppointmentStatus.COMPLETED) {

            throw new RuntimeException(
                    "Prescription can only be added for approved or completed appointments");
        }

        prescriptionRepository.findByAppointment_Id(request.getAppointmentId())
                .ifPresent(p -> {
                    throw new RuntimeException(
                            "Prescription already exists for this appointment");
                });

        Prescription prescription = Prescription.builder()
                .appointment(appointment)
                .medicine(request.getMedicine())
                .dosage(request.getDosage())
                .duration(request.getDuration())
                .notes(request.getNotes())
                .build();

        Prescription saved = prescriptionRepository.save(prescription);

        // Notification
        notificationService.createNotification(
                "Prescription Added",
                "Dr. " + appointment.getDoctor().getDoctorName() +
                        " has added a prescription: " + saved.getMedicine() + ".",
                "PATIENT", appointment.getPatient().getId()
        );

// Send prescription email to patient
        try {
            mailService.sendPrescriptionEmail(
                    appointment.getPatient().getEmail(),
                    appointment.getPatient().getPatientName(),
                    appointment.getDoctor().getDoctorName(),
                    saved.getMedicine(),
                    saved.getDosage(),
                    saved.getDuration(),
                    saved.getNotes()
            );
        } catch (Exception e) {
            logger.error("Failed to send prescription email", e);
        }

        return mapToResponse(saved);
    }

    // ==========================
    // Get All Prescriptions
    // ==========================
    public List<PrescriptionResponse> getAllPrescriptions() {

        return prescriptionRepository.findAllByOrderByIdDesc()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ==========================
    // Get Prescription By Id
    // ==========================
    public PrescriptionResponse getPrescription(Long id) {

        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Prescription not found"));

        return mapToResponse(prescription);
    }

    // ==========================
    // Patient Prescriptions
    // ==========================
    public List<PrescriptionResponse> getMyPrescriptions(String email) {

        return prescriptionRepository
                .findByAppointment_Patient_Email(email)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ==========================
    // Update Prescription
    // ==========================
    public PrescriptionResponse updatePrescription(
            Long id,
            PrescriptionRequest request) {

        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Prescription not found"));

        prescription.setMedicine(request.getMedicine());
        prescription.setDosage(request.getDosage());
        prescription.setDuration(request.getDuration());
        prescription.setNotes(request.getNotes());

        return mapToResponse(
                prescriptionRepository.save(prescription));
    }

    // ==========================
    // Delete Prescription
    // ==========================
    public void deletePrescription(Long id) {

        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Prescription not found"));

        prescriptionRepository.delete(prescription);
    }

    // ==========================
    // Entity -> DTO
    // ==========================
    private PrescriptionResponse mapToResponse(
            Prescription prescription) {

        return PrescriptionResponse.builder()
                .id(prescription.getId())
                .appointmentId(
                        prescription.getAppointment().getId())
                .doctorName(
                        prescription.getAppointment()
                                .getDoctor()
                                .getDoctorName())
                .patientName(
                        prescription.getAppointment()
                                .getPatient()
                                .getPatientName())
                .medicine(prescription.getMedicine())
                .dosage(prescription.getDosage())
                .duration(prescription.getDuration())
                .notes(prescription.getNotes())
                .build();
    }

    // ==========================
    // Patient: Search Prescriptions
    // ==========================
    public List<PrescriptionResponse> searchMyPrescriptions(String email, String keyword) {

        List<com.medisphere.entity.Prescription> byMedicine = prescriptionRepository
                .findByAppointment_Patient_EmailAndMedicineContainingIgnoreCase(email, keyword);

        List<com.medisphere.entity.Prescription> byDoctor = prescriptionRepository
                .findByAppointment_Patient_EmailAndAppointment_Doctor_DoctorNameContainingIgnoreCase(email, keyword);

        return java.util.stream.Stream.concat(byMedicine.stream(), byDoctor.stream())
                .distinct()
                .map(this::mapToResponse)
                .toList();
    }
}