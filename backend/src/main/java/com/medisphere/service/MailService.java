package com.medisphere.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp) {

        try {

            SimpleMailMessage message = new SimpleMailMessage();

            message.setTo(toEmail);
            message.setSubject("MediSphere - Password Reset OTP");

            message.setText(
                    "Hello,\n\n" +
                            "Your OTP is: " + otp
            );

            mailSender.send(message);

            System.out.println("OTP email sent successfully.");

        } catch (Exception e) {

            System.out.println("========== MAIL ERROR ==========");
            e.printStackTrace();
            System.out.println("===============================");
            throw e;
        }
    }
    public void sendPrescriptionEmail(
            String toEmail,
            String patientName,
            String doctorName,
            String medicine,
            String dosage,
            String duration,
            String notes) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setSubject("MediSphere - Your Prescription");

        message.setText(
                "Hello " + patientName + ",\n\n" +

                        "Your doctor has added a prescription.\n\n" +

                        "Doctor : Dr. " + doctorName + "\n\n" +

                        "Medicine : " + medicine + "\n" +
                        "Dosage : " + dosage + "\n" +
                        "Duration : " + duration + "\n" +
                        "Notes : " + notes + "\n\n" +

                        "Please follow the prescription carefully.\n\n" +

                        "Get Well Soon!\n\n" +

                        "Regards,\n" +
                        "MediSphere Team");

        mailSender.send(message);
    }
    public void sendAppointmentBookedEmail(
            String toEmail,
            String patientName,
            String doctorName,
            String date,
            String time) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setSubject("MediSphere - Appointment Booked");

        message.setText(
                "Hello " + patientName + ",\n\n" +

                        "Your appointment has been booked successfully.\n\n" +

                        "Doctor : Dr. " + doctorName + "\n" +
                        "Date : " + date + "\n" +
                        "Time : " + time + "\n\n" +

                        "Status : PENDING\n\n" +

                        "Thank you for choosing MediSphere.\n\n" +

                        "Regards,\nMediSphere Team");

        mailSender.send(message);
    }
    public void sendAppointmentApprovedEmail(
            String toEmail,
            String patientName,
            String doctorName,
            String date,
            String time) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setSubject("MediSphere - Appointment Approved");

        message.setText(
                "Hello " + patientName + ",\n\n" +

                        "Good News!\n\n" +

                        "Your appointment has been approved.\n\n" +

                        "Doctor : Dr. " + doctorName + "\n" +
                        "Date : " + date + "\n" +
                        "Time : " + time + "\n\n" +

                        "Please arrive 15 minutes early.\n\n" +

                        "Regards,\nMediSphere Team");

        mailSender.send(message);
    }
    public void sendAppointmentRejectedEmail(
            String toEmail,
            String patientName,
            String doctorName) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setSubject("MediSphere - Appointment Rejected");

        message.setText(
                "Hello " + patientName + ",\n\n" +

                        "Unfortunately your appointment with Dr. " +
                        doctorName +
                        " has been rejected.\n\n" +

                        "Please login and book another available slot.\n\n" +

                        "Regards,\nMediSphere Team");

        mailSender.send(message);
    }
}