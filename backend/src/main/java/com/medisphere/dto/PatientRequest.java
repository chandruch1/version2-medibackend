package com.medisphere.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientRequest {

    @NotBlank(message = "Patient name is required")
    private String patientName;

    @NotNull(message = "Age is required")
    @Positive(message = "Age must be greater than 0")
    private Integer age;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be 10 digits")
    private String phone;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "Blood group is required")
    private String bloodGroup;

    @NotBlank(message = "Disease is required")
    private String disease;

    @NotNull(message = "Status is required")
    private Boolean status;

    @NotNull(message = "Date of Birth is required")
    private LocalDate dob;
}