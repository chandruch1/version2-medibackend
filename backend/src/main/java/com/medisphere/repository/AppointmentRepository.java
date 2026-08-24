package com.medisphere.repository;

import com.medisphere.entity.Appointment;
import com.medisphere.entity.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    long countByStatus(AppointmentStatus status);

    List<Appointment> findByAppointmentDate(LocalDate appointmentDate);

    List<Appointment> findByDoctor_DoctorNameContainingIgnoreCase(String doctorName);

    List<Appointment> findByPatient_PatientNameContainingIgnoreCase(String patientName);

    List<Appointment> findByDoctor_Email(String email);

    List<Appointment> findByDoctor_EmailAndStatus(String email, AppointmentStatus status);

    List<Appointment> findByPatient_Email(String email);

    boolean existsByDoctor_IdAndAppointmentDateAndAppointmentTime(
            Long doctorId,
            LocalDate appointmentDate,
            LocalTime appointmentTime);

    long countByDoctor_Email(String email);

    long countByDoctor_EmailAndStatus(String email, AppointmentStatus status);

    long countByPatient_Email(String email);

    long countByPatient_EmailAndStatus(String email, AppointmentStatus status);

    long countByDoctor_EmailAndAppointmentDate(String email, LocalDate date);

    // Doctor: Search own appointments by patient name or reason
    List<Appointment> findByDoctor_EmailAndPatient_PatientNameContainingIgnoreCase(
            String email, String keyword);

    List<Appointment> findByDoctor_EmailAndReasonContainingIgnoreCase(
            String email, String keyword);

    // Admin Dashboard: Appointments per month (current year)
    @Query("SELECT MONTH(a.appointmentDate), COUNT(a) FROM Appointment a " +
           "WHERE YEAR(a.appointmentDate) = :year " +
           "GROUP BY MONTH(a.appointmentDate) ORDER BY MONTH(a.appointmentDate)")
    List<Object[]> countByMonth(@Param("year") int year);
}
