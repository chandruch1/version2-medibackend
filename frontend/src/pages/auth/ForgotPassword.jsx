import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEnvelope, FaHospital, FaPaperPlane } from "react-icons/fa";
import { forgotPassword } from "../../services/patientService";

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail]     = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await forgotPassword({ email });
            toast.success("OTP sent to your email!");
            navigate("/verify-otp", { state: { email } });
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data || "Email not found.";
            toast.error(typeof msg === "string" ? msg : "Email not found.");
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
                    background: "linear-gradient(135deg, #0d6efd, #20c997)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 26, color: "#fff"
                }}>
                    <FaHospital />
                </div>

                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Forgot Password</h2>
                <p style={{ color: "var(--gray-500)", fontSize: 14, marginBottom: 28 }}>
                    Enter your registered email address and we'll send you an OTP to reset your password.
                </p>

                <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
                    <div className="ms-form-group">
                        <label className="ms-form-label"><FaEnvelope className="me-1" /> Email Address</label>
                        <input
                            type="email" className="ms-form-control"
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            placeholder="patient@email.com" required
                        />
                    </div>

                    <button type="submit" disabled={loading}
                        className="ms-btn ms-btn-primary w-100 mt-2"
                        style={{ justifyContent: "center" }}>
                        <FaPaperPlane /> {loading ? "Sending OTP..." : "Send OTP"}
                    </button>
                </form>

                <p style={{ marginTop: 20, fontSize: 14, color: "var(--gray-500)" }}>
                    <Link to="/login" style={{ color: "#0d6efd", fontWeight: 600 }}>← Back to Login</Link>
                </p>
            </div>
        </div>
    );
}

export default ForgotPassword;
