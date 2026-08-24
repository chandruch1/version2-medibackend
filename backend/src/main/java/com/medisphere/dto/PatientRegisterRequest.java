package com.medisphere.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientRegisterRequest {

    @NotBlank
    private String patientName;

    @NotNull
    private Integer age;

    @NotBlank
    private String gender;

    @NotBlank
    @Pattern(regexp = "^[0-9]{10}$")
    private String phone;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;

    @NotBlank
    private String address;

    @NotBlank
    private String bloodGroup;

    @NotBlank
    private String disease;

    @NotNull(message = "Date of Birth is required")
    private LocalDate dob;
}