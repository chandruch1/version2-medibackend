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
    FaBell,
    FaTimes
} from "react-icons/fa";
import useAuth from "../../hooks/useAuth";

function DoctorSidebar({ isOpen, onClose }) {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleLinkClick = () => {
        if (onClose) onClose();
    };

    return (
        <>
            {/* Mobile overlay backdrop */}
            {isOpen && (
                <div className="ms-sidebar-overlay" onClick={onClose} />
            )}

            <div className={`ms-sidebar doctor-sidebar ${isOpen ? "ms-sidebar-open" : ""}`}>
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
                    <button className="ms-sidebar-close-btn" onClick={onClose} aria-label="Close sidebar">
                        <FaTimes />
                    </button>
                </div>

                {/* Navigation */}
                <ul className="ms-sidebar-nav">
                    <li className="ms-sidebar-section-label">Main Menu</li>

                    <li className="ms-sidebar-item">
                        <NavLink to="/doctor/dashboard" onClick={handleLinkClick} className={({ isActive }) =>
                            `ms-sidebar-link ${isActive ? "active" : ""}`
                        }>
                            <FaTachometerAlt />
                            Dashboard
                        </NavLink>
                    </li>

                    <li className="ms-sidebar-item">
                        <NavLink to="/doctor/appointments" onClick={handleLinkClick} className={({ isActive }) =>
                            `ms-sidebar-link ${isActive ? "active" : ""}`
                        }>
                            <FaCalendarCheck />
                            Appointments
                        </NavLink>
                    </li>

                    <li className="ms-sidebar-item">
                        <NavLink to="/doctor/prescriptions" onClick={handleLinkClick} className={({ isActive }) =>
                            `ms-sidebar-link ${isActive ? "active" : ""}`
                        }>
                            <FaFileMedical />
                            Prescriptions
                        </NavLink>
                    </li>

                    <li className="ms-sidebar-item">
                        <NavLink to="/doctor/leave" onClick={handleLinkClick} className={({ isActive }) =>
                            `ms-sidebar-link ${isActive ? "active" : ""}`
                        }>
                            <FaCalendarTimes />
                            Leave
                        </NavLink>
                    </li>

                    <li className="ms-sidebar-item">
                        <NavLink to="/doctor/feedback" onClick={handleLinkClick} className={({ isActive }) =>
                            `ms-sidebar-link ${isActive ? "active" : ""}`
                        }>
                            <FaStar />
                            Feedback
                        </NavLink>
                    </li>

                    <li className="ms-sidebar-item">
                        <NavLink to="/doctor/notifications" onClick={handleLinkClick} className={({ isActive }) =>
                            `ms-sidebar-link ${isActive ? "active" : ""}`
                        }>
                            <FaBell />
                            Notifications
                        </NavLink>
                    </li>

                    <li className="ms-sidebar-section-label" style={{ marginTop: "8px" }}>Account</li>

                    <li className="ms-sidebar-item">
                        <NavLink to="/doctor/profile" onClick={handleLinkClick} className={({ isActive }) =>
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
        </>
    );
}

export default DoctorSidebar;
