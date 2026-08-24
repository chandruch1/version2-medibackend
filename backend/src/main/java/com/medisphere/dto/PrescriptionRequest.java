package com.medisphere.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescriptionRequest {

    @NotNull
    private Long appointmentId;

    @NotBlank
    private String medicine;

    @NotBlank
    private String dosage;

    @NotBlank
    private String duration;

    private String notes;
}