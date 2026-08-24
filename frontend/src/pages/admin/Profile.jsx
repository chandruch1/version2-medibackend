import AdminLayout from "../../layouts/AdminLayout";
import useAuth from "../../hooks/useAuth";
import { FaUserShield, FaEnvelope, FaUser } from "react-icons/fa";

function AdminProfile() {
    const { username } = useAuth();

    return (
        <AdminLayout title="My Profile" subtitle="Your administrator account information">
            <div className="row justify-content-center">
                <div className="col-lg-6">
                    <div className="ms-card text-center">
                        {/* Avatar */}
                        <div className="ms-profile-avatar">
                            {username ? username.slice(0, 2).toUpperCase() : "AD"}
                        </div>
                        <h4 style={{ fontWeight: 700, marginBottom: 4 }}>{username || "Administrator"}</h4>
                        <span className="ms-role-badge admin" style={{ fontSize: 12 }}>Admin</span>

                        <hr style={{ margin: "24px 0" }} />

                        <div style={{ textAlign: "left" }}>
                            {[
                                { icon: <FaUser />, label: "Username", value: username || "admin" },
                                { icon: <FaEnvelope />, label: "Role",  value: "System Administrator" },
                                { icon: <FaUserShield />, label: "Access Level", value: "Full Access" },
                            ].map(item => (
                                <div key={item.label} style={{
                                    display: "flex", alignItems: "center", gap: 12,
                                    padding: "14px 0", borderBottom: "1px solid var(--border-color)"
                                }}>
                                    <div style={{ width: 36, height: 36, borderRadius: 8,
                                        background: "var(--primary-light)", color: "var(--primary)",
                                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 11, color: "var(--gray-500)", textTransform: "uppercase", letterSpacing: 0.5 }}>{item.label}</div>
                                        <div style={{ fontWeight: 600, fontSize: 14, color: "var(--gray-900)" }}>{item.value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default AdminProfile;
