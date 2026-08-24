import api from "../api/api";

export const getMyNotifications = async () => {
    const response = await api.get("/notifications/my");
    return response.data;
};

export const getDoctorNotifications = async () => {
    const response = await api.get("/notifications/doctor");
    return response.data;
};

export const getAllNotifications = async () => {
    const response = await api.get("/notifications");
    return response.data;
};

export const markAsRead = async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
};

export const markAllReadPatient = async () => {
    const response = await api.put("/notifications/read-all");
    return response.data;
};

export const markAllReadDoctor = async () => {
    const response = await api.put("/notifications/doctor/read-all");
    return response.data;
};

export const deleteNotification = async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
};
