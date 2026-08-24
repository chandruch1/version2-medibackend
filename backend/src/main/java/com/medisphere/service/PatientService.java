package com.medisphere.service;

import com.medisphere.dto.*;
import com.medisphere.entity.Patient;
import com.medisphere.exception.DuplicateResourceException;
import com.medisphere.exception.ResourceNotFoundException;
import com.medisphere.repository.PatientRepository;
import com.medisphere.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import com.medisphere.exception.DuplicateResourceException;
import com.medisphere.exception.InvalidCredentialsException;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import com.medisphere.dto.PatientProfileUpdateRequest;
import com.medisphere.dto.ForgotPasswordRequest;
import com.medisphere.dto.VerifyOtpRequest;
import com.medisphere.dto.ResetPasswordRequest;
import com.medisphere.entity.OtpVerification;
import com.medisphere.repository.OtpVerificationRepository;

import java.time.LocalDateTime;
import java.util.Random;


@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final OtpVerificationRepository otpRepository;
    private final MailService mailService;


    // Add Patient
    public PatientResponse addPatient(PatientRequest request) {

        if (patientRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already exists");
        }

        if (patientRepository.existsByPhone(request.getPhone())) {
            throw new DuplicateResourceException("Phone number already exists");
        }

        Patient patient = Patient.builder()
                .patientName(request.getPatientName())
                .age(request.getAge())
                .gender(request.getGender())
                .phone(request.getPhone())
                .email(request.getEmail())
                .address(request.getAddress())
                .bloodGroup(request.getBloodGroup())
                .disease(request.getDisease())
                .status(request.getStatus())
                .dob(request.getDob())
                .password(
                        passwordEncoder.encode(
                                generatePassword(
                                        request.getPatientName(),
                                        request.getDob()
                                )
                        )
                )
                .build();

        Patient savedPatient = patientRepository.save(patient);

        return mapToResponse(savedPatient);
    }

    // Get All Patients
    public List<PatientResponse> getAllPatients() {

        return patientRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get Patient By Id
    public PatientResponse getPatientById(Long id) {

        Patient patient = patientRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Patient not found with id : " + id));

        return mapToResponse(patient);
    }

    // Update Patient
    public PatientResponse updatePatient(Long id, PatientRequest request) {

        Patient patient = patientRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Patient not found with id : " + id));

        if (!patient.getEmail().equals(request.getEmail())
                && patientRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already exists");
        }

        if (!patient.getPhone().equals(request.getPhone())
                && patientRepository.existsByPhone(request.getPhone())) {
            throw new DuplicateResourceException("Phone number already exists");
        }

        patient.setPatientName(request.getPatientName());
        patient.setAge(request.getAge());
        patient.setGender(request.getGender());
        patient.setPhone(request.getPhone());
        patient.setEmail(request.getEmail());
        patient.setAddress(request.getAddress());
        patient.setBloodGroup(request.getBloodGroup());
        patient.setDisease(request.getDisease());
        patient.setStatus(request.getStatus());
        patient.setDob(request.getDob());

        Patient updatedPatient = patientRepository.save(patient);

        return mapToResponse(updatedPatient);
    }

    // Delete Patient
    public void deletePatient(Long id) {

        Patient patient = patientRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Patient not found with id : " + id));

        patientRepository.delete(patient);
    }

    // Convert Entity to Response DTO
    private PatientResponse mapToResponse(Patient patient) {

        return PatientResponse.builder()
                .id(patient.getId())
                .patientName(patient.getPatientName())
                .age(patient.getAge())
                .gender(patient.getGender())
                .phone(patient.getPhone())
                .email(patient.getEmail())
                .address(patient.getAddress())
                .bloodGroup(patient.getBloodGroup())
                .disease(patient.getDisease())
                .status(patient.getStatus())
                .build();
    }

    public List<PatientResponse> searchPatientByName(String name) {

        return patientRepository
                .findByPatientNameContainingIgnoreCase(name)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<PatientResponse> searchPatientByDisease(String disease) {

        return patientRepository
                .findByDiseaseContainingIgnoreCase(disease)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public Page<PatientResponse> getPatientsWithPagination(
            int page,
            int size,
            String sortBy,
            String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return patientRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    public String register(PatientRegisterRequest request) {

        if (patientRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already exists");
        }

        if (patientRepository.existsByPhone(request.getPhone())) {
            throw new DuplicateResourceException("Phone already exists");
        }

        Patient patient = Patient.builder()
                .patientName(request.getPatientName())
                .age(request.getAge())
                .gender(request.getGender())
                .phone(request.getPhone())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .address(request.getAddress())
                .bloodGroup(request.getBloodGroup())
                .disease(request.getDisease())
                .status(true)
                .dob(request.getDob())
                .build();

        patientRepository.save(patient);

        return "Patient Registered Successfully";
    }

    public PatientLoginResponse login(PatientLoginRequest request) {

        Patient patient = patientRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Patient not found"));

        if (!passwordEncoder.matches(request.getPassword(), patient.getPassword())) {
            throw new InvalidCredentialsException("Invalid password");
        }

        String token = jwtService.generateToken(patient.getEmail());

        return PatientLoginResponse.builder()
                .token(token)
                .patientName(patient.getPatientName())
                .email(patient.getEmail())
                .role("PATIENT")
                .build();
    }
    public PatientResponse getProfile(String email) {

        Patient patient = patientRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Patient not found"));

        return mapToResponse(patient);
    }
    public String changePassword(
            String email,
            ChangePasswordRequest request) {

        Patient patient = patientRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Patient not found"));

        if (!passwordEncoder.matches(
                request.getOldPassword(),
                patient.getPassword())) {

            throw new RuntimeException("Old password is incorrect");
        }

        patient.setPassword(
                passwordEncoder.encode(request.getNewPassword()));

        patientRepository.save(patient);

        return "Password changed successfully";
    }

    public PatientResponse updateProfile(
            String email,
            PatientProfileUpdateRequest request) {

        Patient patient = patientRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Patient not found"));

        // Check duplicate phone number
        if (!patient.getPhone().equals(request.getPhone())
                && patientRepository.existsByPhone(request.getPhone())) {

            throw new DuplicateResourceException(
                    "Phone number already exists");
        }

        patient.setPhone(request.getPhone());
        patient.setAddress(request.getAddress());
        patient.setBloodGroup(request.getBloodGroup());
        patient.setDisease(request.getDisease());

        Patient updatedPatient = patientRepository.save(patient);

        return mapToResponse(updatedPatient);
    }
    public String forgotPassword(ForgotPasswordRequest request) {

        Patient patient = patientRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Patient not found"));

        // Generate OTP
        String otp = String.format("%06d", new Random().nextInt(999999));

        otpRepository.deleteByEmail(request.getEmail());

        OtpVerification otpVerification = OtpVerification.builder()
                .email(request.getEmail())
                .otp(otp)
                .expiryTime(LocalDateTime.now().plusMinutes(5))
                .verified(false)
                .build();

        otpRepository.save(otpVerification);

        try {

            mailService.sendOtpEmail(request.getEmail(), otp);

            return "OTP sent successfully to your email.";

        } catch (Exception e) {

            e.printStackTrace();

            System.err.println("Failed to send OTP email: "
                    + e.getMessage());

            return "OTP generated successfully, but email could not be sent.";
        }
    }

    public String verifyOtp(VerifyOtpRequest request) {

        OtpVerification otp = otpRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("OTP not found"));

        if (otp.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP has expired");
        }

        if (!otp.getOtp().equals(request.getOtp())) {
            throw new RuntimeException("Invalid OTP");
        }

        otp.setVerified(true);

        otpRepository.save(otp);

        return "OTP verified successfully.";
    }
    public String resetPassword(ResetPasswordRequest request) {

        OtpVerification otp = otpRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("OTP verification not found"));

        if (!otp.getVerified()) {
            throw new RuntimeException("Please verify OTP first");
        }

        Patient patient = patientRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Patient not found"));

        patient.setPassword(
                passwordEncoder.encode(request.getNewPassword()));

        patientRepository.save(patient);

        otpRepository.deleteByEmail(request.getEmail());

        return "Password reset successfully.";
    }
    private String generatePassword(String patientName, LocalDate dob) {

        String firstName = patientName.trim().split(" ")[0];

        int year = dob.getYear();

        return firstName + year;
    }
}