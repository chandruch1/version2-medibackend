import { useEffect, useState } from "react";
import PatientLayout from "../../layouts/PatientLayout";
import Loader from "../../components/common/Loader";
import { toast } from "react-toastify";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSave } from "react-icons/fa";
import { getPatientProfile, updatePatientProfile } from "../../services/patientService";

const BLOOD_COLORS = {
    "A+": "#0d6efd", "A-": "#6f42c1", "B+": "#20c997", "B-": "#198754",
    "AB+": "#fd7e14", "AB-": "#dc3545", "O+": "#0dcaf0", "O-": "#ffc107"
};

function PatientProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [form, setForm]       = useState({});
    const [saving, setSaving]   = useState(false);

    useEffect(() => {
        getPatientProfile()
            .then(data => { setProfile(data); setForm(data); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const updated = await updatePatientProfile({
                patientName: form.patientName,
                phone: form.phone,
                address: form.address,
                disease: form.disease,
                age: form.age,
                gender: form.gender,
                bloodGroup: form.bloodGroup,
            });
            setProfile(updated);
            toast.success("Profile updated!");
            setEditing(false);
        } catch {
            toast.error("Update failed.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <PatientLayout title="Profile"><Loader /></PatientLayout>;

    const bloodColor = BLOOD_COLORS[profile?.bloodGroup] || "#6c757d";

    return (
        <PatientLayout title="My Profile" subtitle="Your personal health information">
            <div className="row">
                {/* Left: Card */}
                <div className="col-lg-4 mb-4">
                    <div className="ms-card text-center">
                        <div className="ms-profile-avatar" style={{
                            background: "linear-gradient(135deg, #6f42c1, #0d6efd)"
                        }}>
                            {profile?.patientName?.[0] || "P"}
                        </div>
                        <h5 style={{ fontWeight: 700, marginBottom: 4 }}>{profile?.patientName}</h5>

                        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 12 }}>
                            <span className="ms-role-badge patient" style={{ fontSize: 12 }}>Patient</span>
                            <span style={{
                                padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700,
                                background: bloodColor + "18", color: bloodColor
                            }}>
                                {profile?.bloodGroup}
                            </span>
                        </div>

                        <hr style={{ margin: "16px 0" }} />

                        <div style={{ textAlign: "left" }}>
                            {[
                                { icon: <FaEnvelope />, label: "Email",   value: profile?.email },
                                { icon: <FaPhone />,   label: "Phone",   value: profile?.phone },
                                { icon: <FaUser />,    label: "Age",     value: `${profile?.age} years • ${profile?.gender}` },
                                { icon: <FaMapMarkerAlt />, label: "Address", value: profile?.address },
                            ].map(row => (
                                <div key={row.label} style={{
                                    display: "flex", gap: 10, padding: "10px 0",
                                    borderBottom: "1px solid var(--border-color)"
                                }}>
                                    <div style={{
                                        width: 30, height: 30, borderRadius: 6,
                                        background: "rgba(111,66,193,0.1)", color: "#6f42c1",
                                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0
                                    }}>{row.icon}</div>
                                    <div>
                                        <div style={{ fontSize: 10, color: "var(--gray-400)", textTransform: "uppercase", letterSpacing: 0.5 }}>{row.label}</div>
                                        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--gray-800)", wordBreak: "break-word" }}>{row.value || "—"}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {profile?.disease && (
                            <div style={{
                                marginTop: 16, background: "rgba(220,53,69,0.08)", borderRadius: 8, padding: "10px 14px",
                                fontSize: 13, color: "#dc3545", textAlign: "left"
                            }}>
                                <strong>Condition:</strong> {profile.disease}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Edit Form */}
                <div className="col-lg-8 mb-4">
                    <div className="ms-card">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                            <div className="ms-card-header" style={{ margin: 0, border: 0, padding: 0 }}>Profile Details</div>
                            {!editing ? (
                                <button className="ms-btn ms-btn-primary ms-btn-sm" onClick={() => setEditing(true)}>Edit Profile</button>
                            ) : (
                                <button className="ms-btn ms-btn-outline ms-btn-sm" onClick={() => setEditing(false)}>Cancel</button>
                            )}
                        </div>

                        {editing ? (
                            <form onSubmit={handleSave}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <div className="ms-form-group">
                                            <label className="ms-form-label">Full Name</label>
                                            <input className="ms-form-control" value={form.patientName || ""}
                                                onChange={e => setForm({ ...form, patientName: e.target.value })} required />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="ms-form-group">
                                            <label className="ms-form-label">Phone</label>
                                            <input className="ms-form-control" value={form.phone || ""}
                                                onChange={e => setForm({ ...form, phone: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="ms-form-group">
                                            <label className="ms-form-label">Age</label>
                                            <input type="number" className="ms-form-control" value={form.age || ""}
                                                onChange={e => setForm({ ...form, age: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="ms-form-group">
                                            <label className="ms-form-label">Gender</label>
                                            <select className="ms-form-control" value={form.gender || "Male"}
                                                onChange={e => setForm({ ...form, gender: e.target.value })}>
                                                <option>Male</option><option>Female</option><option>Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="ms-form-group">
                                            <label className="ms-form-label">Blood Group</label>
                                            <select className="ms-form-control" value={form.bloodGroup || "A+"}
                                                onChange={e => setForm({ ...form, bloodGroup: e.target.value })}>
                                                {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(bg => <option key={bg}>{bg}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="ms-form-group">
                                            <label className="ms-form-label">Address</label>
                                            <input className="ms-form-control" value={form.address || ""}
                                                onChange={e => setForm({ ...form, address: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="ms-form-group">
                                            <label className="ms-form-label">Medical Condition</label>
                                            <input className="ms-form-control" value={form.disease || ""}
                                                onChange={e => setForm({ ...form, disease: e.target.value })}
                                                placeholder="Hypertension, Diabetes..." />
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
                                    { label: "Full Name",    value: profile?.patientName },
                                    { label: "Email",        value: profile?.email },
                                    { label: "Phone",        value: profile?.phone },
                                    { label: "Age",          value: `${profile?.age} years` },
                                    { label: "Gender",       value: profile?.gender },
                                    { label: "Blood Group",  value: profile?.bloodGroup },
                                    { label: "Address",      value: profile?.address },
                                    { label: "Condition",    value: profile?.disease },
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
        </PatientLayout>
    );
}

export default PatientProfile;
