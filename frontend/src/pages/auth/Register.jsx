import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaHospital, FaUser, FaEnvelope, FaLock, FaPhone, FaEye, FaEyeSlash } from "react-icons/fa";
import { registerPatient } from "../../services/patientService";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const GENDERS = ["Male", "Female", "Other"];

function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [form, setForm] = useState({
        patientName: "", age: "", gender: "Male", dob: "",
        phone: "", email: "", password: "",
        address: "", bloodGroup: "A+", disease: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await registerPatient(form);
            toast.success("Registration successful! Please login.");
            navigate("/login");
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data || "Registration failed.";
            toast.error(typeof msg === "string" ? msg : "Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    const Field = ({ label, name, type = "text", placeholder, children }) => (
        <div className="ms-form-group">
            <label className="ms-form-label">{label}</label>
            {children || (
                <input
                    type={type}
                    name={name}
                    className="ms-form-control"
                    placeholder={placeholder}
                    value={form[name]}
                    onChange={handleChange}
                    required
                />
            )}
        </div>
    );

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #0f1623 0%, #1a2744 60%, #0d6efd 100%)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px"
        }}>
            <div style={{
                background: "#fff", borderRadius: 24, padding: "40px 36px",
                width: "100%", maxWidth: 580, boxShadow: "0 20px 60px rgba(0,0,0,0.2)"
            }}>
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: 28 }}>
                    <div style={{
                        width: 56, height: 56, borderRadius: 14, margin: "0 auto 12px",
                        background: "linear-gradient(135deg, #6f42c1, #0d6efd)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 24, color: "#fff"
                    }}>
                        <FaHospital />
                    </div>
                    <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Create Patient Account</h2>
                    <p style={{ color: "var(--gray-500)", fontSize: 14 }}>Register to book appointments with our doctors</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        {/* Full Name */}
                        <div className="col-12">
                            <div className="ms-form-group mb-0">
                                <label className="ms-form-label"><FaUser className="me-1" /> Full Name</label>
                                <input name="patientName" className="ms-form-control" value={form.patientName}
                                    onChange={handleChange} placeholder="John Doe" required />
                            </div>
                        </div>

                        {/* Age + Gender */}
                        <div className="col-md-4">
                            <div className="ms-form-group mb-0">
                                <label className="ms-form-label">Age</label>
                                <input name="age" type="number" className="ms-form-control" value={form.age}
                                    onChange={handleChange} placeholder="25" min={1} max={120} required />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="ms-form-group mb-0">
                                <label className="ms-form-label">Gender</label>
                                <select name="gender" className="ms-form-control" value={form.gender} onChange={handleChange} required>
                                    {GENDERS.map(g => <option key={g}>{g}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="ms-form-group mb-0">
                                <label className="ms-form-label">Date of Birth</label>
                                <input name="dob" type="date" className="ms-form-control" value={form.dob}
                                    onChange={handleChange} required />
                            </div>
                        </div>

                        {/* Phone + Blood Group */}
                        <div className="col-md-6">
                            <div className="ms-form-group mb-0">
                                <label className="ms-form-label"><FaPhone className="me-1" /> Phone</label>
                                <input name="phone" className="ms-form-control" value={form.phone}
                                    onChange={handleChange} placeholder="+91 98765 43210" required />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="ms-form-group mb-0">
                                <label className="ms-form-label">Blood Group</label>
                                <select name="bloodGroup" className="ms-form-control" value={form.bloodGroup} onChange={handleChange} required>
                                    {BLOOD_GROUPS.map(bg => <option key={bg}>{bg}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="col-12">
                            <div className="ms-form-group mb-0">
                                <label className="ms-form-label"><FaEnvelope className="me-1" /> Email Address</label>
                                <input name="email" type="email" className="ms-form-control" value={form.email}
                                    onChange={handleChange} placeholder="john@example.com" required />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="col-12">
                            <div className="ms-form-group mb-0">
                                <label className="ms-form-label"><FaLock className="me-1" /> Password</label>
                                <div style={{ position: "relative" }}>
                                    <input
                                        name="password" type={showPass ? "text" : "password"}
                                        className="ms-form-control" value={form.password}
                                        onChange={handleChange} placeholder="Min. 6 characters"
                                        style={{ paddingRight: 40 }} required minLength={6}
                                    />
                                    <button type="button" onClick={() => setShowPass(!showPass)}
                                        style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                                            background: "none", border: "none", cursor: "pointer",
                                            color: "var(--gray-400)", fontSize: 15 }}>
                                        {showPass ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="col-12">
                            <div className="ms-form-group mb-0">
                                <label className="ms-form-label">Address</label>
                                <input name="address" className="ms-form-control" value={form.address}
                                    onChange={handleChange} placeholder="123 Main St, City" required />
                            </div>
                        </div>

                        {/* Disease / Condition */}
                        <div className="col-12">
                            <div className="ms-form-group mb-0">
                                <label className="ms-form-label">Medical Condition / Disease</label>
                                <input name="disease" className="ms-form-control" value={form.disease}
                                    onChange={handleChange} placeholder="Hypertension, Diabetes, etc." />
                            </div>
                        </div>
                    </div>

                    <button type="submit" disabled={loading}
                        className="ms-btn ms-btn-primary w-100 mt-4"
                        style={{ justifyContent: "center" }}>
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>

                    <p style={{ textAlign: "center", marginTop: 16, fontSize: 14, color: "var(--gray-500)" }}>
                        Already have an account?{" "}
                        <Link to="/login" style={{ color: "#0d6efd", fontWeight: 600 }}>Sign in</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register;
