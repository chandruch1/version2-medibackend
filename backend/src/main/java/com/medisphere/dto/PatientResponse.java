package com.medisphere.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientResponse {

    private Long id;

    private String patientName;

    private Integer age;

    private String gender;

    private String phone;

    private String email;

    private String address;

    private String bloodGroup;

    private String disease;

    private Boolean status;
}