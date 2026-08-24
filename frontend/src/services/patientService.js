import api from "../api/api";

// ── Admin: CRUD ───────────────────────────────────────────────────────────────
export const getPatients = async () => {
    const response = await api.get("/patients");
    return response.data;
};

export const addPatient = async (patient) => {
    const response = await api.post("/patients", patient);
    return response.data;
};

export const updatePatient = async (id, patient) => {
    const response = await api.put(`/patients/${id}`, patient);
    return response.data;
};

export const deletePatient = async (id) => {
    const response = await api.delete(`/patients/${id}`);
    return response.data;
};

// ── Admin: Pagination & Search ────────────────────────────────────────────────
export const getPatientsPage = async (page, size) => {
    const response = await api.get(`/patients/page?page=${page}&size=${size}`);
    return response.data;
};

export const searchPatientByName = async (name) => {
    if (!name.trim()) return getPatients();
    const response = await api.get(`/patients/search/name?name=${name}`);
    return response.data;
};

export const searchPatientByDisease = async (disease) => {
    const response = await api.get(`/patients/search/disease?disease=${disease}`);
    return response.data;
};

// ── Patient: Registration ─────────────────────────────────────────────────────
export const registerPatient = async (data) => {
    const response = await api.post("/patients/register", data);
    return response.data;
};

// ── Patient: Profile ──────────────────────────────────────────────────────────
export const getPatientProfile = async () => {
    const response = await api.get("/patients/profile");
    return response.data;
};

export const updatePatientProfile = async (data) => {
    const response = await api.put("/patients/profile", data);
    return response.data;
};

export const changePatientPassword = async (data) => {
    const response = await api.put("/patients/change-password", data);
    return response.data;
};

// ── Patient: Forgot Password Flow ─────────────────────────────────────────────
export const forgotPassword = async (data) => {
    const response = await api.post("/patients/forgot-password", data);
    return response.data;
};

export const verifyOtp = async (data) => {
    const response = await api.post("/patients/verify-otp", data);
    return response.data;
};

export const resetPassword = async (data) => {
    const response = await api.post("/patients/reset-password", data);
    return response.data;
};