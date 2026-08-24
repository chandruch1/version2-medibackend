import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import DashboardCard from "../../components/dashboard/DashboardCard";
import { AppointmentDonutChart, StatsBarChart } from "../../components/dashboard/AppointmentChart";
import Loader from "../../components/common/Loader";
import { getDashboardData, getMonthlyAppointments } from "../../services/dashboardService";
import {
    FaUserMd, FaUsers, FaCalendarCheck, FaHourglass,
    FaCheckCircle, FaTimesCircle, FaBan, FaThumbsUp
} from "react-icons/fa";

function AdminDashboard() {
    const [data,    setData]    = useState(null);
    const [monthly, setMonthly] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([getDashboardData(), getMonthlyAppointments()])
            .then(([dash, mon]) => {
                setData(dash);
                setMonthly(mon);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <AdminLayout title="Dashboard"><Loader text="Loading dashboard..." /></AdminLayout>;
    }

    const d = data || {};
    const monthLabels = monthly ? Object.keys(monthly) : [];
    const monthValues = monthly ? Object.values(monthly) : [];

    return (
        <AdminLayout title="Dashboard" subtitle="Welcome back! Here's what's happening today.">
            {/* Stat Cards */}
            <div className="row mb-2">
                <DashboardCard title="Total Doctors"      value={d.totalDoctors}          icon={<FaUserMd />}         colorClass="blue" />
                <DashboardCard title="Total Patients"     value={d.totalPatients}          icon={<FaUsers />}          colorClass="teal" />
                <DashboardCard title="Total Appointments" value={d.totalAppointments}      icon={<FaCalendarCheck />}  colorClass="orange" />
                <DashboardCard title="Pending"            value={d.pendingAppointments}    icon={<FaHourglass />}      colorClass="purple" />
                <DashboardCard title="Approved"           value={d.approvedAppointments}   icon={<FaThumbsUp />}       colorClass="teal" />
                <DashboardCard title="Completed"          value={d.completedAppointments}  icon={<FaCheckCircle />}    colorClass="green" />
                <DashboardCard title="Rejected"           value={d.rejectedAppointments}   icon={<FaTimesCircle />}    colorClass="red" />
                <DashboardCard title="Cancelled"          value={d.cancelledAppointments}  icon={<FaBan />}            colorClass="red" />
            </div>

            {/* Charts */}
            <div className="row">
                <div className="col-lg-5 mb-4">
                    <AppointmentDonutChart
                        d={[
                            d.pendingAppointments,
                            d.approvedAppointments,
                            d.completedAppointments,
                            d.rejectedAppointments,
                            d.cancelledAppointments
                        ]}
                        labels={["Pending", "Approved", "Completed", "Rejected", "Cancelled"]}
                        colors={["#ffc107", "#20c997", "#198754", "#dc3545", "#6c757d"]}
                        title="Appointment Status Overview"
                    />
                </div>
                <div className="col-lg-7 mb-4">
                    <StatsBarChart
                        labels={monthLabels}
                        values={monthValues}
                        colors={monthLabels.map(() => "#0d6efd")}
                        title={`Appointments per Month (${new Date().getFullYear()})`}
                    />
                </div>
            </div>

            {/* Summary Row */}
            <div className="row">
                <div className="col-md-6 mb-4">
                    <div className="ms-card h-100">
                        <div className="ms-card-header">📊 Overview Summary</div>
                        {[
                            { label: "Total Doctors",      value: d.totalDoctors,         color: "#0d6efd" },
                            { label: "Total Patients",     value: d.totalPatients,         color: "#20c997" },
                            { label: "All Appointments",   value: d.totalAppointments,     color: "#fd7e14" },
                            { label: "Pending",            value: d.pendingAppointments,   color: "#ffc107" },
                            { label: "Approved",           value: d.approvedAppointments,  color: "#20c997" },
                            { label: "Completed",          value: d.completedAppointments, color: "#198754" },
                            { label: "Rejected",           value: d.rejectedAppointments,  color: "#dc3545" },
                            { label: "Cancelled",          value: d.cancelledAppointments, color: "#6c757d" },
                        ].map(row => (
                            <div key={row.label} style={{
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                padding: "10px 0", borderBottom: "1px solid var(--border-color)"
                            }}>
                                <span style={{ fontSize: 14, color: "var(--gray-600)" }}>{row.label}</span>
                                <span style={{ fontWeight: 700, fontSize: 18, color: row.color }}>{row.value || 0}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-md-6 mb-4">
                    <div className="ms-card h-100">
                        <div className="ms-card-header">📅 This Year's Monthly Trend</div>
                        <div style={{ padding: "8px 0" }}>
                            {monthLabels.map((m, i) => {
                                const val = monthValues[i] || 0;
                                const max = Math.max(...monthValues, 1);
                                const pct = Math.round((val / max) * 100);
                                return (
                                    <div key={m} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                                        <div style={{ width: 30, fontSize: 12, color: "var(--gray-500)", flexShrink: 0 }}>{m}</div>
                                        <div style={{ flex: 1, background: "var(--surface-2,#f8faff)", borderRadius: 6, height: 16, overflow: "hidden" }}>
                                            <div style={{
                                                width: `${pct}%`, height: "100%",
                                                background: "linear-gradient(90deg,#0d6efd,#6ea8fe)",
                                                borderRadius: 6,
                                                transition: "width 0.5s ease"
                                            }} />
                                        </div>
                                        <div style={{ width: 24, fontSize: 12, fontWeight: 700, color: "#0d6efd", textAlign: "right" }}>{val}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default AdminDashboard;