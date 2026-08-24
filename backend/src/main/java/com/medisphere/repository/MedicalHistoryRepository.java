package com.medisphere.repository;

import com.medisphere.entity.MedicalHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MedicalHistoryRepository extends JpaRepository<MedicalHistory, Long> {

    Optional<MedicalHistory> findByPatient_Email(String email);

    Optional<MedicalHistory> findByPatient_Id(Long patientId);
}
