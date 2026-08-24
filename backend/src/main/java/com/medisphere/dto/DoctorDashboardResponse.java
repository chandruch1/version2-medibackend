package com.medisphere.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorDashboardResponse {

    private long totalAppointments;
    private long pendingAppointments;
    private long approvedAppointments;
    private long completedAppointments;
    private long rejectedAppointments;
    private long todayAppointments;
    private Double averageRating;
    private long totalReviews;
}