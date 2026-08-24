import { createContext, useContext, useState } from "react";
import { getToken, getRole, getUsername, removeToken, saveToken, saveRole, saveUsername, saveUserData, getUserData } from "../utils/token";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken]     = useState(getToken);
    const [role, setRole]       = useState(getRole);
    const [username, setUsername] = useState(getUsername);
    const [userData, setUserDataState] = useState(getUserData);

    /** Called after a successful login */
    const login = ({ token, role, username, userData }) => {
        saveToken(token);
        saveRole(role);
        saveUsername(username);
        if (userData) saveUserData(userData);

        setToken(token);
        setRole(role);
        setUsername(username);
        if (userData) setUserDataState(userData);
    };

    /** Called on logout */
    const logout = () => {
        removeToken();
        setToken(null);
        setRole(null);
        setUsername(null);
        setUserDataState(null);
    };

    const isLoggedIn = !!token;

    return (
        <AuthContext.Provider value={{ token, role, username, userData, isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    return useContext(AuthContext);
}

export default AuthContext;
