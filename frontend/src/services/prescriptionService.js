import api from "../api/api";

// ── Doctor: Add Prescription ──────────────────────────────────────────────────
export const addPrescription = async (data) => {
    // data: { appointmentId, medicine, dosage, duration, notes }
    const response = await api.post("/prescriptions", data);
    return response.data;
};

// ── Doctor: Update Prescription ───────────────────────────────────────────────
export const updatePrescription = async (id, data) => {
    const response = await api.put(`/prescriptions/${id}`, data);
    return response.data;
};

// ── Admin: Get All Prescriptions ──────────────────────────────────────────────
export const getAllPrescriptions = async () => {
    const response = await api.get("/prescriptions");
    return response.data;
};

// ── Admin/Doctor: Get Prescription By ID ─────────────────────────────────────
export const getPrescription = async (id) => {
    const response = await api.get(`/prescriptions/${id}`);
    return response.data;
};

// ── Patient: My Prescriptions ─────────────────────────────────────────────────
export const getMyPrescriptions = async () => {
    const response = await api.get("/prescriptions/my");
    return response.data;
};

// ── Admin: Delete Prescription ────────────────────────────────────────────────
export const deletePrescription = async (id) => {
    const response = await api.delete(`/prescriptions/${id}`);
    return response.data;
};
