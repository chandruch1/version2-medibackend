package com.medisphere.service;

import com.medisphere.dto.DashboardResponse;
import com.medisphere.entity.AppointmentStatus;
import com.medisphere.repository.AppointmentRepository;
import com.medisphere.repository.DoctorRepository;
import com.medisphere.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;

    public DashboardResponse getDashboardData() {

        return DashboardResponse.builder()
                .totalDoctors(doctorRepository.count())
                .totalPatients(patientRepository.count())
                .totalAppointments(appointmentRepository.count())
                .bookedAppointments(
                        appointmentRepository.countByStatus(AppointmentStatus.PENDING)
                )
                .pendingAppointments(
                        appointmentRepository.countByStatus(AppointmentStatus.PENDING)
                )
                .approvedAppointments(
                        appointmentRepository.countByStatus(AppointmentStatus.APPROVED)
                )
                .rejectedAppointments(
                        appointmentRepository.countByStatus(AppointmentStatus.REJECTED)
                )
                .completedAppointments(
                        appointmentRepository.countByStatus(AppointmentStatus.COMPLETED)
                )
                .cancelledAppointments(
                        appointmentRepository.countByStatus(AppointmentStatus.CANCELLED)
                )
                .build();
    }

    // Appointments per month for current year (for bar chart)
    public Map<String, Long> getMonthlyAppointments() {
        int year = LocalDate.now().getYear();
        List<Object[]> rows = appointmentRepository.countByMonth(year);

        String[] months = {
            "Jan","Feb","Mar","Apr","May","Jun",
            "Jul","Aug","Sep","Oct","Nov","Dec"
        };

        Map<String, Long> result = new LinkedHashMap<>();
        for (String m : months) {
            result.put(m, 0L);
        }

        for (Object[] row : rows) {
            int monthNum = ((Number) row[0]).intValue();
            long count   = ((Number) row[1]).longValue();
            result.put(months[monthNum - 1], count);
        }

        return result;
    }
}