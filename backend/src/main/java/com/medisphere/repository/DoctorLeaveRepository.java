package com.medisphere.repository;

import com.medisphere.entity.DoctorLeave;
import com.medisphere.entity.LeaveStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DoctorLeaveRepository extends JpaRepository<DoctorLeave, Long> {

    List<DoctorLeave> findByDoctor_EmailOrderByStartDateDesc(String email);

    List<DoctorLeave> findAllByOrderByStartDateDesc();

    boolean existsByDoctor_IdAndStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            Long doctorId,
            LeaveStatus status,
            LocalDate endDate,
            LocalDate startDate
    );
}
