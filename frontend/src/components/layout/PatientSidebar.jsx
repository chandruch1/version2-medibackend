import { NavLink, useNavigate } from "react-router-dom";
import {
    FaTachometerAlt,
    FaCalendarPlus,
    FaCalendarCheck,
    FaSignOutAlt,
    FaHospital,
    FaUser,
    FaLock,
    FaHeartbeat,
    FaStar,
    FaBell,
    FaTimes,
    FaFileMedical
} from "react-icons/fa";
import useAuth from "../../hooks/useAuth";

function PatientSidebar({ isOpen, onClose }) {
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

            <div className={`ms-sidebar patient-sidebar ${isOpen ? "ms-sidebar-open" : ""}`}>
                {/* Brand */}
                <div className="ms-sidebar-brand">
                    <div className="ms-sidebar-brand-logo">
                        <div className="ms-sidebar-brand-icon">
                            <FaHospital />
                        </div>
                        <div>
                            <div className="ms-sidebar-brand-text">MediSphere</div>
                            <div className="ms-sidebar-brand-subtitle">Patient Portal</div>
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
                        <NavLink to="/patient/dashboard" onClick={handleLinkClick} className={({ isActive }) =>
                            `ms-sidebar-link ${isActive ? "active" : ""}`
                        }>
                            <FaTachometerAlt />
                            Dashboard
                        </NavLink>
                    </li>

                    <li className="ms-sidebar-item">
                        <NavLink to="/patient/book" onClick={handleLinkClick} className={({ isActive }) =>
                            `ms-sidebar-link ${isActive ? "active" : ""}`
                        }>
                            <FaCalendarPlus />
                            Book Appointment
                        </NavLink>
                    </li>

                    <li className="ms-sidebar-item">
                        <NavLink to="/patient/appointments" onClick={handleLinkClick} className={({ isActive }) =>
                            `ms-sidebar-link ${isActive ? "active" : ""}`
                        }>
                            <FaCalendarCheck />
                            My Appointments
                        </NavLink>
                    </li>

                    <li className="ms-sidebar-section-label" style={{ marginTop: "8px" }}>Health</li>

                    <li className="ms-sidebar-item">
                        <NavLink to="/patient/medical-history" onClick={handleLinkClick} className={({ isActive }) =>
                            `ms-sidebar-link ${isActive ? "active" : ""}`
                        }>
                            <FaHeartbeat />
                            Medical History
                        </NavLink>
                    </li>

                    <li className="ms-sidebar-item">
                        <NavLink to="/patient/prescriptions" onClick={handleLinkClick} className={({ isActive }) =>
                            `ms-sidebar-link ${isActive ? "active" : ""}`
                        }>
                            <FaFileMedical />
                            Prescriptions
                        </NavLink>
                    </li>

                    <li className="ms-sidebar-item">
                        <NavLink to="/patient/feedback" onClick={handleLinkClick} className={({ isActive }) =>
                            `ms-sidebar-link ${isActive ? "active" : ""}`
                        }>
                            <FaStar />
                            Feedback
                        </NavLink>
                    </li>

                    <li className="ms-sidebar-item">
                        <NavLink to="/patient/notifications" onClick={handleLinkClick} className={({ isActive }) =>
                            `ms-sidebar-link ${isActive ? "active" : ""}`
                        }>
                            <FaBell />
                            Notifications
                        </NavLink>
                    </li>

                    <li className="ms-sidebar-section-label" style={{ marginTop: "8px" }}>Account</li>

                    <li className="ms-sidebar-item">
                        <NavLink to="/patient/profile" onClick={handleLinkClick} className={({ isActive }) =>
                            `ms-sidebar-link ${isActive ? "active" : ""}`
                        }>
                            <FaUser />
                            Profile
                        </NavLink>
                    </li>

                    <li className="ms-sidebar-item">
                        <NavLink to="/patient/change-password" onClick={handleLinkClick} className={({ isActive }) =>
                            `ms-sidebar-link ${isActive ? "active" : ""}`
                        }>
                            <FaLock />
                            Change Password
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

export default PatientSidebar;
