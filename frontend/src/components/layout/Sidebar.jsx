import { NavLink, useNavigate } from "react-router-dom";
import {
    FaTachometerAlt,
    FaUserMd,
    FaUsers,
    FaCalendarCheck,
    FaSignOutAlt,
    FaHospital,
    FaUserShield,
    FaHeartbeat,
    FaCalendarTimes,
    FaStar,
    FaBell,
    FaFileMedical,
    FaTimes
} from "react-icons/fa";
import useAuth from "../../hooks/useAuth";

function AdminSidebar({ isOpen, onClose }) {
    const { logout, username } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleLinkClick = () => {
        // Close sidebar on mobile when a link is clicked
        if (onClose) onClose();
    };

    return (
        <>
            {/* Mobile overlay backdrop */}
            {isOpen && (
                <div className="ms-sidebar-overlay" onClick={onClose} />
            )}

            <div className={`ms-sidebar ${isOpen ? "ms-sidebar-open" : ""}`}>
                {/* Brand */}
                <div className="ms-sidebar-brand">
                    <div className="ms-sidebar-brand-logo">
                        <div className="ms-sidebar-brand-icon">
                            <FaHospital />
                        </div>
                        <div>
                            <div className="ms-sidebar-brand-text">MediSphere</div>
                            <div className="ms-sidebar-brand-subtitle">Admin Portal</div>
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
                        <NavLink to="/admin/dashboard" onClick={handleLinkClick} className={({ isActive }) =>
                            `ms-sidebar-link ${isActive ? "active" : ""}`
                        }>
                            <FaTachometerAlt />
                            Dashboard
                        </NavLink>
                    </li>

                    <li className="ms-sidebar-item">
                        <NavLink to="/admin/doctors" onClick={handleLinkClick} className={({ isActive }) =>
                            `ms-sidebar-link ${isActive ? "active" : ""}`
                        }>
                            <FaUserMd />
                            Doctors
                        </NavLink>
                    </li>

                    <li className="ms-sidebar-item">
                        <NavLink to="/admin/patients" onClick={handleLinkClick} className={({ isActive }) =>
                            `ms-sidebar-link ${isActive ? "active" : ""}`
                        }>
                            <FaUsers />
                            Patients
                        </NavLink>
                    </li>

                    <li className="ms-sidebar-item">
                        <NavLink to="/admin/appointments" onClick={handleLinkClick} className={({ isActive }) =>
                            `ms-sidebar-link ${isActive ? "active" : ""}`
                        }>
                            <FaCalendarCheck />
                            Appointments
                        </NavLink>
                    </li>

                    <li className="ms-sidebar-item">
                        <NavLink to="/admin/prescriptions" onClick={handleLinkClick} className={({ isActive }) =>
                            `ms-sidebar-link ${isActive ? "active" : ""}`
                        }>
                            <FaFileMedical />
                            Prescriptions
                        </NavLink>
                    </li>

                    <li className="ms-sidebar-section-label" style={{ marginTop: "8px" }}>Modules</li>

                    <li className="ms-sidebar-item">
                        <NavLink to="/admin/medical-histories" onClick={handleLinkClick} className={({ isActive }) =>
                            `ms-sidebar-link ${isActive ? "active" : ""}`
                        }>
                            <FaHeartbeat />
                            Medical Histories
                        </NavLink>
                    </li>

                    <li className="ms-sidebar-item">
                        <NavLink to="/admin/leaves" onClick={handleLinkClick} className={({ isActive }) =>
                            `ms-sidebar-link ${isActive ? "active" : ""}`
                        }>
                            <FaCalendarTimes />
                            Doctor Leaves
                        </NavLink>
                    </li>

                    <li className="ms-sidebar-item">
                        <NavLink to="/admin/feedback" onClick={handleLinkClick} className={({ isActive }) =>
                            `ms-sidebar-link ${isActive ? "active" : ""}`
                        }>
                            <FaStar />
                            Feedback
                        </NavLink>
                    </li>

                    <li className="ms-sidebar-item">
                        <NavLink to="/admin/notifications" onClick={handleLinkClick} className={({ isActive }) =>
                            `ms-sidebar-link ${isActive ? "active" : ""}`
                        }>
                            <FaBell />
                            Notifications
                        </NavLink>
                    </li>

                    <li className="ms-sidebar-section-label" style={{ marginTop: "8px" }}>Account</li>

                    <li className="ms-sidebar-item">
                        <NavLink to="/admin/profile" onClick={handleLinkClick} className={({ isActive }) =>
                            `ms-sidebar-link ${isActive ? "active" : ""}`
                        }>
                            <FaUserShield />
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

export default AdminSidebar;