package com.medisphere.controller;

import com.medisphere.dto.DoctorLeaveRequest;
import com.medisphere.dto.DoctorLeaveResponse;
import com.medisphere.service.DoctorLeaveService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/leaves")
@RequiredArgsConstructor
public class DoctorLeaveController {

    private final DoctorLeaveService doctorLeaveService;

    // ==========================
    // DOCTOR
    // ==========================

    @PostMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public DoctorLeaveResponse applyLeave(
            Authentication authentication,
            @Valid @RequestBody DoctorLeaveRequest request) {

        return doctorLeaveService.applyLeave(authentication.getName(), request);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('DOCTOR')")
    public List<DoctorLeaveResponse> getMyLeaves(Authentication authentication) {

        return doctorLeaveService.getMyLeaves(authentication.getName());
    }

    // ==========================
    // ADMIN
    // ==========================

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<DoctorLeaveResponse> getAllLeaves() {

        return doctorLeaveService.getAllLeaves();
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public DoctorLeaveResponse approveLeave(@PathVariable Long id) {

        return doctorLeaveService.approveLeave(id);
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public DoctorLeaveResponse rejectLeave(@PathVariable Long id) {

        return doctorLeaveService.rejectLeave(id);
    }
}
