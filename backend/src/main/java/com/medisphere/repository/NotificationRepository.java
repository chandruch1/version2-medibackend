package com.medisphere.repository;

import com.medisphere.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserIdAndRoleOrderByCreatedAtDesc(Long userId, String role);

    long countByUserIdAndRoleAndIsReadFalse(Long userId, String role);

    @Modifying
    @Transactional
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.userId = :userId AND n.role = :role")
    void markAllAsReadByUserIdAndRole(Long userId, String role);
}
