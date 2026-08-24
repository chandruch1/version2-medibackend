import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import Loader from "../../components/common/Loader";
import { getAllFeedbacks } from "../../services/feedbackService";
import { toast } from "react-toastify";
import { FaStar, FaSearch } from "react-icons/fa";

function AdminFeedback() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [filtered,  setFiltered]  = useState([]);
    const [loading,   setLoading]   = useState(true);
    const [search,    setSearch]    = useState("");
    const [ratingFilter, setRatingFilter] = useState("ALL");

    useEffect(() => {
        getAllFeedbacks()
            .then(data => { setFeedbacks(data); setFiltered(data); })
            .catch(() => toast.error("Failed to load feedback."))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const q = search.toLowerCase();
        setFiltered(feedbacks.filter(f => {
            const matchSearch = f.doctorName?.toLowerCase().includes(q) || f.patientName?.toLowerCase().includes(q);
            const matchRating = ratingFilter === "ALL" || f.rating === Number(ratingFilter);
            return matchSearch && matchRating;
        }));
    }, [search, ratingFilter, feedbacks]);

    if (loading) return <AdminLayout title="Feedback"><Loader text="Loading..." /></AdminLayout>;

    const avgRating = feedbacks.length
        ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1)
        : "N/A";

    return (
        <AdminLayout title="Patient Feedback" subtitle="View all patient reviews across the platform">
            {/* Stats */}
            <div className="row g-3 mb-4">
                <div className="col-md-3">
                    <div style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)", borderRadius: 14, padding: "20px 22px", color: "#fff", boxShadow: "0 4px 20px rgba(245,158,11,0.25)" }}>
                        <div style={{ fontSize: 11, opacity: 0.85, textTransform: "uppercase", letterSpacing: 1 }}>Avg Rating</div>
                        <div style={{ fontSize: 34, fontWeight: 800, marginTop: 4 }}>{avgRating} ⭐</div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div style={{ background: "linear-gradient(135deg,#6366f1,#4338ca)", borderRadius: 14, padding: "20px 22px", color: "#fff", boxShadow: "0 4px 20px rgba(99,102,241,0.25)" }}>
                        <div style={{ fontSize: 11, opacity: 0.85, textTransform: "uppercase", letterSpacing: 1 }}>Total Reviews</div>
                        <div style={{ fontSize: 34, fontWeight: 800, marginTop: 4 }}>{feedbacks.length}</div>
                    </div>
                </div>
                {[5, 4, 3].map(r => (
                    <div className="col-md-2" key={r}>
                        <div style={{ background: "#fff", borderRadius: 14, padding: "20px 22px", border: "1px solid var(--border-color,#e5eaf3)" }}>
                            <div style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>{"★".repeat(r)} Stars</div>
                            <div style={{ fontSize: 28, fontWeight: 800, marginTop: 4, color: "#f59e0b" }}>
                                {feedbacks.filter(f => f.rating === r).length}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="ms-card">
                <div className="ms-card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <span><FaStar className="me-2 text-warning" />All Reviews</span>
                    <div className="d-flex gap-2">
                        <div className="input-group input-group-sm">
                            <span className="input-group-text"><FaSearch /></span>
                            <input className="form-control" style={{ width: 180 }} placeholder="Doctor or patient..."
                                value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <select className="form-select form-select-sm" style={{ width: 120 }}
                            value={ratingFilter} onChange={e => setRatingFilter(e.target.value)}>
                            <option value="ALL">All Ratings</option>
                            {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{"★".repeat(r)}</option>)}
                        </select>
                    </div>
                </div>
                <div className="table-responsive mt-2">
                    <table className="table table-hover align-middle">
                        <thead>
                            <tr style={{ background: "var(--surface-2,#f8faff)", fontSize: 13 }}>
                                <th>#</th><th>Patient</th><th>Doctor</th><th>Rating</th><th>Review</th><th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-5" style={{ color: "#94a3b8" }}>No feedback found.</td></tr>
                            ) : filtered.map((fb, i) => (
                                <tr key={fb.id}>
                                    <td style={{ fontSize: 13 }}>{i + 1}</td>
                                    <td style={{ fontSize: 13, fontWeight: 600 }}>{fb.patientName}</td>
                                    <td style={{ fontSize: 13 }}>Dr. {fb.doctorName}</td>
                                    <td style={{ color: "#f59e0b", fontSize: 15, letterSpacing: 1 }}>
                                        {"★".repeat(fb.rating)}<span style={{ color: "#d1d5db" }}>{"★".repeat(5 - fb.rating)}</span>
                                    </td>
                                    <td style={{ fontSize: 13, maxWidth: 250 }}>{fb.review}</td>
                                    <td style={{ fontSize: 12, color: "#94a3b8" }}>{fb.createdAt?.slice(0, 10)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}

export default AdminFeedback;
