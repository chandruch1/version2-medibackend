import api from "../api/api";

export const submitFeedback = async (data) => {
    const response = await api.post("/feedback", data);
    return response.data;
};

export const getMyFeedbacks = async () => {
    const response = await api.get("/feedback/my");
    return response.data;
};

export const getDoctorFeedbacks = async () => {
    const response = await api.get("/feedback/doctor");
    return response.data;
};

export const getAllFeedbacks = async () => {
    const response = await api.get("/feedback");
    return response.data;
};
