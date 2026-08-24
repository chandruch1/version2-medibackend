import api from "../api/api";

// ── Admin Login ───────────────────────────────────────────────────────────────
export const login = async (loginData) => {
    const response = await api.post("/auth/login", loginData);
    return response.data; // { token, message }
};

// ── Doctor Login ──────────────────────────────────────────────────────────────
export const loginDoctor = async (loginData) => {
    const response = await api.post("/doctors/login", loginData);
    return response.data; // { token, doctorName, email, specialization, role }
};

// ── Patient Login ─────────────────────────────────────────────────────────────
export const loginPatient = async (loginData) => {
    const response = await api.post("/patients/login", loginData);
    return response.data; // { token, patientName, email, role }
};