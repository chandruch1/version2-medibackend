import api from "../api/api";

// ── Admin: All Appointments ───────────────────────────────────────────────────
export const getAppointments = async () => {
    const response = await api.get("/appointments");
    return response.data;
};

export const getAppointmentsPage = async (page, size) => {
    const response = await api.get(`/appointments/page?page=${page}&size=${size}`);
    return response.data;
};

// ── Admin: Book (create) Appointment ─────────────────────────────────────────
export const bookAppointment = async (appointment) => {
    const response = await api.post("/appointments", appointment);
    return response.data;
};

// ── Admin: Update Appointment ─────────────────────────────────────────────────
export const updateAppointment = async (id, appointment) => {
    const response = await api.put(`/appointments/${id}`, appointment);
    return response.data;
};

// ── Admin: Delete Appointment ─────────────────────────────────────────────────
export const deleteAppointment = async (id) => {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
};

// ── Admin: Complete / Cancel ──────────────────────────────────────────────────
export const completeAppointment = async (id) => {
    const response = await api.put(`/appointments/${id}/complete`);
    return response.data;
};

export const cancelAppointment = async (id) => {
    const response = await api.put(`/appointments/${id}/cancel`);
    return response.data;
};

// ── Admin: Search ─────────────────────────────────────────────────────────────
export const searchAppointmentByPatient = async (patientName) => {
    if (!patientName.trim()) return getAppointments();
    const response = await api.get(`/appointments/search/patient?patientName=${patientName}`);
    return response.data;
};

export const searchAppointmentByDoctor = async (doctorName) => {
    const response = await api.get(`/appointments/search/doctor?doctorName=${doctorName}`);
    return response.data;
};

export const searchAppointmentByDate = async (date) => {
    const response = await api.get(`/appointments/search/date?date=${date}`);
    return response.data;
};

// ── Doctor: Get My Appointments ───────────────────────────────────────────────
export const getMyAppointmentsDoctor = async () => {
    const response = await api.get("/appointments/my");
    return response.data;
};

// ── Doctor: Approve / Reject ──────────────────────────────────────────────────
export const approveAppointment = async (id) => {
    const response = await api.put(`/appointments/${id}/approve`);
    return response.data;
};

export const rejectAppointment = async (id) => {
    const response = await api.put(`/appointments/${id}/reject`);
    return response.data;
};

// ── Patient: Book Appointment ─────────────────────────────────────────────────
export const bookAppointmentPatient = async (appointmentData) => {
    const response = await api.post("/appointments/book", appointmentData);
    return response.data;
};

// ── Patient: Get My Appointments ──────────────────────────────────────────────
export const getMyAppointmentsPatient = async () => {
    const response = await api.get("/patients/appointments");
    return response.data;
};

// Alias used by patient feedback page
export const getMyAppointments = getMyAppointmentsPatient;

// ── Doctor: Search My Appointments ───────────────────────────────────────────
export const searchDoctorMyAppointments = async (keyword) => {
    const response = await api.get(`/appointments/my/search?keyword=${encodeURIComponent(keyword)}`);
    return response.data;
};