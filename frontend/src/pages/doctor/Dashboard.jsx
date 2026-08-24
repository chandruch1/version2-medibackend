import { useEffect, useState } from "react";
import DoctorLayout from "../../layouts/DoctorLayout";
import DashboardCard from "../../components/dashboard/DashboardCard";
import { AppointmentDonutChart } from "../../components/dashboard/AppointmentChart";
import Loader from "../../components/common/Loader";
import { getDoctorDashboard } from "../../services/dashboardService";
import {
    FaCalendarCheck, FaHourglass, FaTimesCircle, FaTasks, FaCalendarDay
} from "react-icons/fa";


function DoctorDashboard() {
    const [data,    setData]    = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDoctorDashboard()
            .then(setData)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <DoctorLayout title="Dashboard"><Loader text="Loading dashboard..." /></DoctorLayout>;
    }

    const d = data || {};
    const avgRating = d.averageRating || 0;
    const stars = Math.round(avgRating);

    return (
        <DoctorLayout title="Doctor Dashboard" subtitle="Your appointment overview and performance stats">
            {/* Stat Cards */}
            <div className="row mb-2">
                <DashboardCard title="Total Appointments"  value={d.totalAppointments}     icon={<FaCalendarCheck />} colorClass="blue" />
                <DashboardCard title="Today's"             value={d.todayAppointments}      icon={<FaCalendarDay />}   colorClass="orange" />
                <DashboardCard title="Pending"             value={d.pendingAppointments}    icon={<FaHourglass />}     colorClass="purple" />
                <DashboardCard title="Completed"           value={d.completedAppointments}  icon={<FaTasks />}         colorClass="green" />
                <DashboardCard title="Rejected"            value={d.rejectedAppointments}   icon={<FaTimesCircle />}   colorClass="red" />
            </div>

            {/* Rating Cards */}
            <div className="row mb-2">
                <div className="col-md-4 mb-3">
                    <div className="ms-card" style={{
                        background: "linear-gradient(135deg,#f59e0b,#d97706)",
                        color: "#fff"
                    }}>
                        <div style={{ fontSize: 12, opacity: 0.85, textTransform: "uppercase", letterSpacing: 1 }}>
                            Average Rating
                        </div>
                        <div style={{ fontSize: 36, fontWeight: 800, marginTop: 6 }}>
                            {avgRating > 0 ? avgRating.toFixed(1) : "N/A"}
                            {avgRating > 0 && <span style={{ fontSize: 22, marginLeft: 6 }}>⭐</span>}
                        </div>
                        <div style={{ fontSize: 13, marginTop: 4, opacity: 0.9 }}>
                            {"★".repeat(stars)}{"☆".repeat(5 - stars)}
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-3">
                    <div className="ms-card" style={{
                        background: "linear-gradient(135deg,#6366f1,#4338ca)",
                        color: "#fff"
                    }}>
                        <div style={{ fontSize: 12, opacity: 0.85, textTransform: "uppercase", letterSpacing: 1 }}>
                            Total Reviews
                        </div>
                        <div style={{ fontSize: 36, fontWeight: 800, marginTop: 6 }}>
                            {d.totalReviews || 0}
                        </div>
                        <div style={{ fontSize: 13, marginTop: 4, opacity: 0.9 }}>
                            Patient feedbacks received
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-3">
                    <div className="ms-card" style={{
                        background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
                        color: "#fff"
                    }}>
                        <div style={{ fontSize: 12, opacity: 0.85, textTransform: "uppercase", letterSpacing: 1 }}>
                            Today's Appointments
                        </div>
                        <div style={{ fontSize: 36, fontWeight: 800, marginTop: 6 }}>
                            {d.todayAppointments || 0}
                        </div>
                        <div style={{ fontSize: 13, marginTop: 4, opacity: 0.9 }}>
                            Scheduled for today
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart + Quick Summary */}
            <div className="row">
                <div className="col-lg-5 mb-4">
                    <AppointmentDonutChart
                        d={[
                            d.pendingAppointments,
                            d.approvedAppointments,
                            d.completedAppointments,
                            d.rejectedAppointments,
                        ]}
                        labels={["Pending", "Approved", "Completed", "Rejected"]}
                        colors={["#ffc107", "#20c997", "#198754", "#dc3545"]}
                        title="Appointment Breakdown"
                    />
                </div>
                <div className="col-lg-7 mb-4">
                    <div className="ms-card h-100" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <div className="ms-card-header">Quick Summary</div>
                        {[
                            { label: "Total Appointments",   value: d.totalAppointments,     color: "#0d6efd" },
                            { label: "Today's Appointments", value: d.todayAppointments,      color: "#0ea5e9" },
                            { label: "Pending Review",       value: d.pendingAppointments,    color: "#ffc107" },
                            { label: "Approved",             value: d.approvedAppointments,   color: "#20c997" },
                            { label: "Completed",            value: d.completedAppointments,  color: "#198754" },
                            { label: "Rejected",             value: d.rejectedAppointments,   color: "#dc3545" },
                            { label: "Avg Rating",           value: avgRating > 0 ? `${avgRating.toFixed(1)} ⭐` : "N/A", color: "#f59e0b" },
                            { label: "Total Reviews",        value: d.totalReviews || 0,      color: "#6366f1" },
                        ].map(row => (
                            <div key={row.label} style={{
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                padding: "10px 0", borderBottom: "1px solid var(--border-color)"
                            }}>
                                <span style={{ fontSize: 14, color: "var(--gray-600)" }}>{row.label}</span>
                                <span style={{
                                    fontWeight: 700, fontSize: 18, color: row.color,
                                    minWidth: 36, textAlign: "right"
                                }}>{row.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DoctorLayout>
    );
}

export default DoctorDashboard;
