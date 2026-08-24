import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import Loader from "../../components/common/Loader";
import { getAllNotifications, deleteNotification } from "../../services/notificationService";
import { toast } from "react-toastify";
import { FaBell, FaTrash } from "react-icons/fa";

const ROLE_COLORS = {
    PATIENT: { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
    DOCTOR:  { bg: "#f0fdf4", color: "#16a34a", border: "#86efac" },
    ADMIN:   { bg: "#fef3c7", color: "#d97706", border: "#fde68a" },
};

function AdminNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [filtered,      setFiltered]      = useState([]);
    const [loading,       setLoading]       = useState(true);
    const [roleFilter,    setRoleFilter]    = useState("ALL");
    const [search,        setSearch]        = useState("");

    const load = async () => {
        try {
            const data = await getAllNotifications();
            setNotifications(data);
            setFiltered(data);
        } catch {
            toast.error("Failed to load notifications.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    useEffect(() => {
        const q = search.toLowerCase();
        setFiltered(notifications.filter(n => {
            const matchRole   = roleFilter === "ALL" || n.role === roleFilter;
            const matchSearch = n.title?.toLowerCase().includes(q) || n.message?.toLowerCase().includes(q);
            return matchRole && matchSearch;
        }));
    }, [roleFilter, search, notifications]);

    const handleDelete = async id => {
        try {
            await deleteNotification(id);
            setNotifications(prev => prev.filter(n => n.id !== id));
            toast.success("Notification deleted.");
        } catch {
            toast.error("Failed to delete.");
        }
    };

    if (loading) return <AdminLayout title="Notifications"><Loader text="Loading..." /></AdminLayout>;

    return (
        <AdminLayout title="Notification Center" subtitle="View and manage all system notifications">
            <div className="ms-card">
                <div className="ms-card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <span><FaBell className="me-2 text-primary" />All Notifications ({notifications.length})</span>
                    <div className="d-flex gap-2">
                        <input className="form-control form-control-sm" style={{ width: 180 }}
                            placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
                        <select className="form-select form-select-sm" style={{ width: 130 }}
                            value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
                            <option value="ALL">All Roles</option>
                            <option value="PATIENT">Patient</option>
                            <option value="DOCTOR">Doctor</option>
                        </select>
                    </div>
                </div>
                <div className="mt-2" style={{ maxHeight: 600, overflowY: "auto" }}>
                    {filtered.length === 0 ? (
                        <div className="text-center py-5" style={{ color: "#94a3b8" }}>
                            <div style={{ fontSize: 40, marginBottom: 12 }}>🔔</div>
                            <div>No notifications found.</div>
                        </div>
                    ) : filtered.map(n => {
                        const s = ROLE_COLORS[n.role] || ROLE_COLORS.ADMIN;
                        return (
                            <div key={n.id} style={{
                                display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 16px",
                                background: n.isRead ? "transparent" : "rgba(13,110,253,0.03)",
                                borderRadius: 10, border: "1px solid var(--border-color,#e5eaf3)",
                                marginBottom: 10
                            }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                                    background: s.bg, border: `1px solid ${s.border}`,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    color: s.color, fontSize: 14
                                }}>
                                    <FaBell />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div className="d-flex align-items-center gap-2">
                                        <span style={{ fontWeight: 700, fontSize: 14 }}>{n.title}</span>
                                        <span style={{
                                            padding: "2px 8px", borderRadius: 20, fontSize: 10,
                                            background: s.bg, color: s.color, border: `1px solid ${s.border}`, fontWeight: 600
                                        }}>
                                            {n.role}
                                        </span>
                                        {!n.isRead && <span className="badge bg-danger" style={{ fontSize: 9 }}>UNREAD</span>}
                                    </div>
                                    <div style={{ fontSize: 13, color: "#475569", marginTop: 2 }}>{n.message}</div>
                                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
                                        {n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(n.id)}
                                    className="btn btn-sm btn-outline-danger"
                                    title="Delete notification"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </AdminLayout>
    );
}

export default AdminNotifications;
