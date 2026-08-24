import { NavLink, useNavigate } from "react-router-dom";
import {
    FaTachometerAlt,
    FaCalendarCheck,
    FaFileMedical,
    FaSignOutAlt,
    FaHospital,
    FaUserMd,
    FaCalendarTimes,
    FaStar,
    FaBell
} from "react-icons/fa";
import useAuth from "../../hooks/useAuth";

function DoctorSidebar() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="ms-sidebar doctor-sidebar">
            {/* Brand */}
            <div className="ms-sidebar-brand">
                <div className="ms-sidebar-brand-logo">
                    <div className="ms-sidebar-brand-icon">
                        <FaHospital />
                    </div>
                    <div>
                        <div className="ms-sidebar-brand-text">MediSphere</div>
                        <div className="ms-sidebar-brand-subtitle">Doctor Portal</div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <ul className="ms-sidebar-nav">
                <li className="ms-sidebar-section-label">Main Menu</li>

                <li className="ms-sidebar-item">
                    <NavLink to="/doctor/dashboard" className={({ isActive }) =>
                        `ms-sidebar-link ${isActive ? "active" : ""}`
                    }>
                        <FaTachometerAlt />
                        Dashboard
                    </NavLink>
                </li>

                <li className="ms-sidebar-item">
                    <NavLink to="/doctor/appointments" className={({ isActive }) =>
                        `ms-sidebar-link ${isActive ? "active" : ""}`
                    }>
                        <FaCalendarCheck />
                        Appointments
                    </NavLink>
                </li>

                <li className="ms-sidebar-item">
                    <NavLink to="/doctor/prescriptions" className={({ isActive }) =>
                        `ms-sidebar-link ${isActive ? "active" : ""}`
                    }>
                        <FaFileMedical />
                        Prescriptions
                    </NavLink>
                </li>

                <li className="ms-sidebar-item">
                    <NavLink to="/doctor/leave" className={({ isActive }) =>
                        `ms-sidebar-link ${isActive ? "active" : ""}`
                    }>
                        <FaCalendarTimes />
                        Leave
                    </NavLink>
                </li>

                <li className="ms-sidebar-item">
                    <NavLink to="/doctor/feedback" className={({ isActive }) =>
                        `ms-sidebar-link ${isActive ? "active" : ""}`
                    }>
                        <FaStar />
                        Feedback
                    </NavLink>
                </li>

                <li className="ms-sidebar-item">
                    <NavLink to="/doctor/notifications" className={({ isActive }) =>
                        `ms-sidebar-link ${isActive ? "active" : ""}`
                    }>
                        <FaBell />
                        Notifications
                    </NavLink>
                </li>

                <li className="ms-sidebar-section-label" style={{ marginTop: "8px" }}>Account</li>

                <li className="ms-sidebar-item">
                    <NavLink to="/doctor/profile" className={({ isActive }) =>
                        `ms-sidebar-link ${isActive ? "active" : ""}`
                    }>
                        <FaUserMd />
                        Profile
                    </NavLink>
                </li>
            </ul>

            {/* Logout */}
            <div className="ms-sidebar-logout">
                <button
                    className="ms-sidebar-link w-100 border-0"
                    style={{ background: "rgba(220,53,69,0.1)", color: "#ef4444", cursor: "pointer" }}
                    onClick={handleLogout}
                >
                    <FaSignOutAlt />
                    Logout
                </button>
            </div>
        </div>
    );
}

export default DoctorSidebar;
