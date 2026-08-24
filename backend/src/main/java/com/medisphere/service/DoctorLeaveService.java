package com.medisphere.service;

import com.medisphere.dto.DoctorLeaveRequest;
import com.medisphere.dto.DoctorLeaveResponse;
import com.medisphere.entity.Doctor;
import com.medisphere.entity.DoctorLeave;
import com.medisphere.entity.LeaveStatus;
import com.medisphere.exception.ResourceNotFoundException;
import com.medisphere.repository.DoctorLeaveRepository;
import com.medisphere.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorLeaveService {

    private final DoctorLeaveRepository doctorLeaveRepository;
    private final DoctorRepository doctorRepository;
    private final NotificationService notificationService;

    // ==========================
    // Doctor: Apply Leave
    // ==========================
    public DoctorLeaveResponse applyLeave(String email, DoctorLeaveRequest request) {

        Doctor doctor = doctorRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new RuntimeException("End date cannot be before start date");
        }

        DoctorLeave leave = DoctorLeave.builder()
                .doctor(doctor)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .reason(request.getReason())
                .status(LeaveStatus.PENDING)
                .build();

        return mapToResponse(doctorLeaveRepository.save(leave));
    }

    // ==========================
    // Doctor: View Own Leave Requests
    // ==========================
    public List<DoctorLeaveResponse> getMyLeaves(String email) {

        return doctorLeaveRepository.findByDoctor_EmailOrderByStartDateDesc(email)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ==========================
    // Admin: View All Leave Requests
    // ==========================
    public List<DoctorLeaveResponse> getAllLeaves() {

        return doctorLeaveRepository.findAllByOrderByStartDateDesc()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ==========================
    // Admin: Approve Leave
    // ==========================
    public DoctorLeaveResponse approveLeave(Long id) {

        DoctorLeave leave = doctorLeaveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found"));

        leave.setStatus(LeaveStatus.APPROVED);
        DoctorLeave saved = doctorLeaveRepository.save(leave);

        // Notify doctor
        notificationService.createNotification(
                "Leave Approved",
                "Your leave request from " + leave.getStartDate() + " to " + leave.getEndDate() + " has been approved.",
                "DOCTOR",
                leave.getDoctor().getId()
        );

        return mapToResponse(saved);
    }

    // ==========================
    // Admin: Reject Leave
    // ==========================
    public DoctorLeaveResponse rejectLeave(Long id) {

        DoctorLeave leave = doctorLeaveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found"));

        leave.setStatus(LeaveStatus.REJECTED);
        DoctorLeave saved = doctorLeaveRepository.save(leave);

        // Notify doctor
        notificationService.createNotification(
                "Leave Rejected",
                "Your leave request from " + leave.getStartDate() + " to " + leave.getEndDate() + " has been rejected.",
                "DOCTOR",
                leave.getDoctor().getId()
        );

        return mapToResponse(saved);
    }

    // ==========================
    // Internal: Check if Doctor is on Approved Leave
    // ==========================
    public boolean isDoctorOnLeave(Long doctorId, LocalDate date) {

        return doctorLeaveRepository
                .existsByDoctor_IdAndStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                        doctorId,
                        LeaveStatus.APPROVED,
                        date,
                        date
                );
    }

    // ==========================
    // Entity -> DTO
    // ==========================
    private DoctorLeaveResponse mapToResponse(DoctorLeave leave) {

        return DoctorLeaveResponse.builder()
                .id(leave.getId())
                .doctorId(leave.getDoctor().getId())
                .doctorName(leave.getDoctor().getDoctorName())
                .startDate(leave.getStartDate())
                .endDate(leave.getEndDate())
                .reason(leave.getReason())
                .status(leave.getStatus())
                .build();
    }
}
