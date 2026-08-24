import api from "../api/api";

// ── Admin: CRUD ───────────────────────────────────────────────────────────────
export const getDoctors = async () => {
    const response = await api.get("/doctors");
    return response.data;
};

export const getDoctorsPage = async (page, size) => {
    const response = await api.get(`/doctors/page?page=${page}&size=${size}`);
    return response.data;
};

export const addDoctor = async (doctor) => {
    const response = await api.post("/doctors", doctor);
    return response.data;
};

export const updateDoctor = async (id, doctor) => {
    const response = await api.put(`/doctors/${id}`, doctor);
    return response.data;
};

export const deleteDoctor = async (id) => {
    const response = await api.delete(`/doctors/${id}`);
    return response.data;
};

// ── Admin: Search ─────────────────────────────────────────────────────────────
export const searchDoctors = async (name) => {
    if (!name.trim()) return getDoctors();
    const response = await api.get(`/doctors/search/name?name=${name}`);
    return response.data;
};

export const searchDoctorBySpecialization = async (spec) => {
    const response = await api.get(`/doctors/search/specialization?specialization=${spec}`);
    return response.data;
};

// ── Patient: Available Doctors ────────────────────────────────────────────────
export const getAvailableDoctors = async () => {
    const response = await api.get("/doctors/available");
    return response.data;
};

// ── Doctor: Own Profile ───────────────────────────────────────────────────────
export const getDoctorProfile = async () => {
    const response = await api.get("/doctors/profile");
    return response.data;
};

export const updateDoctorProfile = async (profileData) => {
    const response = await api.put("/doctors/profile", profileData);
    return response.data;
};

export const changeDoctorPassword = async (passwordData) => {
    const response = await api.put("/doctors/change-password", passwordData);
    return response.data;
};
