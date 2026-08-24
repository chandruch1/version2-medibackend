import { useEffect, useState } from "react";
import DoctorLayout from "../../layouts/DoctorLayout";
import Loader from "../../components/common/Loader";
import { getMyLeaves, applyLeave } from "../../services/leaveService";
import { toast } from "react-toastify";
import { FaCalendarTimes, FaPaperPlane } from "react-icons/fa";

const STATUS_COLORS = {
    PENDING:  { bg: "#fff7ed", color: "#ea580c", border: "#fed7aa" },
    APPROVED: { bg: "#f0fdf4", color: "#16a34a", border: "#86efac" },
    REJECTED: { bg: "#fef2f2", color: "#dc2626", border: "#fca5a5" },
};

function Leave() {
    const [leaves,     setLeaves]     = useState([]);
    const [loading,    setLoading]    = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showForm,   setShowForm]   = useState(false);
    const [form, setForm] = useState({ startDate: "", endDate: "", reason: "" });

    const load = async () => {
        try {
            const data = await getMyLeaves();
            setLeaves(data);
        } catch {
            toast.error("Failed to load leaves.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleSubmit = async e => {
        e.preventDefault();
        if (!form.startDate || !form.endDate || !form.reason.trim())
            return toast.error("All fields are required.");
        if (form.endDate < form.startDate)
            return toast.error("End date cannot be before start date.");
        setSubmitting(true);
        try {
            await applyLeave(form);
            toast.success("Leave request submitted!");
            setForm({ startDate: "", endDate: "", reason: "" });
            setShowForm(false);
            load();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to apply leave.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <DoctorLayout title="Leave Management"><Loader text="Loading..." /></DoctorLayout>;

    return (
        <DoctorLayout title="Leave Management" subtitle="Manage your leave requests">
            <div className="ms-card mb-4">
                <div className="ms-card-header d-flex justify-content-between align-items-center">
                    <span><FaCalendarTimes className="me-2 text-warning" />My Leave Requests</span>
                    <button className="btn btn-sm btn-primary" onClick={() => setShowForm(v => !v)}>
                        {showForm ? "Cancel" : "+ Apply Leave"}
                    </button>
                </div>

                {showForm && (
                    <form onSubmit={handleSubmit} className="mt-3 p-3" style={{
                        background: "var(--surface-2,#f8faff)", borderRadius: 10,
                        border: "1px solid var(--border-color,#e5eaf3)"
                    }}>
                        <div className="row g-3">
                            <div className="col-md-4">
                                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Start Date</label>
                                <input type="date" className="form-control" value={form.startDate}
                                    min={new Date().toISOString().split("T")[0]}
                                    onChange={e => setForm({ ...form, startDate: e.target.value })} />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>End Date</label>
                                <input type="date" className="form-control" value={form.endDate}
                                    min={form.startDate || new Date().toISOString().split("T")[0]}
                                    onChange={e => setForm({ ...form, endDate: e.target.value })} />
                            </div>
                            <div className="col-md-4 d-flex align-items-end">
                                <button type="submit" className="btn btn-success w-100" disabled={submitting}>
                                    <FaPaperPlane className="me-2" />{submitting ? "Submitting..." : "Submit"}
                                </button>
                            </div>
                            <div className="col-12">
                                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Reason</label>
                                <textarea className="form-control" rows={2} placeholder="Reason for leave..."
                                    value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} />
                            </div>
                        </div>
                    </form>
                )}

                <div className="mt-3">
                    {leaves.length === 0 ? (
                        <div className="text-center py-5" style={{ color: "#94a3b8" }}>
                            <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
                            <div>No leave requests found.</div>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead>
                                    <tr style={{ background: "var(--surface-2,#f8faff)", fontSize: 13 }}>
                                        <th>#</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Reason</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaves.map((l, i) => {
                                        const s = STATUS_COLORS[l.status] || STATUS_COLORS.PENDING;
                                        return (
                                            <tr key={l.id}>
                                                <td style={{ fontSize: 13 }}>{i + 1}</td>
                                                <td style={{ fontSize: 13 }}>{l.startDate}</td>
                                                <td style={{ fontSize: 13 }}>{l.endDate}</td>
                                                <td style={{ fontSize: 13, maxWidth: 200 }}>{l.reason}</td>
                                                <td>
                                                    <span style={{
                                                        padding: "4px 12px", borderRadius: 20, fontSize: 11,
                                                        fontWeight: 600, background: s.bg, color: s.color,
                                                        border: `1px solid ${s.border}`
                                                    }}>
                                                        {l.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </DoctorLayout>
    );
}

export default Leave;
