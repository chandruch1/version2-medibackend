import { useEffect, useState } from "react";
import PatientLayout from "../../layouts/PatientLayout";
import Loader from "../../components/common/Loader";
import { getMyFeedbacks, submitFeedback } from "../../services/feedbackService";
import { getMyAppointments } from "../../services/appointmentService";
import { toast } from "react-toastify";
import { FaStar, FaPaperPlane } from "react-icons/fa";

function StarRating({ value, onChange }) {
    return (
        <div className="d-flex gap-1 mb-1">
            {[1, 2, 3, 4, 5].map(s => (
                <span
                    key={s}
                    onClick={() => onChange(s)}
                    style={{
                        fontSize: 28, cursor: "pointer",
                        color: s <= value ? "#f59e0b" : "#d1d5db",
                        transition: "color 0.15s"
                    }}
                >
                    ★
                </span>
            ))}
        </div>
    );
}

function Feedback() {
    const [myFeedbacks,   setMyFeedbacks]   = useState([]);
    const [appointments,  setAppointments]  = useState([]);
    const [loading,       setLoading]       = useState(true);
    const [submitting,    setSubmitting]    = useState(false);
    const [form, setForm] = useState({ appointmentId: "", rating: 0, review: "" });

    const load = async () => {
        try {
            const [fb, apt] = await Promise.all([
                getMyFeedbacks(),
                getMyAppointments()
            ]);
            setMyFeedbacks(fb);
            // Only COMPLETED appointments without existing feedback
            const reviewed = new Set(fb.map(f => f.appointmentId));
            setAppointments(apt.filter(a => a.status === "COMPLETED" && !reviewed.has(a.id)));
        } catch {
            toast.error("Failed to load feedback data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleSubmit = async e => {
        e.preventDefault();
        if (!form.appointmentId) return toast.error("Please select an appointment.");
        if (!form.rating)        return toast.error("Please select a rating.");
        if (!form.review.trim()) return toast.error("Please write a review.");
        setSubmitting(true);
        try {
            await submitFeedback({
                appointmentId: Number(form.appointmentId),
                rating: form.rating,
                review: form.review
            });
            toast.success("Feedback submitted successfully!");
            setForm({ appointmentId: "", rating: 0, review: "" });
            load();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to submit feedback.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <PatientLayout title="Feedback"><Loader text="Loading..." /></PatientLayout>;

    return (
        <PatientLayout title="My Feedback" subtitle="Rate your experience with doctors">
            {/* Submit Form */}
            {appointments.length > 0 && (
                <div className="ms-card mb-4">
                    <div className="ms-card-header"><FaPaperPlane className="me-2" />Submit Feedback</div>
                    <form onSubmit={handleSubmit} className="mt-2">
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Select Appointment</label>
                                <select className="form-select" value={form.appointmentId}
                                    onChange={e => setForm({ ...form, appointmentId: e.target.value })}>
                                    <option value="">-- Choose a completed appointment --</option>
                                    {appointments.map(a => (
                                        <option key={a.id} value={a.id}>
                                            Dr. {a.doctorName} — {a.appointmentDate}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Rating</label>
                                <StarRating value={form.rating} onChange={r => setForm({ ...form, rating: r })} />
                            </div>
                            <div className="col-12">
                                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Your Review</label>
                                <textarea className="form-control" rows={3} placeholder="Share your experience..."
                                    value={form.review} onChange={e => setForm({ ...form, review: e.target.value })} />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary mt-3" disabled={submitting}>
                            <FaPaperPlane className="me-2" />{submitting ? "Submitting..." : "Submit Feedback"}
                        </button>
                    </form>
                </div>
            )}

            {/* My Feedbacks */}
            <div className="ms-card">
                <div className="ms-card-header"><FaStar className="me-2 text-warning" />My Reviews ({myFeedbacks.length})</div>
                {myFeedbacks.length === 0 ? (
                    <div className="text-center py-5" style={{ color: "var(--gray-500,#94a3b8)" }}>
                        <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
                        <div>No feedback submitted yet.</div>
                    </div>
                ) : (
                    <div className="row g-3 mt-1">
                        {myFeedbacks.map(fb => (
                            <div className="col-md-6" key={fb.id}>
                                <div style={{
                                    border: "1px solid var(--border-color,#e5eaf3)",
                                    borderRadius: 12, padding: "16px",
                                    background: "var(--surface-2,#f8faff)"
                                }}>
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <div>
                                            <div style={{ fontWeight: 700 }}>Dr. {fb.doctorName}</div>
                                            <div style={{ fontSize: 12, color: "#94a3b8" }}>{fb.createdAt?.slice(0, 10)}</div>
                                        </div>
                                        <div style={{ color: "#f59e0b", fontSize: 18 }}>
                                            {"★".repeat(fb.rating)}{"☆".repeat(5 - fb.rating)}
                                        </div>
                                    </div>
                                    <p style={{ fontSize: 14, color: "var(--gray-700,#334155)", margin: 0 }}>{fb.review}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </PatientLayout>
    );
}

export default Feedback;
