import api from "../api/api";

// ── Admin Dashboard ────────────────────────────────────────────────────────────
export const getDashboardData = async () => {
    const response = await api.get("/dashboard");
    return response.data;
    // { totalDoctors, totalPatients, totalAppointments, bookedAppointments, completedAppointments, cancelledAppointments }
};

// ── Admin Dashboard: Monthly Chart ────────────────────────────────────────────
export const getMonthlyAppointments = async () => {
    const response = await api.get("/dashboard/monthly");
    return response.data;
    // { Jan: 5, Feb: 12, Mar: 8, ... }
};

// ── Doctor Dashboard ──────────────────────────────────────────────────────────
export const getDoctorDashboard = async () => {
    const response = await api.get("/doctors/dashboard");
    return response.data;
    // { totalAppointments, pendingAppointments, approvedAppointments, completedAppointments, rejectedAppointments, todayAppointments, averageRating, totalReviews }
};

// ── Patient Dashboard ─────────────────────────────────────────────────────────
export const getPatientDashboard = async () => {
    const response = await api.get("/patients/dashboard");
    return response.data;
    // { totalAppointments, pendingAppointments, approvedAppointments, completedAppointments, cancelledAppointments, totalPrescriptions, unreadNotifications }
};