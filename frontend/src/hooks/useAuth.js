import { useAuthContext } from "../context/AuthContext";

/**
 * Hook for consuming auth state from AuthContext.
 * Returns: { isLoggedIn, role, username, userData, login, logout }
 */
function useAuth() {
    return useAuthContext();
}

export default useAuth;