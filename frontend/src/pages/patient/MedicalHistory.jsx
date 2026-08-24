import { useEffect, useState } from "react";
import PatientLayout from "../../layouts/PatientLayout";
import Loader from "../../components/common/Loader";
import { getMyMedicalHistory, saveMedicalHistory } from "../../services/medicalHistoryService";
import { toast } from "react-toastify";
import { FaHeartbeat, FaSave, FaEdit } from "react-icons/fa";

const FIELDS = [
    { key: "height",            label: "Height",             placeholder: "e.g. 170 cm" },
    { key: "weight",            label: "Weight",             placeholder: "e.g. 65 kg" },
    { key: "bloodPressure",     label: "Blood Pressure",     placeholder: "e.g. 120/80 mmHg" },
    { key: "heartRate",         label: "Heart Rate",         placeholder: "e.g. 72 bpm" },
    { key: "bloodGroup",        label: "Blood Group",        placeholder: "e.g. O+" },
    { key: "allergies",         label: "Allergies",          placeholder: "e.g. Penicillin, Pollen" },
    { key: "previousDiseases",  label: "Previous Diseases",  placeholder: "e.g. Typhoid, Malaria" },
    { key: "surgeries",         label: "Surgeries",          placeholder: "e.g. Appendectomy (2018)" },
    { key: "familyHistory",     label: "Family History",     placeholder: "e.g. Diabetes, Hypertension" },
    { key: "currentMedication", label: "Current Medication", placeholder: "e.g. Metformin 500mg" },
];

const EMPTY = Object.fromEntries(FIELDS.map(f => [f.key, ""]));

function MedicalHistory() {
    const [form,    setForm]    = useState(EMPTY);
    const [loading, setLoading] = useState(true);
    const [saving,  setSaving]  = useState(false);
    const [editing, setEditing] = useState(false);
    const [hasData, setHasData] = useState(false);

    useEffect(() => {
        getMyMedicalHistory()
            .then(data => {
                setForm(data);
                setHasData(true);
                setEditing(false);
            })
            .catch(() => {
                setHasData(false);
                setEditing(true);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setSaving(true);
        try {
            await saveMedicalHistory(form);
            toast.success("Medical history saved successfully!");
            setHasData(true);
            setEditing(false);
        } catch {
            toast.error("Failed to save medical history.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <PatientLayout title="Medical History"><Loader text="Loading..." /></PatientLayout>;

    return (
        <PatientLayout title="My Medical History" subtitle="Keep your health records up to date">
            <div className="ms-card">
                <div className="ms-card-header d-flex justify-content-between align-items-center">
                    <span><FaHeartbeat className="me-2 text-danger" />Health Records</span>
                    {hasData && !editing && (
                        <button className="btn btn-sm btn-outline-primary" onClick={() => setEditing(true)}>
                            <FaEdit className="me-1" /> Edit
                        </button>
                    )}
                </div>

                {!editing ? (
                    <div className="row g-3 mt-1">
                        {FIELDS.map(f => (
                            <div className="col-md-6" key={f.key}>
                                <div style={{
                                    background: "var(--surface-2,#f8faff)",
                                    borderRadius: 10,
                                    padding: "12px 16px",
                                    border: "1px solid var(--border-color,#e5eaf3)"
                                }}>
                                    <div style={{ fontSize: 11, color: "var(--gray-500,#94a3b8)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{f.label}</div>
                                    <div style={{ fontWeight: 600, color: "var(--gray-800,#1e293b)", fontSize: 15 }}>
                                        {form[f.key] || <span style={{ color: "#94a3b8", fontStyle: "italic", fontWeight: 400 }}>Not recorded</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="mt-2">
                        <div className="row g-3">
                            {FIELDS.map(f => (
                                <div className="col-md-6" key={f.key}>
                                    <label className="form-label fw-semibold" style={{ fontSize: 13 }}>{f.label}</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name={f.key}
                                        value={form[f.key] || ""}
                                        onChange={handleChange}
                                        placeholder={f.placeholder}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="d-flex gap-2 mt-4">
                            <button type="submit" className="btn btn-primary" disabled={saving}>
                                <FaSave className="me-2" />
                                {saving ? "Saving..." : "Save Medical History"}
                            </button>
                            {hasData && (
                                <button type="button" className="btn btn-outline-secondary" onClick={() => setEditing(false)}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                )}
            </div>
        </PatientLayout>
    );
}

export default MedicalHistory;
