import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import { getToken, removeToken } from "../utils/token";
import { toast } from "react-toastify";

const api = axios.create({
    baseURL: API_BASE_URL,
});

// ── Request Interceptor: Attach JWT Token ────────────────────────────────────
api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ── Response Interceptor: Handle Errors Globally ────────────────────────────
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const status = error.response.status;

            if (status === 401) {
                // Unauthorized — clear storage and redirect to login
                removeToken();
                window.location.href = "/login";
            } else if (status === 500) {
                toast.error("Internal server error. Please try again.");
            } else if (status === 403) {
                toast.error("Access forbidden. You don't have permission.");
            }
        } else if (error.request) {
            toast.error("Cannot connect to the server. Check your connection.");
        }

        return Promise.reject(error);
    }
);

export default api;