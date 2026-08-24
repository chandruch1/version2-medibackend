import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { FaShieldAlt, FaHospital } from "react-icons/fa";
import { verifyOtp } from "../../services/patientService";

function VerifyOtp() {
    const navigate  = useNavigate();
    const location  = useLocation();
    const email     = location.state?.email || "";

    const [otp, setOtp]         = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await verifyOtp({ email, otp });
            toast.success("OTP verified! Set your new password.");
            navigate("/reset-password", { state: { email } });
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data || "Invalid OTP. Please try again.";
            toast.error(typeof msg === "string" ? msg : "Invalid OTP.");
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
                    background: "linear-gradient(135deg, #198754, #20c997)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 26, color: "#fff"
                }}>
                    <FaShieldAlt />
                </div>

                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Verify OTP</h2>
                <p style={{ color: "var(--gray-500)", fontSize: 14, marginBottom: 28 }}>
                    We sent a 6-digit code to <strong>{email || "your email"}</strong>. Enter it below.
                </p>

                <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
                    <div className="ms-form-group">
                        <label className="ms-form-label">Enter OTP</label>
                        <input
                            type="text" className="ms-form-control"
                            value={otp} onChange={(e) => setOtp(e.target.value)}
                            placeholder="123456" maxLength={6}
                            style={{ textAlign: "center", fontSize: 24, letterSpacing: 8, fontWeight: 700 }}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading}
                        className="ms-btn ms-btn-success w-100 mt-2"
                        style={{ justifyContent: "center" }}>
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                </form>

                <p style={{ marginTop: 16, fontSize: 13, color: "var(--gray-400)" }}>
                    Didn't get the code?{" "}
                    <Link to="/forgot-password" style={{ color: "#0d6efd", fontWeight: 600 }}>Resend</Link>
                </p>
                <p style={{ marginTop: 8, fontSize: 14, color: "var(--gray-500)" }}>
                    <Link to="/login" style={{ color: "#0d6efd", fontWeight: 600 }}>← Back to Login</Link>
                </p>
            </div>
        </div>
    );
}

export default VerifyOtp;
