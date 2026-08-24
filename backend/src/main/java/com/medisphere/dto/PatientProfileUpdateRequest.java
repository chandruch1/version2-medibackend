package com.medisphere.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientProfileUpdateRequest {

    @NotBlank
    private String phone;

    @NotBlank
    private String address;

    @NotBlank
    private String bloodGroup;

    @NotBlank
    private String disease;
}