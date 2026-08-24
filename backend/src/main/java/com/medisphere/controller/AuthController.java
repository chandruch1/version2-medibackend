package com.medisphere.controller;

import com.medisphere.dto.ChangePasswordRequest;
import com.medisphere.dto.LoginRequest;
import com.medisphere.dto.LoginResponse;
import com.medisphere.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.medisphere.dto.RegisterRequest;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return userService.login(request);
    }

    @GetMapping("/profile")
    public String profile() {
        return "Welcome Admin! JWT Authentication Successful.";
    }

    @PostMapping("/register")
    public String register(@Valid @RequestBody RegisterRequest request) {
        return userService.register(request);
    }

    @PutMapping("/change-password")
    @PreAuthorize("hasRole('ADMIN')")
    public String changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request) {

        return userService.changePassword(
                authentication.getName(),
                request);
    }
}