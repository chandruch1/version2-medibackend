package com.medisphere.service;

import com.medisphere.dto.NotificationResponse;
import com.medisphere.entity.Notification;
import com.medisphere.exception.ResourceNotFoundException;
import com.medisphere.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    // ==========================
    // Internal: Create Notification
    // ==========================
    public void createNotification(String title, String message, String role, Long userId) {
        try {
            Notification notification = Notification.builder()
                    .title(title)
                    .message(message)
                    .role(role)
                    .userId(userId)
                    .isRead(false)
                    .build();
            notificationRepository.save(notification);
        } catch (Exception e) {
            // Non-critical: log and continue
            System.err.println("Failed to create notification: " + e.getMessage());
        }
    }

    // ==========================
    // Patient/Doctor: Get own Notifications
    // ==========================
    public List<NotificationResponse> getNotifications(Long userId, String role) {

        return notificationRepository
                .findByUserIdAndRoleOrderByCreatedAtDesc(userId, role)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ==========================
    // Patient/Doctor: Mark Single Notification as Read
    // ==========================
    public void markAsRead(Long id) {

        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    // ==========================
    // Patient/Doctor: Mark All as Read
    // ==========================
    public void markAllAsRead(Long userId, String role) {
        notificationRepository.markAllAsReadByUserIdAndRole(userId, role);
    }

    // ==========================
    // Admin: Get All Notifications
    // ==========================
    public List<NotificationResponse> getAllNotifications() {

        return notificationRepository.findAll()
                .stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(this::mapToResponse)
                .toList();
    }

    // ==========================
    // Admin: Delete Notification
    // ==========================
    public void deleteNotification(Long id) {

        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        notificationRepository.delete(notification);
    }

    // ==========================
    // Get Unread Count
    // ==========================
    public long getUnreadCount(Long userId, String role) {
        return notificationRepository.countByUserIdAndRoleAndIsReadFalse(userId, role);
    }

    // ==========================
    // Entity -> DTO
    // ==========================
    private NotificationResponse mapToResponse(Notification n) {

        return NotificationResponse.builder()
                .id(n.getId())
                .title(n.getTitle())
                .message(n.getMessage())
                .role(n.getRole())
                .userId(n.getUserId())
                .isRead(n.getIsRead())
                .createdAt(n.getCreatedAt())
                .build();
    }
}
