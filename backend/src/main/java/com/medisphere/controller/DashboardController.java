package com.medisphere.controller;

import com.medisphere.dto.DashboardResponse;
import com.medisphere.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get admin dashboard statistics")
    public DashboardResponse getDashboard() {

        return dashboardService.getDashboardData();
    }

    @GetMapping("/monthly")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get appointments per month for the current year")
    public Map<String, Long> getMonthlyAppointments() {

        return dashboardService.getMonthlyAppointments();
    }
}