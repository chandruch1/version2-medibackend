package com.medisphere.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponse {

    private Long id;

    private String title;

    private String message;

    private String role;

    private Long userId;

    private Boolean isRead;

    private LocalDateTime createdAt;
}
