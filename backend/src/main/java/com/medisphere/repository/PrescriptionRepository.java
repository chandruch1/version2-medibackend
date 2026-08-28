package com.medisphere.repository;

import com.medisphere.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {

    Optional<Prescription> findByAppointment_Id(Long appointmentId);

    List<Prescription> findByAppointment_Patient_Email(String email);

    List<Prescription> findAllByOrderByIdDesc();

    long countByAppointment_Patient_Email(String email);

    // Doctor: Get all prescriptions written by a specific doctor
    List<Prescription> findByAppointment_Doctor_Email(String email);

    // Patient: Search prescriptions by medicine name
    List<Prescription> findByAppointment_Patient_EmailAndMedicineContainingIgnoreCase(
            String email, String medicine);

    // Patient: Search prescriptions by doctor name
    List<Prescription> findByAppointment_Patient_EmailAndAppointment_Doctor_DoctorNameContainingIgnoreCase(
            String email, String doctorName);
}