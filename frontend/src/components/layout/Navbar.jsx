import { FaBell, FaBars } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";

function TopNavbar({ title, subtitle, onMenuToggle }) {
    const { username, role } = useAuth();

    // Build initials from username
    const initials = username
        ? username.slice(0, 2).toUpperCase()
        : "MS";

    const roleName = role ? role.replace("ROLE_", "") : "";

    return (
        <nav className="ms-topnav">
            {/* Left: Hamburger (mobile) + Page Title */}
            <div className="ms-topnav-left" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button
                    className="ms-hamburger-btn"
                    onClick={onMenuToggle}
                    aria-label="Toggle sidebar menu"
                >
                    <FaBars />
                </button>
                <div>
                    <h5>{title || "Dashboard"}</h5>
                    {subtitle && <p>{subtitle}</p>}
                </div>
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

                <div className="ms-topnav-username">
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