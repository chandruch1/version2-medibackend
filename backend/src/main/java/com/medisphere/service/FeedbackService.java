package com.medisphere.service;

import com.medisphere.dto.FeedbackRequest;
import com.medisphere.dto.FeedbackResponse;
import com.medisphere.entity.Appointment;
import com.medisphere.entity.AppointmentStatus;
import com.medisphere.entity.Feedback;
import com.medisphere.exception.ResourceNotFoundException;
import com.medisphere.repository.AppointmentRepository;
import com.medisphere.repository.FeedbackRepository;
import com.medisphere.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;

    // ==========================
    // Patient: Submit Feedback
    // ==========================
    public FeedbackResponse submitFeedback(String email, FeedbackRequest request) {

        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        // Validate appointment is COMPLETED
        if (appointment.getStatus() != AppointmentStatus.COMPLETED) {
            throw new RuntimeException("Feedback can only be submitted for COMPLETED appointments");
        }

        // Validate patient owns this appointment
        if (!appointment.getPatient().getEmail().equals(email)) {
            throw new RuntimeException("You are not authorized to submit feedback for this appointment");
        }

        // Check if feedback already exists
        feedbackRepository.findByAppointment_Id(request.getAppointmentId())
                .ifPresent(f -> {
                    throw new RuntimeException("Feedback already submitted for this appointment");
                });

        Feedback feedback = Feedback.builder()
                .appointment(appointment)
                .doctor(appointment.getDoctor())
                .patient(appointment.getPatient())
                .rating(request.getRating())
                .review(request.getReview())
                .build();

        return mapToResponse(feedbackRepository.save(feedback));
    }

    // ==========================
    // Patient: Get My Feedbacks
    // ==========================
    public List<FeedbackResponse> getMyFeedbacks(String email) {

        return feedbackRepository.findByPatient_EmailOrderByCreatedAtDesc(email)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ==========================
    // Doctor: View Own Feedback
    // ==========================
    public List<FeedbackResponse> getDoctorFeedbacks(String email) {

        return feedbackRepository.findByDoctor_EmailOrderByCreatedAtDesc(email)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ==========================
    // Admin: View All Feedback
    // ==========================
    public List<FeedbackResponse> getAllFeedbacks() {

        return feedbackRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ==========================
    // Doctor Dashboard: Average Rating
    // ==========================
    public Double getAverageRating(String email) {
        Double avg = feedbackRepository.findAverageRatingByDoctorEmail(email);
        return avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0;
    }

    // ==========================
    // Doctor Dashboard: Total Reviews
    // ==========================
    public long getTotalReviews(String email) {
        return feedbackRepository.countByDoctor_Email(email);
    }

    // ==========================
    // Entity -> DTO
    // ==========================
    private FeedbackResponse mapToResponse(Feedback f) {

        return FeedbackResponse.builder()
                .id(f.getId())
                .appointmentId(f.getAppointment().getId())
                .doctorId(f.getDoctor().getId())
                .doctorName(f.getDoctor().getDoctorName())
                .patientId(f.getPatient().getId())
                .patientName(f.getPatient().getPatientName())
                .rating(f.getRating())
                .review(f.getReview())
                .createdAt(f.getCreatedAt())
                .build();
    }
}
