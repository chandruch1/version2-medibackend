package com.medisphere.repository;

import com.medisphere.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    List<Feedback> findByPatient_EmailOrderByCreatedAtDesc(String email);

    List<Feedback> findByDoctor_EmailOrderByCreatedAtDesc(String email);

    List<Feedback> findAllByOrderByCreatedAtDesc();

    Optional<Feedback> findByAppointment_Id(Long appointmentId);

    @Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.doctor.id = :doctorId")
    Double findAverageRatingByDoctorId(Long doctorId);

    long countByDoctor_Id(Long doctorId);

    @Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.doctor.email = :email")
    Double findAverageRatingByDoctorEmail(String email);

    long countByDoctor_Email(String email);
}
