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
    FaFileMedical
} from "react-icons/fa";
import useAuth from "../../hooks/useAuth";

function AdminSidebar() {
    const { logout, username } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="ms-sidebar">
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
            </div>

            {/* Navigation */}
            <ul className="ms-sidebar-nav">
                <li className="ms-sidebar-section-label">Main Menu</li>

                <li className="ms-sidebar-item">
                    <NavLink to="/admin/dashboard" className={({ isActive }) =>
                        `ms-sidebar-link ${isActive ? "active" : ""}`
                    }>
                        <FaTachometerAlt />
                        Dashboard
                    </NavLink>
                </li>

                <li className="ms-sidebar-item">
                    <NavLink to="/admin/doctors" className={({ isActive }) =>
                        `ms-sidebar-link ${isActive ? "active" : ""}`
                    }>
                        <FaUserMd />
                        Doctors
                    </NavLink>
                </li>

                <li className="ms-sidebar-item">
                    <NavLink to="/admin/patients" className={({ isActive }) =>
                        `ms-sidebar-link ${isActive ? "active" : ""}`
                    }>
                        <FaUsers />
                        Patients
                    </NavLink>
                </li>

                <li className="ms-sidebar-item">
                    <NavLink to="/admin/appointments" className={({ isActive }) =>
                        `ms-sidebar-link ${isActive ? "active" : ""}`
                    }>
                        <FaCalendarCheck />
                        Appointments
                    </NavLink>
                </li>

                <li className="ms-sidebar-item">
                    <NavLink to="/admin/prescriptions" className={({ isActive }) =>
                        `ms-sidebar-link ${isActive ? "active" : ""}`
                    }>
                        <FaFileMedical />
                        Prescriptions
                    </NavLink>
                </li>

                <li className="ms-sidebar-section-label" style={{ marginTop: "8px" }}>Modules</li>

                <li className="ms-sidebar-item">
                    <NavLink to="/admin/medical-histories" className={({ isActive }) =>
                        `ms-sidebar-link ${isActive ? "active" : ""}`
                    }>
                        <FaHeartbeat />
                        Medical Histories
                    </NavLink>
                </li>

                <li className="ms-sidebar-item">
                    <NavLink to="/admin/leaves" className={({ isActive }) =>
                        `ms-sidebar-link ${isActive ? "active" : ""}`
                    }>
                        <FaCalendarTimes />
                        Doctor Leaves
                    </NavLink>
                </li>

                <li className="ms-sidebar-item">
                    <NavLink to="/admin/feedback" className={({ isActive }) =>
                        `ms-sidebar-link ${isActive ? "active" : ""}`
                    }>
                        <FaStar />
                        Feedback
                    </NavLink>
                </li>

                <li className="ms-sidebar-item">
                    <NavLink to="/admin/notifications" className={({ isActive }) =>
                        `ms-sidebar-link ${isActive ? "active" : ""}`
                    }>
                        <FaBell />
                        Notifications
                    </NavLink>
                </li>

                <li className="ms-sidebar-section-label" style={{ marginTop: "8px" }}>Account</li>

                <li className="ms-sidebar-item">
                    <NavLink to="/admin/profile" className={({ isActive }) =>
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
    );
}

export default AdminSidebar;