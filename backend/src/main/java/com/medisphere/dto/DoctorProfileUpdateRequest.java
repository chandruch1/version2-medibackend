package com.medisphere.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorProfileUpdateRequest {

    @NotBlank
    private String phone;

    @NotBlank
    private String qualification;

    @NotNull
    private Integer experience;

    @NotNull
    @Positive
    private Double consultationFee;

    @NotBlank
    private String availableDays;

    @NotBlank
    private String availableTime;
}