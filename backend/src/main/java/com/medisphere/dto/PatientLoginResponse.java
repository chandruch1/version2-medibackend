package com.medisphere.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientLoginResponse {

    private String token;
    private String patientName;
    private String email;
    private String role;
}