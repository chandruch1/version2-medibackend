import { useEffect, useState } from "react";
import PatientLayout from "../../layouts/PatientLayout";
import DashboardCard from "../../components/dashboard/DashboardCard";
import { StatsBarChart } from "../../components/dashboard/AppointmentChart";
import Loader from "../../components/common/Loader";
import { getPatientDashboard } from "../../services/dashboardService";
import {
    FaCalendarCheck, FaHourglass, FaCheckCircle, FaBan, FaFileMedical, FaBell, FaThumbsUp
} from "react-icons/fa";
import { Link } from "react-router-dom";

function PatientDashboard() {
    const [data,    setData]    = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPatientDashboard()
            .then(setData)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <PatientLayout title="Dashboard"><Loader text="Loading dashboard..." /></PatientLayout>;
    }

    const d = data || {};

    return (
        <PatientLayout title="My Dashboard" subtitle="Track your healthcare journey">
            {/* Stat Cards */}
            <div className="row mb-2">
                <DashboardCard title="Total Appointments"  value={d.totalAppointments}     icon={<FaCalendarCheck />} colorClass="blue" />
                <DashboardCard title="Pending"             value={d.pendingAppointments}    icon={<FaHourglass />}     colorClass="orange" />
                <DashboardCard title="Approved"            value={d.approvedAppointments}   icon={<FaThumbsUp />}      colorClass="teal" />
                <DashboardCard title="Completed"           value={d.completedAppointments}  icon={<FaCheckCircle />}   colorClass="green" />
                <DashboardCard title="Cancelled"           value={d.cancelledAppointments}  icon={<FaBan />}           colorClass="red" />
                <DashboardCard title="Prescriptions"       value={d.totalPrescriptions}     icon={<FaFileMedical />}   colorClass="purple" />
                <DashboardCard title="Unread Alerts"       value={d.unreadNotifications}    icon={<FaBell />}          colorClass="orange" />
            </div>

            {/* Chart + Quick Action */}
            <div className="row">
                <div className="col-lg-7 mb-4">
                    <StatsBarChart
                        labels={["Pending", "Approved", "Completed", "Cancelled"]}
                        values={[d.pendingAppointments, d.approvedAppointments, d.completedAppointments, d.cancelledAppointments]}
                        colors={["#ffc107", "#20c997", "#198754", "#dc3545"]}
                        title="Appointment History"
                    />
                </div>
                <div className="col-lg-5 mb-4">
                    <div className="ms-card h-100" style={{ display: "flex", flexDirection: "column" }}>
                        <div className="ms-card-header">Quick Actions</div>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                            <Link to="/patient/book" style={{
                                display: "flex", alignItems: "center", gap: 14, padding: "14px",
                                background: "linear-gradient(135deg, #0d6efd, #0a58ca)",
                                borderRadius: 12, textDecoration: "none", color: "#fff"
                            }}>
                                <div style={{ fontSize: 24 }}>📅</div>
                                <div>
                                    <div style={{ fontWeight: 700 }}>Book Appointment</div>
                                    <div style={{ fontSize: 11, opacity: 0.8 }}>Schedule with a doctor</div>
                                </div>
                            </Link>
                            <Link to="/patient/appointments" style={{
                                display: "flex", alignItems: "center", gap: 14, padding: "14px",
                                background: "linear-gradient(135deg, #20c997, #17a589)",
                                borderRadius: 12, textDecoration: "none", color: "#fff"
                            }}>
                                <div style={{ fontSize: 24 }}>📋</div>
                                <div>
                                    <div style={{ fontWeight: 700 }}>My Appointments</div>
                                    <div style={{ fontSize: 11, opacity: 0.8 }}>View all bookings</div>
                                </div>
                            </Link>
                            <Link to="/patient/medical-history" style={{
                                display: "flex", alignItems: "center", gap: 14, padding: "14px",
                                background: "linear-gradient(135deg, #e11d48, #be123c)",
                                borderRadius: 12, textDecoration: "none", color: "#fff"
                            }}>
                                <div style={{ fontSize: 24 }}>❤️</div>
                                <div>
                                    <div style={{ fontWeight: 700 }}>Medical History</div>
                                    <div style={{ fontSize: 11, opacity: 0.8 }}>View your health records</div>
                                </div>
                            </Link>
                            <Link to="/patient/notifications" style={{
                                display: "flex", alignItems: "center", gap: 14, padding: "14px",
                                background: d.unreadNotifications > 0
                                    ? "linear-gradient(135deg, #f59e0b, #d97706)"
                                    : "linear-gradient(135deg, #6f42c1, #5a329a)",
                                borderRadius: 12, textDecoration: "none", color: "#fff"
                            }}>
                                <div style={{ fontSize: 24 }}>🔔</div>
                                <div>
                                    <div style={{ fontWeight: 700 }}>
                                        Notifications
                                        {d.unreadNotifications > 0 && (
                                            <span style={{
                                                marginLeft: 8,
                                                background: "#fff",
                                                color: "#d97706",
                                                borderRadius: 12,
                                                fontSize: 11,
                                                padding: "1px 8px",
                                                fontWeight: 800
                                            }}>{d.unreadNotifications} new</span>
                                        )}
                                    </div>
                                    <div style={{ fontSize: 11, opacity: 0.8 }}>View your alerts</div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="row">
                <div className="col-12 mb-4">
                    <div className="ms-card">
                        <div className="ms-card-header">📊 Health Summary</div>
                        <div className="row g-3 mt-1">
                            {[
                                { label: "Total Appointments",  value: d.totalAppointments,    icon: "📅", color: "#0d6efd" },
                                { label: "Upcoming (Approved)", value: d.approvedAppointments,  icon: "✅", color: "#20c997" },
                                { label: "Completed Visits",    value: d.completedAppointments, icon: "🏥", color: "#198754" },
                                { label: "Prescriptions",       value: d.totalPrescriptions,    icon: "💊", color: "#6f42c1" },
                                { label: "Unread Alerts",       value: d.unreadNotifications,   icon: "🔔", color: "#f59e0b" },
                            ].map(item => (
                                <div key={item.label} className="col-md">
                                    <div style={{
                                        background: "var(--surface-2,#f8faff)",
                                        borderRadius: 12, padding: "14px 16px",
                                        border: "1px solid var(--border-color,#e5eaf3)",
                                        textAlign: "center"
                                    }}>
                                        <div style={{ fontSize: 24, marginBottom: 4 }}>{item.icon}</div>
                                        <div style={{ fontSize: 22, fontWeight: 800, color: item.color }}>{item.value || 0}</div>
                                        <div style={{ fontSize: 12, color: "var(--gray-500)", marginTop: 2 }}>{item.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </PatientLayout>
    );
}

export default PatientDashboard;
