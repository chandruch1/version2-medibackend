package com.medisphere.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedbackResponse {

    private Long id;

    private Long appointmentId;

    private Long doctorId;

    private String doctorName;

    private Long patientId;

    private String patientName;

    private Integer rating;

    private String review;

    private LocalDateTime createdAt;
}
