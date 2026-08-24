import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import Loader from "../../components/common/Loader";
import SearchBar from "../../components/common/SearchBar";
import Pagination from "../../components/common/Pagination";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import StatusBadge from "../../components/common/StatusBadge";
import AddPatientModal from "../../components/patient/AddPatientModal";
import { toast } from "react-toastify";
import { FaPlus, FaUsers } from "react-icons/fa";
import { getPatientsPage, searchPatientByName, deletePatient } from "../../services/patientService";

const BLOOD_COLORS = {
    "A+": "#0d6efd", "A-": "#6f42c1", "B+": "#20c997", "B-": "#198754",
    "AB+": "#fd7e14", "AB-": "#dc3545", "O+": "#0dcaf0", "O-": "#ffc107"
};

function Patients() {
    const [patients, setPatients]     = useState([]);
    const [loading, setLoading]       = useState(true);
    const [search, setSearch]         = useState("");
    const [showModal, setShowModal]   = useState(false);
    const [selected, setSelected]     = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [showConfirm, setShowConfirm] = useState(false);
    const [toDelete, setToDelete]     = useState(null);
    const PAGE_SIZE = 8;

    useEffect(() => { loadPatients(currentPage); }, [currentPage]);

    const loadPatients = async (page) => {
        try {
            setLoading(true);
            const data = await getPatientsPage(page, PAGE_SIZE);
            setPatients(data.content);
            setTotalPages(data.totalPages);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleSearch = async (val) => {
        setSearch(val);
        if (!val.trim()) { loadPatients(currentPage); return; }
        try {
            const data = await searchPatientByName(val);
            setPatients(data);
        } catch (e) { console.error(e); }
    };

    const handleDelete = async () => {
        try {
            await deletePatient(toDelete);
            toast.success("Patient deleted successfully!");
            loadPatients(currentPage);
        } catch { toast.error("Delete failed."); }
        finally { setShowConfirm(false); setToDelete(null); }
    };

    return (
        <AdminLayout title="Patients" subtitle="Manage all registered patients">

            {/* Toolbar */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <SearchBar value={search} onChange={handleSearch} placeholder="Search by name..." />
                <button className="ms-btn ms-btn-primary ms-btn-sm" onClick={() => { setSelected(null); setShowModal(true); }}>
                    <FaPlus /> Add Patient
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
                                <th>Age / Gender</th>
                                <th>Phone</th>
                                <th>Blood Group</th>
                                <th>Disease</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.length === 0 ? (
                                <tr><td colSpan={8} className="text-center py-5" style={{ color: "var(--gray-400)" }}>
                                    <FaUsers style={{ fontSize: 36, display: "block", margin: "0 auto 8px" }} />
                                    No patients found
                                </td></tr>
                            ) : patients.map((p, i) => (
                                <tr key={p.id}>
                                    <td style={{ color: "var(--gray-400)", fontSize: 12 }}>{currentPage * PAGE_SIZE + i + 1}</td>
                                    <td>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <div style={{
                                                width: 36, height: 36, borderRadius: "50%",
                                                background: "linear-gradient(135deg, #6f42c1, #20c997)",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                color: "#fff", fontWeight: 700, fontSize: 13, flexShrink: 0
                                            }}>
                                                {p.patientName?.[0] || "P"}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: 14 }}>{p.patientName}</div>
                                                <div style={{ fontSize: 12, color: "var(--gray-500)" }}>{p.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{p.age} yrs / {p.gender}</td>
                                    <td>{p.phone}</td>
                                    <td>
                                        <span style={{
                                            display: "inline-block", padding: "2px 10px", borderRadius: 20,
                                            background: (BLOOD_COLORS[p.bloodGroup] || "#6c757d") + "18",
                                            color: BLOOD_COLORS[p.bloodGroup] || "#6c757d",
                                            fontSize: 12, fontWeight: 700
                                        }}>
                                            {p.bloodGroup}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: 13 }}>{p.disease || "—"}</td>
                                    <td><StatusBadge status={p.status ? "active" : "inactive"} /></td>
                                    <td>
                                        <button className="ms-btn ms-btn-warning ms-btn-sm me-1"
                                            onClick={() => { setSelected(p); setShowModal(true); }}>Edit</button>
                                        <button className="ms-btn ms-btn-danger ms-btn-sm"
                                            onClick={() => { setToDelete(p.id); setShowConfirm(true); }}>Delete</button>
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

            <ConfirmDialog show={showConfirm} title="Delete Patient"
                message="Are you sure you want to delete this patient?"
                onConfirm={handleDelete} onCancel={() => { setShowConfirm(false); setToDelete(null); }} />

            {showModal && (
                <AddPatientModal
                    patientData={selected}
                    onClose={() => { setShowModal(false); setSelected(null); }}
                    onSuccess={() => loadPatients(currentPage)}
                />
            )}
        </AdminLayout>
    );
}

export default Patients;