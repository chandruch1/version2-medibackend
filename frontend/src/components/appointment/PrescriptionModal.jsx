import { useState } from "react";
import { toast } from "react-toastify";
import { FaTimes, FaPills } from "react-icons/fa";
import { addPrescription } from "../../services/prescriptionService";

function PrescriptionModal({ appointment, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        appointmentId: appointment?.id || "",
        medicine: "",
        dosage: "",
        duration: "",
        notes: ""
    });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addPrescription(form);
            toast.success("Prescription added! Email sent to patient.");
            onSuccess?.();
            onClose();
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data || "Failed to add prescription.";
            toast.error(typeof msg === "string" ? msg : "Failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ms-modal-overlay" onClick={onClose}>
            <div className="ms-modal" onClick={(e) => e.stopPropagation()}>
                <div className="ms-modal-header">
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                            width: 32, height: 32, borderRadius: 8,
                            background: "rgba(32,201,151,0.15)", color: "#20c997",
                            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16
                        }}>
                            <FaPills />
                        </div>
                        <span className="ms-modal-title">Add Prescription</span>
                    </div>
                    <button className="ms-modal-close" onClick={onClose}><FaTimes /></button>
                </div>

                {/* Patient Info Banner */}
                {appointment && (
                    <div style={{
                        margin: "0 24px 0", padding: "10px 14px",
                        background: "var(--primary-light)", borderRadius: 8,
                        fontSize: 13, color: "var(--primary)", fontWeight: 500
                    }}>
                        Patient: <strong>{appointment.patientName}</strong> — {appointment.appointmentDate}
                    </div>
                )}

                <div className="ms-modal-body">
                    <form id="presc-form" onSubmit={handleSubmit}>
                        <div className="ms-form-group">
                            <label className="ms-form-label">Medicine / Drug Name</label>
                            <input name="medicine" className="ms-form-control" value={form.medicine}
                                onChange={handleChange} placeholder="e.g. Paracetamol 500mg" required />
                        </div>
                        <div className="row g-3">
                            <div className="col-6">
                                <div className="ms-form-group">
                                    <label className="ms-form-label">Dosage</label>
                                    <input name="dosage" className="ms-form-control" value={form.dosage}
                                        onChange={handleChange} placeholder="1-0-1 (TDS)" required />
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="ms-form-group">
                                    <label className="ms-form-label">Duration</label>
                                    <input name="duration" className="ms-form-control" value={form.duration}
                                        onChange={handleChange} placeholder="5 days" required />
                                </div>
                            </div>
                        </div>
                        <div className="ms-form-group">
                            <label className="ms-form-label">Notes (Optional)</label>
                            <textarea name="notes" className="ms-form-control" rows={3}
                                value={form.notes} onChange={handleChange}
                                placeholder="Take after meals, avoid alcohol..."
                                style={{ resize: "none" }} />
                        </div>
                    </form>
                </div>

                <div className="ms-modal-footer">
                    <button className="ms-btn ms-btn-outline" onClick={onClose}>Cancel</button>
                    <button className="ms-btn ms-btn-success" form="presc-form" type="submit" disabled={loading}>
                        {loading ? "Saving..." : "Add Prescription"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PrescriptionModal;
