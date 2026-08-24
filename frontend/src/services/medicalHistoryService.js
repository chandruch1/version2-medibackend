import api from "../api/api";

export const saveMedicalHistory = async (data) => {
    const response = await api.post("/medical-history", data);
    return response.data;
};

export const getMyMedicalHistory = async () => {
    const response = await api.get("/medical-history/my");
    return response.data;
};

export const getPatientMedicalHistory = async (patientId) => {
    const response = await api.get(`/medical-history/patient/${patientId}`);
    return response.data;
};

export const getAllMedicalHistories = async () => {
    const response = await api.get("/medical-history");
    return response.data;
};

export const deleteMedicalHistory = async (id) => {
    const response = await api.delete(`/medical-history/${id}`);
    return response.data;
};
