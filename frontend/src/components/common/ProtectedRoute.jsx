import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

/**
 * ProtectedRoute — guards a route behind authentication.
 * Optionally restricts to a specific role.
 *
 * Props:
 *   children  — the protected page component
 *   role      — (optional) "ADMIN" | "DOCTOR" | "PATIENT"
 */
function ProtectedRoute({ children, role }) {
    const { isLoggedIn, role: userRole } = useAuth();

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    if (role && userRole !== role) {
        // Logged in but wrong role — redirect to their own dashboard
        if (userRole === "ADMIN")   return <Navigate to="/admin/dashboard" replace />;
        if (userRole === "DOCTOR")  return <Navigate to="/doctor/dashboard" replace />;
        if (userRole === "PATIENT") return <Navigate to="/patient/dashboard" replace />;
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;