package com.medisphere.service;

import com.medisphere.dto.MedicalHistoryRequest;
import com.medisphere.dto.MedicalHistoryResponse;
import com.medisphere.entity.MedicalHistory;
import com.medisphere.entity.Patient;
import com.medisphere.exception.ResourceNotFoundException;
import com.medisphere.repository.MedicalHistoryRepository;
import com.medisphere.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicalHistoryService {

    private final MedicalHistoryRepository medicalHistoryRepository;
    private final PatientRepository patientRepository;

    // ==========================
    // Patient: Add or Update own Medical History
    // ==========================
    public MedicalHistoryResponse saveOrUpdate(String email, MedicalHistoryRequest request) {

        Patient patient = patientRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        MedicalHistory history = medicalHistoryRepository
                .findByPatient_Email(email)
                .orElse(MedicalHistory.builder().patient(patient).build());

        history.setHeight(request.getHeight());
        history.setWeight(request.getWeight());
        history.setBloodPressure(request.getBloodPressure());
        history.setHeartRate(request.getHeartRate());
        history.setBloodGroup(request.getBloodGroup());
        history.setAllergies(request.getAllergies());
        history.setPreviousDiseases(request.getPreviousDiseases());
        history.setSurgeries(request.getSurgeries());
        history.setFamilyHistory(request.getFamilyHistory());
        history.setCurrentMedication(request.getCurrentMedication());

        return mapToResponse(medicalHistoryRepository.save(history));
    }

    // ==========================
    // Patient: Get own Medical History
    // ==========================
    public MedicalHistoryResponse getMyHistory(String email) {

        MedicalHistory history = medicalHistoryRepository.findByPatient_Email(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No medical history found. Please add your medical history."));

        return mapToResponse(history);
    }

    // ==========================
    // Doctor: View Patient Medical History (read-only)
    // ==========================
    public MedicalHistoryResponse getByPatientId(Long patientId) {

        MedicalHistory history = medicalHistoryRepository.findByPatient_Id(patientId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No medical history found for this patient."));

        return mapToResponse(history);
    }

    // ==========================
    // Admin: Get All Medical Histories
    // ==========================
    public List<MedicalHistoryResponse> getAll() {

        return medicalHistoryRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ==========================
    // Admin: Delete Medical History
    // ==========================
    public void delete(Long id) {

        MedicalHistory history = medicalHistoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medical history not found"));

        medicalHistoryRepository.delete(history);
    }

    // ==========================
    // Entity -> DTO
    // ==========================
    private MedicalHistoryResponse mapToResponse(MedicalHistory h) {

        return MedicalHistoryResponse.builder()
                .id(h.getId())
                .patientId(h.getPatient().getId())
                .patientName(h.getPatient().getPatientName())
                .height(h.getHeight())
                .weight(h.getWeight())
                .bloodPressure(h.getBloodPressure())
                .heartRate(h.getHeartRate())
                .bloodGroup(h.getBloodGroup())
                .allergies(h.getAllergies())
                .previousDiseases(h.getPreviousDiseases())
                .surgeries(h.getSurgeries())
                .familyHistory(h.getFamilyHistory())
                .currentMedication(h.getCurrentMedication())
                .createdAt(h.getCreatedAt())
                .updatedAt(h.getUpdatedAt())
                .build();
    }
}
