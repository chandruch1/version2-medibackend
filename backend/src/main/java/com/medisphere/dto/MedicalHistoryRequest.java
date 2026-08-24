package com.medisphere.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalHistoryRequest {

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
}
