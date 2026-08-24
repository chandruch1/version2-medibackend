package com.medisphere.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorRequest {

    @NotBlank(message = "Doctor name is required")
    private String doctorName;

    @NotBlank(message = "Specialization is required")
    private String specialization;

    @NotBlank(message = "Qualification is required")
    private String qualification;

    @NotNull(message = "Experience is required")
    @Positive(message = "Experience must be greater than 0")
    private Integer experience;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be 10 digits")
    private String phone;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotNull(message = "Consultation fee is required")
    @Positive(message = "Consultation fee must be greater than 0")
    private Double consultationFee;

    @NotBlank(message = "Available days are required")
    private String availableDays;

    @NotBlank(message = "Available time is required")
    private String availableTime;

    @NotNull(message = "Status is required")
    private Boolean status;

    @NotNull(message = "Date of Birth is required")
    private LocalDate dob;
}