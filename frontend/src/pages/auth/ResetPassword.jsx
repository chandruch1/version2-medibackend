import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";
import { resetPassword } from "../../services/patientService";

function ResetPassword() {
    const navigate  = useNavigate();
    const location  = useLocation();
    const email     = location.state?.email || "";

    const [form, setForm]       = useState({ newPassword: "", confirmPassword: "" });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.newPassword !== form.confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }
        setLoading(true);
        try {
            await resetPassword({ email, newPassword: form.newPassword });
            toast.success("Password reset successfully! Please login.");
            navigate("/login");
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data || "Reset failed.";
            toast.error(typeof msg === "string" ? msg : "Reset failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #0f1623 0%, #1a2744 60%, #0d6efd 100%)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 20
        }}>
            <div style={{
                background: "#fff", borderRadius: 24, padding: "44px 40px",
                width: "100%", maxWidth: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                textAlign: "center"
            }}>
                <div style={{
                    width: 64, height: 64, borderRadius: 20, margin: "0 auto 20px",
                    background: "linear-gradient(135deg, #0d6efd, #6f42c1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 26, color: "#fff"
                }}>
                    <FaLock />
                </div>

                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Reset Password</h2>
                <p style={{ color: "var(--gray-500)", fontSize: 14, marginBottom: 28 }}>
                    Create a new strong password for <strong>{email}</strong>
                </p>

                <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
                    {/* New Password */}
                    <div className="ms-form-group">
                        <label className="ms-form-label">New Password</label>
                        <div style={{ position: "relative" }}>
                            <input
                                type={showPass ? "text" : "password"}
                                className="ms-form-control"
                                value={form.newPassword}
                                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                                placeholder="Min. 6 characters"
                                style={{ paddingRight: 40 }}
                                required minLength={6}
                            />
                            <button type="button" onClick={() => setShowPass(!showPass)}
                                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                                    background: "none", border: "none", cursor: "pointer",
                                    color: "var(--gray-400)", fontSize: 15 }}>
                                {showPass ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="ms-form-group">
                        <label className="ms-form-label">Confirm Password</label>
                        <input
                            type="password" className="ms-form-control"
                            value={form.confirmPassword}
                            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                            placeholder="Repeat password" required
                        />
                        {form.confirmPassword && form.newPassword === form.confirmPassword && (
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6,
                                color: "#198754", fontSize: 13 }}>
                                <FaCheckCircle /> Passwords match
                            </div>
                        )}
                    </div>

                    <button type="submit" disabled={loading}
                        className="ms-btn ms-btn-primary w-100 mt-2"
                        style={{ justifyContent: "center" }}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>

                <p style={{ marginTop: 20, fontSize: 14, color: "var(--gray-500)" }}>
                    <Link to="/login" style={{ color: "#0d6efd", fontWeight: 600 }}>← Back to Login</Link>
                </p>
            </div>
        </div>
    );
}

export default ResetPassword;
