package com.medisphere.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "doctors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "doctor_name", nullable = false)
    private String doctorName;

    @Column(nullable = false)
    private String specialization;

    @Column(nullable = false)
    private String qualification;

    @Column(nullable = false)
    private Integer experience;

    @Column(nullable = false, unique = true, length = 10)
    private String phone;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "consultation_fee", nullable = false)
    private Double consultationFee;

    @Column(name = "available_days", nullable = false)
    private String availableDays;

    @Column(name = "available_time", nullable = false)
    private String availableTime;

    @Column(nullable = false)
    private Boolean status;

    @Column(nullable = false)
    private LocalDate dob;

    @Column(nullable = false)
    private String password;
}