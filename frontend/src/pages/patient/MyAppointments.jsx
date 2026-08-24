import { useEffect, useState } from "react";
import PatientLayout from "../../layouts/PatientLayout";
import Loader from "../../components/common/Loader";
import StatusBadge from "../../components/common/StatusBadge";
import { FaCalendarCheck, FaFileMedical, FaEdit, FaTrash, FaDownload } from "react-icons/fa";
import { getMyAppointmentsPatient, deleteAppointment } from "../../services/appointmentService";
import { getMyPrescriptions } from "../../services/prescriptionService";
import RescheduleModal from "../../components/appointment/RescheduleModal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { toast } from "react-toastify";
import api from "../../api/api";

function PatientAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading]   = useState(true);
    const [filter, setFilter]     = useState("ALL");
    const [expanded, setExpanded] = useState(null);
    const [reschedule, setReschedule] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [toDelete, setToDelete] = useState(null);
    const [downloading, setDownloading] = useState(null);

    const load = () => {
        setLoading(true);
        Promise.all([getMyAppointmentsPatient(), getMyPrescriptions()])
            .then(([appts, prescs]) => { setAppointments(appts); setPrescriptions(prescs); })
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    const handleDelete = async () => {
        try {
            await deleteAppointment(toDelete);
            toast.success("Appointment deleted successfully");
            load();
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || err.response?.data || "Failed to delete appointment";
            toast.error(typeof msg === "string" ? msg : "Failed to delete appointment");
        } finally {
            setShowConfirm(false);
            setToDelete(null);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const getPrescription = (appointmentId) =>
        prescriptions.find(p => p.appointmentId === appointmentId);

    const handleDownloadPdf = async (prescriptionId) => {
        setDownloading(prescriptionId);
        try {
            const response = await api.get(`/prescriptions/${prescriptionId}/pdf`, {
                responseType: "blob",
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `prescription-${prescriptionId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success("Prescription PDF downloaded!");
        } catch {
            toast.error("Failed to download prescription PDF.");
        } finally {
            setDownloading(null);
        }
    };

    const filtered = filter === "ALL"
        ? appointments
        : appointments.filter(a => a.status === filter);

    return (
        <PatientLayout title="My Appointments" subtitle="All your booked appointments">

            {/* Filter Tabs */}
            <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
                {["ALL", "PENDING", "APPROVED", "COMPLETED", "CANCELLED"].map(f => (
                    <button key={f}
                        onClick={() => setFilter(f)}
                        className={`ms-btn ms-btn-sm ${filter === f ? "ms-btn-primary" : "ms-btn-outline"}`}>
                        {f}
                    </button>
                ))}
            </div>

            {loading ? <Loader /> : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {filtered.length === 0 ? (
                        <div className="ms-card text-center" style={{ padding: 48 }}>
                            <FaCalendarCheck style={{ fontSize: 48, color: "var(--gray-300)", marginBottom: 12 }} />
                            <p style={{ color: "var(--gray-400)", fontSize: 15 }}>No appointments found</p>
                        </div>
                    ) : filtered.map(a => {
                        const presc = getPrescription(a.id);
                        const isOpen = expanded === a.id;

                        return (
                            <div key={a.id} className="ms-card" style={{ padding: 0, overflow: "hidden" }}>
                                {/* Main Row */}
                                <div style={{ display: "flex", alignItems: "center", gap: 16, padding: 18 }}>
                                    {/* Date Box */}
                                    <div style={{
                                        minWidth: 56, height: 56, borderRadius: 10,
                                        background: "var(--primary-light)", color: "#0d6efd",
                                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                        fontWeight: 800, fontSize: 18, lineHeight: 1.1, flexShrink: 0
                                    }}>
                                        <span>{a.appointmentDate?.split("-")[2] || "—"}</span>
                                        <span style={{ fontSize: 10, fontWeight: 600 }}>
                                            {a.appointmentDate ? new Date(a.appointmentDate).toLocaleString("en-US", { month: "short" }) : ""}
                                        </span>
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 3 }}>
                                            Dr. {a.doctorName}
                                            {a.doctorSpecialization && (
                                                <span style={{ fontSize: 12, color: "#20c997", fontWeight: 500, marginLeft: 8 }}>
                                                    {a.doctorSpecialization}
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ fontSize: 13, color: "var(--gray-500)" }}>
                                            {a.appointmentDate} at {a.appointmentTime}
                                            {a.reason && <span style={{ marginLeft: 8 }}>• {a.reason}</span>}
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <StatusBadge status={a.status?.toLowerCase()} />
                                        {(a.status === "PENDING" || a.status === "APPROVED") && (
                                            <button className="ms-btn ms-btn-sm" style={{
                                                background: "rgba(13,110,253,0.1)", color: "#0d6efd", border: "none"
                                            }} onClick={() => setReschedule(a)}>
                                                <FaEdit /> Reschedule
                                            </button>
                                        )}
                                        <button className="ms-btn ms-btn-sm" style={{
                                            background: "rgba(220,53,69,0.1)", color: "#dc3545", border: "none"
                                        }} onClick={() => { setToDelete(a.id); setShowConfirm(true); }}>
                                            <FaTrash /> Delete
                                        </button>
                                        {presc && (
                                            <>
                                                <button
                                                    className="ms-btn ms-btn-sm"
                                                    style={{ background: "rgba(32,201,151,0.12)", color: "#20c997", border: "none" }}
                                                    onClick={() => setExpanded(isOpen ? null : a.id)}
                                                >
                                                    <FaFileMedical /> Prescription
                                                </button>
                                                <button
                                                    className="ms-btn ms-btn-sm"
                                                    style={{ background: "rgba(13,110,253,0.1)", color: "#0d6efd", border: "none" }}
                                                    onClick={() => handleDownloadPdf(presc.id)}
                                                    disabled={downloading === presc.id}
                                                    title="Download Prescription PDF"
                                                >
                                                    <FaDownload /> {downloading === presc.id ? "..." : "PDF"}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Prescription Expand */}
                                {presc && isOpen && (
                                    <div style={{
                                        background: "rgba(32,201,151,0.06)",
                                        borderTop: "1px solid var(--border-color)",
                                        padding: "14px 18px"
                                    }}>
                                        <div style={{ fontWeight: 600, fontSize: 13, color: "#20c997", marginBottom: 8 }}>
                                            <FaFileMedical /> Prescription Details
                                        </div>
                                        <div className="row g-2">
                                            {[
                                                { label: "Medicine", value: presc.medicine },
                                                { label: "Dosage",   value: presc.dosage },
                                                { label: "Duration", value: presc.duration },
                                                { label: "Notes",    value: presc.notes || "—" },
                                            ].map(f => (
                                                <div key={f.label} className="col-md-3">
                                                    <div style={{ fontSize: 10, color: "var(--gray-400)", textTransform: "uppercase" }}>{f.label}</div>
                                                    <div style={{ fontWeight: 600, fontSize: 14 }}>{f.value}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Reschedule Modal */}
            {reschedule && (
                <RescheduleModal
                    appointment={reschedule}
                    onClose={() => setReschedule(null)}
                    onSuccess={load}
                />
            )}

            <ConfirmDialog show={showConfirm} title="Delete Appointment"
                message="Are you sure you want to delete this appointment?"
                onConfirm={handleDelete} onCancel={() => { setShowConfirm(false); setToDelete(null); }} />
        </PatientLayout>
    );
}

export default PatientAppointments;
