import { useEffect, useState } from "react";
import DoctorLayout from "../../layouts/DoctorLayout";
import Loader from "../../components/common/Loader";
import StatusBadge from "../../components/common/StatusBadge";
import PrescriptionModal from "../../components/appointment/PrescriptionModal";
import RescheduleModal from "../../components/appointment/RescheduleModal";
import { toast } from "react-toastify";
import { FaCheck, FaTimes, FaPills, FaCalendarCheck, FaEdit } from "react-icons/fa";
import { getMyAppointmentsDoctor, approveAppointment, rejectAppointment } from "../../services/appointmentService";

function DoctorAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading]           = useState(true);
    const [filter, setFilter]             = useState("ALL");
    const [prescription, setPrescription] = useState(null); // appointment for prescription
    const [reschedule, setReschedule]     = useState(null); // appointment for rescheduling

    const load = async () => {
        try {
            setLoading(true);
            const data = await getMyAppointmentsDoctor();
            setAppointments(data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { load(); }, []);

    const handleApprove = async (id) => {
        try { await approveAppointment(id); toast.success("Appointment approved!"); load(); }
        catch { toast.error("Action failed."); }
    };

    const handleReject = async (id) => {
        try { await rejectAppointment(id); toast.success("Appointment rejected."); load(); }
        catch { toast.error("Action failed."); }
    };

    const filtered = filter === "ALL"
        ? appointments
        : appointments.filter(a => a.status === filter);

    return (
        <DoctorLayout title="My Appointments" subtitle="Manage your patient appointments">
            {/* Filter Tabs */}
            <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
                {["ALL", "PENDING", "APPROVED", "COMPLETED", "REJECTED"].map(f => (
                    <button key={f}
                        onClick={() => setFilter(f)}
                        className={`ms-btn ms-btn-sm ${filter === f ? "ms-btn-primary" : "ms-btn-outline"}`}>
                        {f}
                        {f !== "ALL" && (
                            <span style={{
                                marginLeft: 6, background: filter === f ? "rgba(255,255,255,0.3)" : "var(--gray-200)",
                                borderRadius: 10, padding: "0 6px", fontSize: 11
                            }}>
                                {appointments.filter(a => a.status === f).length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {loading ? <Loader /> : (
                <div className="ms-table-card">
                    <table className="table table-hover mb-0">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Patient</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Reason</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan={7} className="text-center py-5" style={{ color: "var(--gray-400)" }}>
                                    <FaCalendarCheck style={{ fontSize: 36, display: "block", margin: "0 auto 8px" }} />
                                    No appointments found
                                </td></tr>
                            ) : filtered.map((a, i) => (
                                <tr key={a.id}>
                                    <td style={{ fontSize: 12, color: "var(--gray-400)" }}>{i + 1}</td>
                                    <td>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <div style={{
                                                width: 34, height: 34, borderRadius: "50%",
                                                background: "linear-gradient(135deg, #6f42c1, #0d6efd)",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                color: "#fff", fontWeight: 700, fontSize: 13, flexShrink: 0
                                            }}>
                                                {a.patientName?.[0] || "P"}
                                            </div>
                                            <span style={{ fontWeight: 600 }}>{a.patientName}</span>
                                        </div>
                                    </td>
                                    <td style={{ fontSize: 13 }}>{a.appointmentDate}</td>
                                    <td style={{ fontSize: 13 }}>{a.appointmentTime}</td>
                                    <td style={{ fontSize: 13, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {a.reason || "—"}
                                    </td>
                                    <td><StatusBadge status={a.status?.toLowerCase()} /></td>
                                    <td>
                                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                                            {a.status === "PENDING" && (
                                                <>
                                                    <button className="ms-btn ms-btn-success ms-btn-sm" onClick={() => handleApprove(a.id)}>
                                                        <FaCheck /> Approve
                                                    </button>
                                                    <button className="ms-btn ms-btn-danger ms-btn-sm" onClick={() => handleReject(a.id)}>
                                                        <FaTimes /> Reject
                                                    </button>
                                                </>
                                            )}
                                            {(a.status === "PENDING" || a.status === "APPROVED") && (
                                                <button className="ms-btn ms-btn-sm" style={{
                                                    background: "rgba(13,110,253,0.1)", color: "#0d6efd", border: "none"
                                                }} onClick={() => setReschedule(a)}>
                                                    <FaEdit /> Reschedule
                                                </button>
                                            )}
                                            {(a.status === "APPROVED" || a.status === "COMPLETED") && (
                                                <button className="ms-btn ms-btn-sm" style={{
                                                    background: "rgba(32,201,151,0.12)", color: "#20c997", border: "none"
                                                }} onClick={() => setPrescription(a)}>
                                                    <FaPills /> Prescribe
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Prescription Modal */}
            {prescription && (
                <PrescriptionModal
                    appointment={prescription}
                    onClose={() => setPrescription(null)}
                    onSuccess={load}
                />
            )}

            {/* Reschedule Modal */}
            {reschedule && (
                <RescheduleModal
                    appointment={reschedule}
                    onClose={() => setReschedule(null)}
                    onSuccess={load}
                />
            )}
        </DoctorLayout>
    );
}

export default DoctorAppointments;
