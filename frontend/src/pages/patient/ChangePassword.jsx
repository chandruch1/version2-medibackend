import { useState } from "react";
import PatientLayout from "../../layouts/PatientLayout";
import { toast } from "react-toastify";
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";
import { changePatientPassword } from "../../services/patientService";

function ChangePassword() {
    const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [showPass, setShowPass] = useState({ curr: false, newp: false });
    const [loading, setLoading]  = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.newPassword !== form.confirmPassword) {
            toast.error("New passwords do not match.");
            return;
        }
        if (form.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }
        setLoading(true);
        try {
            await changePatientPassword({
                oldPassword: form.currentPassword,
                newPassword: form.newPassword
            });
            toast.success("Password changed successfully!");
            setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data || "Password change failed.";
            toast.error(typeof msg === "string" ? msg : "Failed.");
        } finally {
            setLoading(false);
        }
    };

    const PasswordInput = ({ name, label, showKey, placeholder }) => (
        <div className="ms-form-group">
            <label className="ms-form-label"><FaLock className="me-1" /> {label}</label>
            <div style={{ position: "relative" }}>
                <input
                    type={showPass[showKey] ? "text" : "password"}
                    className="ms-form-control"
                    value={form[name]}
                    onChange={e => setForm({ ...form, [name]: e.target.value })}
                    placeholder={placeholder}
                    style={{ paddingRight: 40 }}
                    required
                />
                <button type="button"
                    onClick={() => setShowPass({ ...showPass, [showKey]: !showPass[showKey] })}
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                        background: "none", border: "none", cursor: "pointer", color: "var(--gray-400)", fontSize: 15 }}>
                    {showPass[showKey] ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>
        </div>
    );

    return (
        <PatientLayout title="Change Password" subtitle="Keep your account secure with a strong password">
            <div className="row justify-content-center">
                <div className="col-lg-5">
                    <div className="ms-card">
                        {/* Icon Header */}
                        <div style={{ textAlign: "center", marginBottom: 24 }}>
                            <div style={{
                                width: 56, height: 56, borderRadius: 16, margin: "0 auto 12px",
                                background: "linear-gradient(135deg, #6f42c1, #0d6efd)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 22, color: "#fff"
                            }}>
                                <FaLock />
                            </div>
                            <h5 style={{ fontWeight: 700, marginBottom: 4 }}>Update Password</h5>
                            <p style={{ fontSize: 13, color: "var(--gray-500)" }}>
                                Choose a strong password to protect your account
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <PasswordInput name="currentPassword" label="Current Password" showKey="curr" placeholder="Your current password" />
                            <PasswordInput name="newPassword" label="New Password" showKey="newp" placeholder="Min. 6 characters" />

                            <div className="ms-form-group">
                                <label className="ms-form-label">Confirm New Password</label>
                                <input type="password" className="ms-form-control"
                                    value={form.confirmPassword}
                                    onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                                    placeholder="Repeat new password" required />
                                {form.confirmPassword && form.newPassword === form.confirmPassword && (
                                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6,
                                        color: "#198754", fontSize: 13 }}>
                                        <FaCheckCircle /> Passwords match
                                    </div>
                                )}
                            </div>

                            <button type="submit" className="ms-btn ms-btn-primary w-100 mt-2"
                                style={{ justifyContent: "center" }} disabled={loading}>
                                {loading ? "Changing Password..." : "Change Password"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </PatientLayout>
    );
}

export default ChangePassword;
