import { FaBell } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";

function TopNavbar({ title, subtitle }) {
    const { username, role } = useAuth();

    // Build initials from username
    const initials = username
        ? username.slice(0, 2).toUpperCase()
        : "MS";

    const roleName = role ? role.replace("ROLE_", "") : "";

    return (
        <nav className="ms-topnav">
            {/* Left: Page Title */}
            <div className="ms-topnav-left">
                <h5>{title || "Dashboard"}</h5>
                {subtitle && <p>{subtitle}</p>}
            </div>

            {/* Right: User info */}
            <div className="ms-topnav-right">
                <button
                    className="btn p-0 border-0"
                    style={{ color: "var(--gray-500)", fontSize: "18px" }}
                    title="Notifications"
                >
                    <FaBell />
                </button>

                <span className={`ms-role-badge ${roleName.toLowerCase()}`}>
                    {roleName}
                </span>

                <div style={{ lineHeight: 1.2, textAlign: "right" }}>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--gray-900)" }}>
                        {username || "User"}
                    </div>
                </div>

                <div className="ms-avatar" title={username}>
                    {initials}
                </div>
            </div>
        </nav>
    );
}

export default TopNavbar;