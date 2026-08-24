package com.medisphere.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescriptionResponse {

    private Long id;

    private Long appointmentId;

    private String doctorName;

    private String patientName;

    private String medicine;

    private String dosage;

    private String duration;

    private String notes;
}