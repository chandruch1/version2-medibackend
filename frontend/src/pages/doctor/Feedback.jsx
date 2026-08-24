import { useEffect, useState } from "react";
import DoctorLayout from "../../layouts/DoctorLayout";
import Loader from "../../components/common/Loader";
import { getDoctorFeedbacks } from "../../services/feedbackService";
import { toast } from "react-toastify";
import { FaStar } from "react-icons/fa";

function DoctorFeedback() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading,   setLoading]   = useState(true);

    useEffect(() => {
        getDoctorFeedbacks()
            .then(setFeedbacks)
            .catch(() => toast.error("Failed to load feedback."))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <DoctorLayout title="Patient Feedback"><Loader text="Loading..." /></DoctorLayout>;

    const avgRating = feedbacks.length
        ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
        : "N/A";

    return (
        <DoctorLayout title="Patient Feedback" subtitle="See what your patients say about you">
            {/* Stats */}
            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <div className="ms-stat-card" style={{
                        background: "linear-gradient(135deg,#f59e0b,#d97706)",
                        borderRadius: 14, padding: "22px 24px", color: "#fff",
                        boxShadow: "0 4px 20px rgba(245,158,11,0.3)"
                    }}>
                        <div style={{ fontSize: 12, opacity: 0.85, textTransform: "uppercase", letterSpacing: 1 }}>Average Rating</div>
                        <div style={{ fontSize: 40, fontWeight: 800, marginTop: 6 }}>{avgRating} <span style={{ fontSize: 20 }}>⭐</span></div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="ms-stat-card" style={{
                        background: "linear-gradient(135deg,#6366f1,#4338ca)",
                        borderRadius: 14, padding: "22px 24px", color: "#fff",
                        boxShadow: "0 4px 20px rgba(99,102,241,0.3)"
                    }}>
                        <div style={{ fontSize: 12, opacity: 0.85, textTransform: "uppercase", letterSpacing: 1 }}>Total Reviews</div>
                        <div style={{ fontSize: 40, fontWeight: 800, marginTop: 6 }}>{feedbacks.length}</div>
                    </div>
                </div>
            </div>

            {/* Feedback Cards */}
            <div className="ms-card">
                <div className="ms-card-header"><FaStar className="me-2 text-warning" />Patient Reviews</div>
                {feedbacks.length === 0 ? (
                    <div className="text-center py-5" style={{ color: "#94a3b8" }}>
                        <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
                        <div>No feedback received yet.</div>
                    </div>
                ) : (
                    <div className="row g-3 mt-1">
                        {feedbacks.map(fb => (
                            <div className="col-md-6" key={fb.id}>
                                <div style={{
                                    border: "1px solid var(--border-color,#e5eaf3)",
                                    borderRadius: 12, padding: 16,
                                    background: "var(--surface-2,#f8faff)"
                                }}>
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: 14 }}>{fb.patientName}</div>
                                            <div style={{ fontSize: 11, color: "#94a3b8" }}>
                                                {fb.createdAt ? new Date(fb.createdAt).toLocaleDateString() : ""}
                                            </div>
                                        </div>
                                        <div style={{ color: "#f59e0b", fontSize: 17 }}>
                                            {"★".repeat(fb.rating)}
                                            <span style={{ color: "#d1d5db" }}>{"★".repeat(5 - fb.rating)}</span>
                                        </div>
                                    </div>
                                    <p style={{ fontSize: 13, color: "var(--gray-700,#334155)", margin: 0 }}>{fb.review}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DoctorLayout>
    );
}

export default DoctorFeedback;
