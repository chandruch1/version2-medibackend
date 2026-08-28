package com.medisphere.service;

import com.medisphere.dto.*;
import com.medisphere.entity.Doctor;
import com.medisphere.exception.DuplicateResourceException;
import com.medisphere.exception.ResourceNotFoundException;
import com.medisphere.repository.DoctorRepository;
import com.medisphere.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;


import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import com.medisphere.dto.DoctorProfileUpdateRequest;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    // Add Doctor
    public DoctorResponse addDoctor(DoctorRequest request) {

        if (doctorRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already exists");
        }

        if (doctorRepository.existsByPhone(request.getPhone())) {
            throw new DuplicateResourceException("Phone number already exists");
        }

        Doctor doctor = Doctor.builder()
                .doctorName(request.getDoctorName())
                .specialization(request.getSpecialization())
                .qualification(request.getQualification())
                .experience(request.getExperience())
                .phone(request.getPhone())
                .email(request.getEmail())
                .consultationFee(request.getConsultationFee())
                .availableDays(request.getAvailableDays())
                .availableTime(normalizeTime(request.getAvailableTime()))
                .status(request.getStatus())
                .dob(request.getDob())
                .password(
                        passwordEncoder.encode(
                                generatePassword(
                                        request.getDoctorName(),
                                        request.getDob()
                                )
                        )
                )
                .build();

        Doctor savedDoctor = doctorRepository.save(doctor);

        return mapToResponse(savedDoctor);
    }

    // Get All Doctors
    public List<DoctorResponse> getAllDoctors() {

        return doctorRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get Doctor By Id
    public DoctorResponse getDoctorById(Long id) {

        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Doctor not found with id : " + id));

        return mapToResponse(doctor);
    }

    // Update Doctor
    public DoctorResponse updateDoctor(Long id, DoctorRequest request) {

        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Doctor not found with id : " + id));

        if (!doctor.getEmail().equals(request.getEmail())
                && doctorRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already exists");
        }

        if (!doctor.getPhone().equals(request.getPhone())
                && doctorRepository.existsByPhone(request.getPhone())) {
            throw new DuplicateResourceException("Phone number already exists");
        }

        doctor.setDoctorName(request.getDoctorName());
        doctor.setSpecialization(request.getSpecialization());
        doctor.setQualification(request.getQualification());
        doctor.setExperience(request.getExperience());
        doctor.setPhone(request.getPhone());
        doctor.setEmail(request.getEmail());
        doctor.setConsultationFee(request.getConsultationFee());
        doctor.setAvailableDays(request.getAvailableDays());
        doctor.setAvailableTime(normalizeTime(request.getAvailableTime()));
        doctor.setStatus(request.getStatus());
        doctor.setDob(request.getDob());

        Doctor updatedDoctor = doctorRepository.save(doctor);

        return mapToResponse(updatedDoctor);
    }

    // Delete Doctor
    public void deleteDoctor(Long id) {

        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Doctor not found with id : " + id));

        doctorRepository.delete(doctor);
    }

    // Convert Entity to Response DTO
    private DoctorResponse mapToResponse(Doctor doctor) {

        return DoctorResponse.builder()
                .id(doctor.getId())
                .doctorName(doctor.getDoctorName())
                .specialization(doctor.getSpecialization())
                .qualification(doctor.getQualification())
                .experience(doctor.getExperience())
                .phone(doctor.getPhone())
                .email(doctor.getEmail())
                .dob(doctor.getDob())
                .consultationFee(doctor.getConsultationFee())
                .availableDays(doctor.getAvailableDays())
                .availableTime(doctor.getAvailableTime())
                .status(doctor.getStatus())
                .build();
    }

    public List<DoctorResponse> searchDoctorByName(String name) {

        return doctorRepository
                .findByDoctorNameContainingIgnoreCase(name)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<DoctorResponse> searchDoctorBySpecialization(String specialization) {

        return doctorRepository
                .findBySpecializationContainingIgnoreCase(specialization)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public Page<DoctorResponse> getDoctorsWithPagination(
            int page,
            int size,
            String sortBy,
            String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return doctorRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    private String generatePassword(String doctorName, LocalDate dob) {

        String firstName = doctorName.trim().split(" ")[0];

        int year = dob.getYear();

        return firstName + year;
    }

    // Normalize time format: converts "10.00-17.00" → "10:00-17:00"
    private String normalizeTime(String time) {
        if (time == null) return null;
        return time.replace(".", ":");
    }

    public DoctorLoginResponse login(DoctorLoginRequest request) {

        Doctor doctor = doctorRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Doctor not found"));

        if (!passwordEncoder.matches(request.getPassword(), doctor.getPassword())) {
            throw new RuntimeException("Invalid Password");
        }

        String token = jwtService.generateToken(doctor.getEmail());

        return DoctorLoginResponse.builder()
                .token(token)
                .doctorName(doctor.getDoctorName())
                .email(doctor.getEmail())
                .specialization(doctor.getSpecialization())
                .role("DOCTOR")
                .build();
    }
    public DoctorResponse getDoctorProfile(String email) {

        Doctor doctor = doctorRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Doctor not found"));


        return mapToResponse(doctor);
    }
    public List<DoctorResponse> getAvailableDoctors() {

        return doctorRepository.findAll()
                .stream()
                .filter(Doctor::getStatus)
                .map(this::mapToResponse)
                .toList();
    }
    public String changePassword(
            String email,
            ChangePasswordRequest request) {

        Doctor doctor = doctorRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Doctor not found"));

        if (!passwordEncoder.matches(
                request.getOldPassword(),
                doctor.getPassword())) {

            throw new RuntimeException("Old password is incorrect");
        }

        doctor.setPassword(
                passwordEncoder.encode(request.getNewPassword()));

        doctorRepository.save(doctor);

        return "Password changed successfully";
    }
    public DoctorResponse updateProfile(
            String email,
            DoctorProfileUpdateRequest request) {

        Doctor doctor = doctorRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Doctor not found"));

        // Check duplicate phone number
        if (!doctor.getPhone().equals(request.getPhone())
                && doctorRepository.existsByPhone(request.getPhone())) {

            throw new DuplicateResourceException(
                    "Phone number already exists");
        }

        doctor.setPhone(request.getPhone());
        doctor.setQualification(request.getQualification());
        doctor.setExperience(request.getExperience());
        doctor.setConsultationFee(request.getConsultationFee());
        doctor.setAvailableDays(request.getAvailableDays());
        doctor.setAvailableTime(request.getAvailableTime());

        Doctor updatedDoctor = doctorRepository.save(doctor);

        return mapToResponse(updatedDoctor);
    }
}