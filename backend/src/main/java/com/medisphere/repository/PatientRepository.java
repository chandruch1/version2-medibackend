package com.medisphere.repository;

import com.medisphere.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    Optional<Patient> findByEmail(String email);

    Optional<Patient> findByPhone(String phone);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    List<Patient> findByPatientNameContainingIgnoreCase(String patientName);

    List<Patient> findByDiseaseContainingIgnoreCase(String disease);



}