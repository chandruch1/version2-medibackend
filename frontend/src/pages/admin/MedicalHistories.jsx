import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import Loader from "../../components/common/Loader";
import { getAllMedicalHistories, deleteMedicalHistory } from "../../services/medicalHistoryService";
import { toast } from "react-toastify";
import { FaHeartbeat, FaTrash, FaSearch } from "react-icons/fa";

function MedicalHistories() {
    const [histories, setHistories] = useState([]);
    const [filtered,  setFiltered]  = useState([]);
    const [loading,   setLoading]   = useState(true);
    const [search,    setSearch]    = useState("");
    const [selected,  setSelected]  = useState(null);

    const load = async () => {
        try {
            const data = await getAllMedicalHistories();
            setHistories(data);
            setFiltered(data);
        } catch {
            toast.error("Failed to load medical histories.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);
    useEffect(() => {
        const q = search.toLowerCase();
        setFiltered(histories.filter(h =>
            h.patientName?.toLowerCase().includes(q) ||
            h.bloodGroup?.toLowerCase().includes(q)
        ));
    }, [search, histories]);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this medical history?")) return;
        try {
            await deleteMedicalHistory(id);
            toast.success("Deleted successfully.");
            setSelected(null);
            load();
        } catch {
            toast.error("Failed to delete.");
        }
    };

    if (loading) return <AdminLayout title="Medical Histories"><Loader text="Loading..." /></AdminLayout>;

    return (
        <AdminLayout title="Medical Histories" subtitle="View and manage patient health records">
            <div className="row g-4">
                {/* Left: List */}
                <div className="col-lg-5">
                    <div className="ms-card">
                        <div className="ms-card-header"><FaHeartbeat className="me-2 text-danger" />Patient Records ({histories.length})</div>
                        <div className="input-group mt-2 mb-3">
                            <span className="input-group-text"><FaSearch /></span>
                            <input className="form-control" placeholder="Search by name or blood group..."
                                value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <div style={{ maxHeight: 500, overflowY: "auto" }}>
                            {filtered.length === 0 ? (
                                <div className="text-center py-5" style={{ color: "#94a3b8" }}>
                                    <div>No records found.</div>
                                </div>
                            ) : (
                                filtered.map(h => (
                                    <div
                                        key={h.id}
                                        onClick={() => setSelected(h)}
                                        style={{
                                            padding: "12px 14px", borderRadius: 10, marginBottom: 8, cursor: "pointer",
                                            border: `1px solid ${selected?.id === h.id ? "#0d6efd" : "var(--border-color,#e5eaf3)"}`,
                                            background: selected?.id === h.id ? "rgba(13,110,253,0.06)" : "transparent",
                                            transition: "all 0.2s"
                                        }}
                                    >
                                        <div style={{ fontWeight: 600, fontSize: 14 }}>{h.patientName}</div>
                                        <div style={{ fontSize: 12, color: "#94a3b8" }}>
                                            Blood Group: {h.bloodGroup || "N/A"} · Updated: {h.updatedAt?.slice(0,10) || "—"}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Detail */}
                <div className="col-lg-7">
                    {selected ? (
                        <div className="ms-card">
                            <div className="ms-card-header d-flex justify-content-between align-items-center">
                                <span>{selected.patientName}'s Health Record</span>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(selected.id)}>
                                    <FaTrash className="me-1" /> Delete
                                </button>
                            </div>
                            <div className="row g-3 mt-1">
                                {[
                                    ["Height", selected.height],
                                    ["Weight", selected.weight],
                                    ["Blood Pressure", selected.bloodPressure],
                                    ["Heart Rate", selected.heartRate],
                                    ["Blood Group", selected.bloodGroup],
                                    ["Allergies", selected.allergies],
                                    ["Previous Diseases", selected.previousDiseases],
                                    ["Surgeries", selected.surgeries],
                                    ["Family History", selected.familyHistory],
                                    ["Current Medication", selected.currentMedication],
                                ].map(([label, val]) => (
                                    <div className="col-md-6" key={label}>
                                        <div style={{
                                            background: "var(--surface-2,#f8faff)", borderRadius: 10,
                                            padding: "12px 14px", border: "1px solid var(--border-color,#e5eaf3)"
                                        }}>
                                            <div style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
                                            <div style={{ fontWeight: 600, fontSize: 14, marginTop: 3 }}>
                                                {val || <span style={{ color: "#94a3b8", fontStyle: "italic", fontWeight: 400 }}>Not recorded</span>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="ms-card h-100 d-flex align-items-center justify-content-center" style={{ minHeight: 300 }}>
                            <div className="text-center" style={{ color: "#94a3b8" }}>
                                <div style={{ fontSize: 48, marginBottom: 12 }}>🩺</div>
                                <div>Select a patient to view their medical history</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

export default MedicalHistories;
