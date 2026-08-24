import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import Loader from "../../components/common/Loader";
import { getAllPrescriptions, deletePrescription } from "../../services/prescriptionService";
import { toast } from "react-toastify";
import { FaFileMedical, FaTrash, FaSearch, FaDownload } from "react-icons/fa";
import api from "../../api/api";

function AdminPrescriptions() {
    const [prescriptions, setPrescriptions] = useState([]);
    const [filtered,      setFiltered]      = useState([]);
    const [loading,       setLoading]       = useState(true);
    const [search,        setSearch]        = useState("");
    const [downloading,   setDownloading]   = useState(null);

    const load = async () => {
        try {
            const data = await getAllPrescriptions();
            setPrescriptions(data);
            setFiltered(data);
        } catch {
            toast.error("Failed to load prescriptions.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    useEffect(() => {
        const q = search.toLowerCase();
        setFiltered(prescriptions.filter(p =>
            p.patientName?.toLowerCase().includes(q) ||
            p.doctorName?.toLowerCase().includes(q) ||
            p.medicine?.toLowerCase().includes(q)
        ));
    }, [search, prescriptions]);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this prescription?")) return;
        try {
            await deletePrescription(id);
            toast.success("Prescription deleted.");
            load();
        } catch {
            toast.error("Failed to delete prescription.");
        }
    };

    const handleDownloadPdf = async (id) => {
        setDownloading(id);
        try {
            const response = await api.get(`/prescriptions/${id}/pdf`, {
                responseType: "blob",
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `prescription-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch {
            toast.error("Failed to download PDF.");
        } finally {
            setDownloading(null);
        }
    };

    if (loading) return <AdminLayout title="Prescriptions"><Loader text="Loading..." /></AdminLayout>;

    return (
        <AdminLayout title="Prescriptions" subtitle="View and manage all patient prescriptions">
            <div className="ms-card">
                <div className="ms-card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <span><FaFileMedical className="me-2 text-success" />All Prescriptions ({prescriptions.length})</span>
                    <div className="input-group input-group-sm" style={{ width: 260 }}>
                        <span className="input-group-text"><FaSearch /></span>
                        <input
                            className="form-control"
                            placeholder="Search patient, doctor, medicine..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="table-responsive mt-2">
                    <table className="table table-hover align-middle">
                        <thead>
                            <tr style={{ background: "var(--surface-2,#f8faff)", fontSize: 13 }}>
                                <th>#</th>
                                <th>Patient</th>
                                <th>Doctor</th>
                                <th>Medicine</th>
                                <th>Dosage</th>
                                <th>Duration</th>
                                <th>Notes</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-5" style={{ color: "#94a3b8" }}>
                                        <div style={{ fontSize: 40, marginBottom: 8 }}>💊</div>
                                        No prescriptions found.
                                    </td>
                                </tr>
                            ) : filtered.map((p, i) => (
                                <tr key={p.id}>
                                    <td style={{ fontSize: 13 }}>{i + 1}</td>
                                    <td style={{ fontSize: 13, fontWeight: 600 }}>{p.patientName}</td>
                                    <td style={{ fontSize: 13 }}>Dr. {p.doctorName}</td>
                                    <td style={{ fontSize: 13 }}>{p.medicine}</td>
                                    <td style={{ fontSize: 13 }}>{p.dosage}</td>
                                    <td style={{ fontSize: 13 }}>{p.duration}</td>
                                    <td style={{ fontSize: 12, color: "#64748b", maxWidth: 160 }}>{p.notes || "—"}</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-sm btn-outline-success"
                                                title="Download PDF"
                                                onClick={() => handleDownloadPdf(p.id)}
                                                disabled={downloading === p.id}
                                            >
                                                <FaDownload />
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                title="Delete"
                                                onClick={() => handleDelete(p.id)}
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}

export default AdminPrescriptions;
