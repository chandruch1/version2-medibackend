import { useEffect, useState } from "react";
import PatientLayout from "../../layouts/PatientLayout";
import Loader from "../../components/common/Loader";
import { getMyNotifications, markAsRead, markAllReadPatient } from "../../services/notificationService";
import { toast } from "react-toastify";
import { FaBell, FaCheckDouble, FaCheck } from "react-icons/fa";

function NotificationItem({ n, onRead }) {
    return (
        <div
            style={{
                display: "flex", alignItems: "flex-start", gap: 14,
                padding: "14px 16px",
                background: n.isRead ? "transparent" : "rgba(13,110,253,0.04)",
                borderRadius: 10,
                border: `1px solid ${n.isRead ? "var(--border-color,#e5eaf3)" : "rgba(13,110,253,0.15)"}`,
                marginBottom: 10,
                transition: "background 0.2s"
            }}
        >
            <div style={{
                width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                background: n.isRead ? "#f1f5f9" : "rgba(13,110,253,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 15, color: n.isRead ? "#94a3b8" : "#0d6efd"
            }}>
                <FaBell />
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ fontWeight: n.isRead ? 500 : 700, fontSize: 14, color: "var(--gray-800,#1e293b)" }}>
                    {n.title}
                </div>
                <div style={{ fontSize: 13, color: "var(--gray-600,#475569)", marginTop: 2 }}>{n.message}</div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
                    {n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}
                </div>
            </div>
            {!n.isRead && (
                <button
                    onClick={() => onRead(n.id)}
                    className="btn btn-sm btn-outline-primary"
                    style={{ fontSize: 11, whiteSpace: "nowrap" }}
                >
                    <FaCheck className="me-1" /> Mark Read
                </button>
            )}
        </div>
    );
}

function PatientNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading,       setLoading]       = useState(true);

    const load = async () => {
        try {
            const data = await getMyNotifications();
            setNotifications(data);
        } catch {
            toast.error("Failed to load notifications.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleRead = async (id) => {
        try {
            await markAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch {
            toast.error("Failed to mark as read.");
        }
    };

    const handleReadAll = async () => {
        try {
            await markAllReadPatient();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            toast.success("All notifications marked as read.");
        } catch {
            toast.error("Failed to mark all as read.");
        }
    };

    if (loading) return <PatientLayout title="Notifications"><Loader text="Loading..." /></PatientLayout>;

    const unread = notifications.filter(n => !n.isRead).length;

    return (
        <PatientLayout title="Notifications" subtitle="Stay updated with your healthcare activity">
            <div className="ms-card">
                <div className="ms-card-header d-flex justify-content-between align-items-center">
                    <span>
                        <FaBell className="me-2 text-primary" />
                        Notifications
                        {unread > 0 && (
                            <span className="badge bg-danger ms-2" style={{ fontSize: 11 }}>{unread} new</span>
                        )}
                    </span>
                    {unread > 0 && (
                        <button className="btn btn-sm btn-outline-success" onClick={handleReadAll}>
                            <FaCheckDouble className="me-1" /> Mark All Read
                        </button>
                    )}
                </div>
                <div className="mt-2">
                    {notifications.length === 0 ? (
                        <div className="text-center py-5" style={{ color: "var(--gray-500,#94a3b8)" }}>
                            <div style={{ fontSize: 40, marginBottom: 12 }}>🔔</div>
                            <div>No notifications yet.</div>
                        </div>
                    ) : (
                        notifications.map(n => (
                            <NotificationItem key={n.id} n={n} onRead={handleRead} />
                        ))
                    )}
                </div>
            </div>
        </PatientLayout>
    );
}

export default PatientNotifications;
