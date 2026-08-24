package com.medisphere.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientDashboardResponse {

    private long totalAppointments;
    private long pendingAppointments;
    private long approvedAppointments;
    private long completedAppointments;
    private long cancelledAppointments;
    private long totalPrescriptions;
    private long unreadNotifications;
}