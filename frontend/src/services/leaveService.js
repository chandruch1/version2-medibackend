import api from "../api/api";

export const applyLeave = async (data) => {
    const response = await api.post("/leaves", data);
    return response.data;
};

export const getMyLeaves = async () => {
    const response = await api.get("/leaves/my");
    return response.data;
};

export const getAllLeaves = async () => {
    const response = await api.get("/leaves");
    return response.data;
};

export const approveLeave = async (id) => {
    const response = await api.put(`/leaves/${id}/approve`);
    return response.data;
};

export const rejectLeave = async (id) => {
    const response = await api.put(`/leaves/${id}/reject`);
    return response.data;
};
