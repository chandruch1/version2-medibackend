package com.medisphere.dto;

import com.medisphere.entity.LeaveStatus;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorLeaveResponse {

    private Long id;

    private Long doctorId;

    private String doctorName;

    private LocalDate startDate;

    private LocalDate endDate;

    private String reason;

    private LeaveStatus status;
}
