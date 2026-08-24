import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUserShield, FaUserMd, FaUser, FaLock, FaEnvelope, FaHospital, FaEye, FaEyeSlash } from "react-icons/fa";
import { login, loginDoctor, loginPatient } from "../../services/authService";
import useAuth from "../../hooks/useAuth";

const TABS = [
    { key: "ADMIN",   label: "Admin",   icon: <FaUserShield />,  color: "#0d6efd" },
    { key: "DOCTOR",  label: "Doctor",  icon: <FaUserMd />,      color: "#20c997" },
    { key: "PATIENT", label: "Patient", icon: <FaUser />,        color: "#6f42c1" },
];

function Login() {
    const navigate = useNavigate();
    const { login: authLogin } = useAuth();

    const [activeTab, setActiveTab]     = useState("ADMIN");
    const [identifier, setIdentifier]   = useState("");  // username or email
    const [password, setPassword]       = useState("");
    const [showPass, setShowPass]       = useState(false);
    const [loading, setLoading]         = useState(false);
    const [error, setError]             = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (activeTab === "ADMIN") {
                const res = await login({ username: identifier, password });
                authLogin({ token: res.token, role: "ADMIN", username: identifier });
                toast.success("Welcome, Admin!");
                navigate("/admin/dashboard");

            } else if (activeTab === "DOCTOR") {
                const res = await loginDoctor({ email: identifier, password });
                authLogin({
                    token: res.token,
                    role: "DOCTOR",
                    username: res.doctorName,
                    userData: { email: res.email, specialization: res.specialization }
                });
                toast.success(`Welcome, Dr. ${res.doctorName}!`);
                navigate("/doctor/dashboard");

            } else {
                const res = await loginPatient({ email: identifier, password });
                authLogin({
                    token: res.token,
                    role: "PATIENT",
                    username: res.patientName,
                    userData: { email: res.email }
                });
                toast.success(`Welcome, ${res.patientName}!`);
                navigate("/patient/dashboard");
            }
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data || "Login failed. Please check your credentials.";
            setError(typeof msg === "string" ? msg : "Login failed.");
        } finally {
            setLoading(false);
        }
    };

    const activeColor = TABS.find(t => t.key === activeTab)?.color || "#0d6efd";
    const isEmail = activeTab !== "ADMIN";

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: activeTab === "ADMIN" ? "#000" : "#f8f9fa",
            position: "relative",
            overflow: "hidden",
            fontFamily: "Inter, sans-serif",
            transition: "background 0.3s ease"
        }}>
            {/* Decorative Background Shapes */}
            {activeTab !== "ADMIN" && (
                <>
                    <div style={{ position: "absolute", bottom: "-10%", left: "-5%", width: "40%", height: "60%", background: "#8a4af3", borderRadius: "50%", filter: "blur(80px)", opacity: 0.6, zIndex: 0 }} />
                    <div style={{ position: "absolute", bottom: "-20%", right: "-10%", width: "50%", height: "70%", background: "#20c997", borderRadius: "50%", filter: "blur(100px)", opacity: 0.5, zIndex: 0 }} />
                </>
            )}

            {/* Top Logo */}
            <div style={{ position: "absolute", top: 40, display: "flex", flexDirection: "column", alignItems: "center", zIndex: 10 }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
                    <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#ff6b6b" }} />
                    <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#20c997" }} />
                    <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#0d6efd" }} />
                    <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#fcc419" }} />
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: activeTab === "ADMIN" ? "#fff" : "#333", letterSpacing: 1, transition: "color 0.3s ease" }}>MEDICARE LOGO</div>
            </div>

            {/* Main Card */}
            <div style={{
                display: "flex",
                width: "900px",
                maxWidth: "95%",
                background: "#fff",
                borderRadius: 16,
                boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                overflow: "hidden",
                zIndex: 10,
                minHeight: 500
            }}>
                {/* Left Side (Image) */}
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40, background: "#fff" }}>
                    <img src={activeTab === "ADMIN" ? "/Admin.png" : (activeTab === "DOCTOR" ? "/doctor.jpg" : "/patient.png")} alt="Login Illustration" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                </div>

                {/* Vertical Divider */}
                <div style={{ width: 1, background: "#f0f0f0", margin: "40px 0" }} />

                {/* Right Side (Form) */}
                <div style={{ flex: 1, padding: "50px 60px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    
                    {/* Tabs */}
                    <div style={{ display: "flex", gap: 10, marginBottom: 30, justifyContent: "center" }}>
                        {TABS.map(tab => (
                            <button key={tab.key} onClick={() => { setActiveTab(tab.key); setError(""); setIdentifier(""); setPassword(""); }}
                                style={{
                                    padding: "6px 12px", border: "none", borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: "pointer",
                                    background: activeTab === tab.key ? tab.color : "#f1f3f5",
                                    color: activeTab === tab.key ? "#fff" : "#888",
                                    transition: "all 0.2s"
                                }}>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div style={{ marginBottom: 30 }}>
                        <div style={{ width: 24, height: 2, background: activeTab === "ADMIN" ? "#8a4af3" : activeColor, marginBottom: 12 }} />
                        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#555" }}>
                            Login as a {activeTab.charAt(0) + activeTab.slice(1).toLowerCase()} User
                        </h2>
                    </div>

                    {error && <div style={{ color: "#dc3545", fontSize: 13, marginBottom: 16 }}>{error}</div>}

                    <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <div style={{ position: "relative" }}>
                            <input type={isEmail ? "email" : "text"} required
                                value={identifier} onChange={e => setIdentifier(e.target.value)}
                                placeholder={isEmail ? "johndoe@xyz.com" : "admin_username"}
                                style={{
                                    width: "100%", padding: "14px 40px 14px 20px", borderRadius: 30,
                                    border: "1px solid #e4e4e4", fontSize: 14, outline: "none", color: "#333",
                                    background: "#fff"
                                }} />
                            <FaUser style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", color: "#ccc" }} />
                        </div>

                        <div style={{ position: "relative" }}>
                            <input type={showPass ? "text" : "password"} required
                                value={password} onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                style={{
                                    width: "100%", padding: "14px 40px 14px 20px", borderRadius: 30,
                                    border: "1px solid #e4e4e4", fontSize: 14, outline: "none", color: "#333",
                                    background: "#fff"
                                }} />
                            <FaLock style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", color: "#ccc" }} />
                        </div>

                        <button type="submit" disabled={loading}
                            style={{
                                width: "100%", padding: "14px", borderRadius: 30, border: "none",
                                background: activeTab === "ADMIN" ? "#8a4af3" : activeColor, 
                                color: "#fff", fontSize: 14, fontWeight: 700, letterSpacing: 2,
                                marginTop: 10, cursor: "pointer",
                                boxShadow: `0 4px 14px ${activeTab === "ADMIN" ? "#8a4af366" : activeColor + "66"}`
                            }}>
                            {loading ? "LOGGING IN..." : "LOGIN"}
                        </button>
                    </form>

                    <div style={{ textAlign: "center", marginTop: 24, fontSize: 12, color: "#888" }}>
                        <div style={{ marginBottom: 6 }}>Forget your password?</div>
                        <Link to={activeTab === "PATIENT" ? "/forgot-password" : "#"} style={{ color: activeTab === "ADMIN" ? "#8a4af3" : activeColor, textDecoration: "none", fontWeight: 700 }}>Get help Signed in.</Link>
                    </div>
                </div>
            </div>

            <div style={{ position: "absolute", bottom: 20, fontSize: 12, color: "#888", zIndex: 10 }}>
                Terms of use. Privacy policy
            </div>
            
            <div style={{ position: "absolute", bottom: 20, left: 20, zIndex: 10 }}>
                <Link to="/" style={{ color: "#888", fontSize: 12, textDecoration: "none" }}>← Back to Home</Link>
            </div>
        </div>
    );
}

export default Login;