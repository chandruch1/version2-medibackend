package com.medisphere.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalHistoryResponse {

    private Long id;

    private Long patientId;

    private String patientName;

    private String height;

    private String weight;

    private String bloodPressure;

    private String heartRate;

    private String bloodGroup;

    private String allergies;

    private String previousDiseases;

    private String surgeries;

    private String familyHistory;

    private String currentMedication;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
