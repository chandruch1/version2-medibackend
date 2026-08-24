import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import Loader from "../../components/common/Loader";
import SearchBar from "../../components/common/SearchBar";
import Pagination from "../../components/common/Pagination";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import StatusBadge from "../../components/common/StatusBadge";
import BookAppointmentModal from "../../components/appointment/BookAppointmentModal";
import { toast } from "react-toastify";
import { FaPlus, FaCalendarCheck } from "react-icons/fa";
import {
    getAppointmentsPage, deleteAppointment, completeAppointment,
    cancelAppointment, searchAppointmentByPatient
} from "../../services/appointmentService";

function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading]           = useState(true);
    const [search, setSearch]             = useState("");
    const [showModal, setShowModal]       = useState(false);
    const [selected, setSelected]         = useState(null);
    const [currentPage, setCurrentPage]   = useState(0);
    const [totalPages, setTotalPages]     = useState(0);
    const [showConfirm, setShowConfirm]   = useState(false);
    const [toDelete, setToDelete]         = useState(null);
    const [statusFilter, setStatusFilter] = useState("ALL");
    const PAGE_SIZE = 8;

    useEffect(() => { loadAppointments(currentPage); }, [currentPage]);

    const loadAppointments = async (page) => {
        try {
            setLoading(true);
            const data = await getAppointmentsPage(page, PAGE_SIZE);
            setAppointments(data.content);
            setTotalPages(data.totalPages);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleSearch = async (val) => {
        setSearch(val);
        if (!val.trim()) { loadAppointments(currentPage); return; }
        try {
            const data = await searchAppointmentByPatient(val);
            setAppointments(data);
        } catch (e) { console.error(e); }
    };

    const handleComplete = async (id) => {
        try { await completeAppointment(id); toast.success("Appointment marked completed!"); loadAppointments(currentPage); }
        catch { toast.error("Action failed."); }
    };

    const handleCancel = async (id) => {
        try { await cancelAppointment(id); toast.success("Appointment cancelled."); loadAppointments(currentPage); }
        catch { toast.error("Action failed."); }
    };

    const handleDelete = async () => {
        try { await deleteAppointment(toDelete); toast.success("Appointment deleted!"); loadAppointments(currentPage); }
        catch { toast.error("Delete failed."); }
        finally { setShowConfirm(false); setToDelete(null); }
    };

    const filtered = statusFilter === "ALL"
        ? appointments
        : appointments.filter(a => a.status === statusFilter);

    return (
        <AdminLayout title="Appointments" subtitle="View and manage all appointments">

            {/* Toolbar */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                    <SearchBar value={search} onChange={handleSearch} placeholder="Search patient..." />
                    <select
                        className="ms-form-control"
                        style={{ width: "auto", padding: "8px 14px" }}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="ALL">All Status</option>
                        <option value="BOOKED">Booked</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>
                <button className="ms-btn ms-btn-primary ms-btn-sm"
                    onClick={() => { setSelected(null); setShowModal(true); }}>
                    <FaPlus /> Book Appointment
                </button>
            </div>

            {/* Table */}
            {loading ? <Loader /> : (
                <div className="ms-table-card">
                    <table className="table table-hover mb-0">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Patient</th>
                                <th>Doctor</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Reason</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan={8} className="text-center py-5" style={{ color: "var(--gray-400)" }}>
                                    <FaCalendarCheck style={{ fontSize: 36, display: "block", margin: "0 auto 8px" }} />
                                    No appointments found
                                </td></tr>
                            ) : filtered.map((a, i) => (
                                <tr key={a.id}>
                                    <td style={{ fontSize: 12, color: "var(--gray-400)" }}>{currentPage * PAGE_SIZE + i + 1}</td>
                                    <td style={{ fontWeight: 600 }}>{a.patientName}</td>
                                    <td>
                                        <span style={{ color: "#0d6efd", fontWeight: 500, fontSize: 13 }}>
                                            Dr. {a.doctorName}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: 13 }}>{a.appointmentDate}</td>
                                    <td style={{ fontSize: 13 }}>{a.appointmentTime}</td>
                                    <td style={{ fontSize: 13, maxWidth: 140 }}>
                                        <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {a.reason || "—"}
                                        </span>
                                    </td>
                                    <td><StatusBadge status={a.status?.toLowerCase()} /></td>
                                    <td>
                                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                                            <button className="ms-btn ms-btn-warning ms-btn-sm"
                                                onClick={() => { setSelected(a); setShowModal(true); }}>Edit</button>
                                            {a.status !== "COMPLETED" && (
                                                <button className="ms-btn ms-btn-success ms-btn-sm"
                                                    onClick={() => handleComplete(a.id)}>Complete</button>
                                            )}
                                            {a.status !== "CANCELLED" && (
                                                <button className="ms-btn ms-btn-outline ms-btn-sm"
                                                    onClick={() => handleCancel(a.id)}>Cancel</button>
                                            )}
                                            <button className="ms-btn ms-btn-danger ms-btn-sm"
                                                onClick={() => { setToDelete(a.id); setShowConfirm(true); }}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Pagination currentPage={currentPage} totalPages={totalPages}
                onPrevious={() => setCurrentPage(p => p - 1)}
                onNext={() => setCurrentPage(p => p + 1)} />

            <ConfirmDialog show={showConfirm} title="Delete Appointment"
                message="Are you sure you want to delete this appointment?"
                onConfirm={handleDelete} onCancel={() => { setShowConfirm(false); setToDelete(null); }} />

            {showModal && (
                <BookAppointmentModal
                    appointmentData={selected}
                    onClose={() => { setShowModal(false); setSelected(null); }}
                    onSuccess={() => loadAppointments(currentPage)}
                />
            )}
        </AdminLayout>
    );
}

export default Appointments;