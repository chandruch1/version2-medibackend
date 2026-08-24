import { useEffect, useState } from "react";
import DoctorLayout from "../../layouts/DoctorLayout";
import Loader from "../../components/common/Loader";
import { toast } from "react-toastify";
import { FaUserMd, FaEnvelope, FaPhone, FaStethoscope, FaSave } from "react-icons/fa";
import { getDoctorProfile, updateDoctorProfile } from "../../services/doctorService";

function DoctorProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [form, setForm]       = useState({});
    const [saving, setSaving]   = useState(false);

    useEffect(() => {
        getDoctorProfile()
            .then(data => { setProfile(data); setForm(data); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const updated = await updateDoctorProfile({
                doctorName: form.doctorName,
                phone: form.phone,
                specialization: form.specialization,
                qualification: form.qualification,
                experience: form.experience,
                consultationFee: form.consultationFee,
                address: form.address,
            });
            setProfile(updated);
            toast.success("Profile updated successfully!");
            setEditing(false);
        } catch (err) {
            toast.error("Update failed. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <DoctorLayout title="Profile"><Loader /></DoctorLayout>;

    return (
        <DoctorLayout title="My Profile" subtitle="Your doctor account information">
            <div className="row">
                {/* Left: Avatar Card */}
                <div className="col-lg-4 mb-4">
                    <div className="ms-card text-center">
                        <div className="ms-profile-avatar" style={{
                            background: "linear-gradient(135deg, #20c997, #0d6efd)"
                        }}>
                            {profile?.doctorName?.[0] || "D"}
                        </div>
                        <h5 style={{ fontWeight: 700, marginBottom: 4 }}>Dr. {profile?.doctorName}</h5>
                        <p style={{ color: "var(--gray-500)", fontSize: 14, marginBottom: 12 }}>{profile?.specialization}</p>
                        <span className="ms-role-badge doctor" style={{ fontSize: 12 }}>Doctor</span>

                        <hr style={{ margin: "20px 0" }} />

                        <div style={{ textAlign: "left" }}>
                            {[
                                { icon: <FaEnvelope />, label: "Email",          value: profile?.email },
                                { icon: <FaPhone />,   label: "Phone",          value: profile?.phone },
                                { icon: <FaStethoscope />, label: "Qualification", value: profile?.qualification },
                                { icon: <FaUserMd />,  label: "Experience",     value: `${profile?.experience} years` },
                            ].map(row => (
                                <div key={row.label} style={{
                                    display: "flex", gap: 10, padding: "10px 0",
                                    borderBottom: "1px solid var(--border-color)"
                                }}>
                                    <div style={{
                                        width: 30, height: 30, borderRadius: 6,
                                        background: "rgba(32,201,151,0.1)", color: "#20c997",
                                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0
                                    }}>{row.icon}</div>
                                    <div>
                                        <div style={{ fontSize: 10, color: "var(--gray-400)", textTransform: "uppercase", letterSpacing: 0.5 }}>{row.label}</div>
                                        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--gray-800)" }}>{row.value || "—"}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Edit Form */}
                <div className="col-lg-8 mb-4">
                    <div className="ms-card">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                            <div className="ms-card-header" style={{ margin: 0, border: 0, padding: 0 }}>Profile Details</div>
                            {!editing ? (
                                <button className="ms-btn ms-btn-primary ms-btn-sm" onClick={() => setEditing(true)}>
                                    Edit Profile
                                </button>
                            ) : (
                                <button className="ms-btn ms-btn-outline ms-btn-sm" onClick={() => setEditing(false)}>
                                    Cancel
                                </button>
                            )}
                        </div>

                        {editing ? (
                            <form onSubmit={handleSave}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <div className="ms-form-group">
                                            <label className="ms-form-label">Full Name</label>
                                            <input className="ms-form-control" value={form.doctorName || ""}
                                                onChange={e => setForm({ ...form, doctorName: e.target.value })} required />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="ms-form-group">
                                            <label className="ms-form-label">Phone</label>
                                            <input className="ms-form-control" value={form.phone || ""}
                                                onChange={e => setForm({ ...form, phone: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="ms-form-group">
                                            <label className="ms-form-label">Specialization</label>
                                            <input className="ms-form-control" value={form.specialization || ""}
                                                onChange={e => setForm({ ...form, specialization: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="ms-form-group">
                                            <label className="ms-form-label">Qualification</label>
                                            <input className="ms-form-control" value={form.qualification || ""}
                                                onChange={e => setForm({ ...form, qualification: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="ms-form-group">
                                            <label className="ms-form-label">Experience (Years)</label>
                                            <input type="number" className="ms-form-control" value={form.experience || ""}
                                                onChange={e => setForm({ ...form, experience: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="ms-form-group">
                                            <label className="ms-form-label">Consultation Fee (₹)</label>
                                            <input type="number" className="ms-form-control" value={form.consultationFee || ""}
                                                onChange={e => setForm({ ...form, consultationFee: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="ms-btn ms-btn-success mt-3" disabled={saving}>
                                    <FaSave /> {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </form>
                        ) : (
                            <div className="row g-3">
                                {[
                                    { label: "Full Name",         value: profile?.doctorName },
                                    { label: "Email",             value: profile?.email },
                                    { label: "Phone",             value: profile?.phone },
                                    { label: "Specialization",    value: profile?.specialization },
                                    { label: "Qualification",     value: profile?.qualification },
                                    { label: "Experience",        value: `${profile?.experience} years` },
                                    { label: "Consultation Fee",  value: `₹ ${profile?.consultationFee}` },
                                ].map(row => (
                                    <div key={row.label} className="col-md-6">
                                        <div style={{ fontSize: 11, color: "var(--gray-400)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>{row.label}</div>
                                        <div style={{ fontWeight: 600, fontSize: 15, color: "var(--gray-900)" }}>{row.value || "—"}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DoctorLayout>
    );
}

export default DoctorProfile;
