import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import Loader from "../../components/common/Loader";
import { getAllLeaves, approveLeave, rejectLeave } from "../../services/leaveService";
import { toast } from "react-toastify";
import { FaCalendarTimes, FaCheck, FaTimes } from "react-icons/fa";

const STATUS_STYLES = {
    PENDING:  { bg: "#fff7ed", color: "#ea580c", border: "#fed7aa" },
    APPROVED: { bg: "#f0fdf4", color: "#16a34a", border: "#86efac" },
    REJECTED: { bg: "#fef2f2", color: "#dc2626", border: "#fca5a5" },
};

function Leaves() {
    const [leaves,  setLeaves]  = useState([]);
    const [loading, setLoading] = useState(true);
    const [search,  setSearch]  = useState("");
    const [filter,  setFilter]  = useState("ALL");

    const load = async () => {
        try {
            const data = await getAllLeaves();
            setLeaves(data);
        } catch {
            toast.error("Failed to load leaves.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleApprove = async id => {
        try {
            await approveLeave(id);
            toast.success("Leave approved!");
            load();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to approve.");
        }
    };

    const handleReject = async id => {
        try {
            await rejectLeave(id);
            toast.success("Leave rejected.");
            load();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to reject.");
        }
    };

    if (loading) return <AdminLayout title="Doctor Leaves"><Loader text="Loading..." /></AdminLayout>;

    const filtered = leaves.filter(l => {
        const matchSearch = l.doctorName?.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === "ALL" || l.status === filter;
        return matchSearch && matchFilter;
    });

    return (
        <AdminLayout title="Doctor Leave Management" subtitle="Review and manage doctor leave requests">
            <div className="ms-card">
                <div className="ms-card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <span><FaCalendarTimes className="me-2 text-warning" />Leave Requests ({leaves.length})</span>
                    <div className="d-flex gap-2">
                        <input className="form-control form-control-sm" style={{ width: 180 }}
                            placeholder="Search doctor..." value={search}
                            onChange={e => setSearch(e.target.value)} />
                        <select className="form-select form-select-sm" style={{ width: 130 }}
                            value={filter} onChange={e => setFilter(e.target.value)}>
                            <option value="ALL">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                    </div>
                </div>
                <div className="table-responsive mt-2">
                    <table className="table table-hover align-middle">
                        <thead>
                            <tr style={{ background: "var(--surface-2,#f8faff)", fontSize: 13 }}>
                                <th>#</th>
                                <th>Doctor</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Reason</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-5" style={{ color: "#94a3b8" }}>
                                        No leave requests found.
                                    </td>
                                </tr>
                            ) : filtered.map((l, i) => {
                                const s = STATUS_STYLES[l.status] || STATUS_STYLES.PENDING;
                                return (
                                    <tr key={l.id}>
                                        <td style={{ fontSize: 13 }}>{i + 1}</td>
                                        <td style={{ fontSize: 13, fontWeight: 600 }}>Dr. {l.doctorName}</td>
                                        <td style={{ fontSize: 13 }}>{l.startDate}</td>
                                        <td style={{ fontSize: 13 }}>{l.endDate}</td>
                                        <td style={{ fontSize: 13, maxWidth: 180 }}>{l.reason}</td>
                                        <td>
                                            <span style={{
                                                padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                                                background: s.bg, color: s.color, border: `1px solid ${s.border}`
                                            }}>
                                                {l.status}
                                            </span>
                                        </td>
                                        <td>
                                            {l.status === "PENDING" && (
                                                <div className="d-flex gap-2">
                                                    <button className="btn btn-sm btn-success" onClick={() => handleApprove(l.id)}>
                                                        <FaCheck className="me-1" /> Approve
                                                    </button>
                                                    <button className="btn btn-sm btn-danger" onClick={() => handleReject(l.id)}>
                                                        <FaTimes className="me-1" /> Reject
                                                    </button>
                                                </div>
                                            )}
                                            {l.status !== "PENDING" && (
                                                <span style={{ fontSize: 12, color: "#94a3b8" }}>—</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}

export default Leaves;
