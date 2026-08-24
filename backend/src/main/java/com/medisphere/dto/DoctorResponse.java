package com.medisphere.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorResponse {

    private Long id;

    private String doctorName;

    private String specialization;

    private String qualification;

    private Integer experience;

    private String phone;

    private String email;

    private Double consultationFee;

    private String availableDays;

    private String availableTime;

    private Boolean status;

    private LocalDate dob;
}