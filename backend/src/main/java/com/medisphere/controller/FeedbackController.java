package com.medisphere.controller;

import com.medisphere.dto.FeedbackRequest;
import com.medisphere.dto.FeedbackResponse;
import com.medisphere.service.FeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    // ==========================
    // PATIENT
    // ==========================

    @PostMapping
    @PreAuthorize("hasRole('PATIENT')")
    public FeedbackResponse submitFeedback(
            Authentication authentication,
            @Valid @RequestBody FeedbackRequest request) {

        return feedbackService.submitFeedback(authentication.getName(), request);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('PATIENT')")
    public List<FeedbackResponse> getMyFeedbacks(Authentication authentication) {

        return feedbackService.getMyFeedbacks(authentication.getName());
    }

    // ==========================
    // DOCTOR
    // ==========================

    @GetMapping("/doctor")
    @PreAuthorize("hasRole('DOCTOR')")
    public List<FeedbackResponse> getDoctorFeedbacks(Authentication authentication) {

        return feedbackService.getDoctorFeedbacks(authentication.getName());
    }

    // ==========================
    // ADMIN
    // ==========================

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<FeedbackResponse> getAllFeedbacks() {

        return feedbackService.getAllFeedbacks();
    }
}
