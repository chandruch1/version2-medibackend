package com.medisphere.security;

import com.medisphere.entity.Doctor;
import com.medisphere.entity.Patient;
import com.medisphere.entity.User;
import com.medisphere.repository.DoctorRepository;
import com.medisphere.repository.PatientRepository;
import com.medisphere.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        // ==========================
        // Admin Login
        // ==========================
        Optional<User> user = userRepository.findByUsername(username);

        if (user.isPresent()) {

            User admin = user.get();

            return org.springframework.security.core.userdetails.User
                    .withUsername(admin.getUsername())
                    .password(admin.getPassword())
                    .roles(admin.getRole().name())
                    .build();
        }

        // ==========================
        // Doctor Login
        // ==========================
        Optional<Doctor> doctor = doctorRepository.findByEmail(username);

        if (doctor.isPresent()) {

            Doctor d = doctor.get();

            return org.springframework.security.core.userdetails.User
                    .withUsername(d.getEmail())
                    .password(d.getPassword())
                    .roles("DOCTOR")
                    .build();
        }

        // ==========================
        // Patient Login
        // ==========================
        Optional<Patient> patient = patientRepository.findByEmail(username);

        if (patient.isPresent()) {

            Patient p = patient.get();

            return org.springframework.security.core.userdetails.User
                    .withUsername(p.getEmail())
                    .password(p.getPassword())
                    .roles("PATIENT")
                    .build();
        }

        throw new UsernameNotFoundException("User Not Found");
    }
}