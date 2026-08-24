package com.medisphere.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "medical_histories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "patient_id", nullable = false, unique = true)
    private Patient patient;

    private String height;

    private String weight;

    private String bloodPressure;

    private String heartRate;

    private String bloodGroup;

    @Column(length = 1000)
    private String allergies;

    @Column(length = 1000)
    private String previousDiseases;

    @Column(length = 1000)
    private String surgeries;

    @Column(length = 1000)
    private String familyHistory;

    @Column(length = 1000)
    private String currentMedication;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
