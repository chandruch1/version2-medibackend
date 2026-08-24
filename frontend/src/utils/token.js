import { TOKEN_KEY, USERNAME_KEY, ROLE_KEY, USER_DATA_KEY } from "./constants";

// ── Token ────────────────────────────────────────────────────────────────────
export const saveToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

// ── Username ─────────────────────────────────────────────────────────────────
export const saveUsername = (username) => {
    localStorage.setItem(USERNAME_KEY, username);
};

export const getUsername = () => {
    return localStorage.getItem(USERNAME_KEY);
};

// ── Role ─────────────────────────────────────────────────────────────────────
export const saveRole = (role) => {
    localStorage.setItem(ROLE_KEY, role);
};

export const getRole = () => {
    return localStorage.getItem(ROLE_KEY);
};

// ── User Data (name, email, etc.) ─────────────────────────────────────────────
export const saveUserData = (data) => {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(data));
};

export const getUserData = () => {
    const raw = localStorage.getItem(USER_DATA_KEY);
    return raw ? JSON.parse(raw) : null;
};

// ── Auth Status ───────────────────────────────────────────────────────────────
export const isAuthenticated = () => {
    return !!getToken();
};

// ── Clear All ─────────────────────────────────────────────────────────────────
export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(USER_DATA_KEY);
};