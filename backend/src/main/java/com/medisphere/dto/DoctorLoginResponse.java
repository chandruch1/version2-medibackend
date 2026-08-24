package com.medisphere.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorLoginResponse {

    private String token;
    private String doctorName;
    private String email;
    private String specialization;
    private String role;
}