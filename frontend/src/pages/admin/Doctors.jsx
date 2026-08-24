import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import Loader from "../../components/common/Loader";
import SearchBar from "../../components/common/SearchBar";
import Pagination from "../../components/common/Pagination";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import StatusBadge from "../../components/common/StatusBadge";
import AddDoctorModal from "../../components/doctor/AddDoctorModal";
import { toast } from "react-toastify";
import { FaPlus, FaFileExcel, FaUserMd } from "react-icons/fa";
import { exportToExcel } from "../../utils/exportExcel";
import { getDoctorsPage, searchDoctors, deleteDoctor } from "../../services/doctorService";

function Doctors() {
    const [doctors, setDoctors]       = useState([]);
    const [loading, setLoading]       = useState(true);
    const [search, setSearch]         = useState("");
    const [showModal, setShowModal]   = useState(false);
    const [selected, setSelected]     = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [showConfirm, setShowConfirm] = useState(false);
    const [toDelete, setToDelete]     = useState(null);
    const PAGE_SIZE = 8;

    useEffect(() => { loadDoctors(currentPage); }, [currentPage]);

    const loadDoctors = async (page) => {
        try {
            setLoading(true);
            const data = await getDoctorsPage(page, PAGE_SIZE);
            setDoctors(data.content);
            setTotalPages(data.totalPages);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleSearch = async (val) => {
        setSearch(val);
        if (!val.trim()) { loadDoctors(currentPage); return; }
        try {
            const data = await searchDoctors(val);
            setDoctors(data);
        } catch (e) { console.error(e); }
    };

    const handleDelete = async () => {
        try {
            await deleteDoctor(toDelete);
            toast.success("Doctor deleted successfully!");
            loadDoctors(currentPage);
        } catch { toast.error("Delete failed."); }
        finally { setShowConfirm(false); setToDelete(null); }
    };

    const openEdit = (doc) => { setSelected(doc); setShowModal(true); };
    const openAdd  = ()     => { setSelected(null); setShowModal(true); };

    return (
        <AdminLayout title="Doctors" subtitle="Manage all registered doctors">

            {/* Toolbar */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <SearchBar value={search} onChange={handleSearch} placeholder="Search by name..." />
                <div style={{ display: "flex", gap: 10 }}>
                    <button className="ms-btn ms-btn-outline ms-btn-sm" onClick={() => exportToExcel(doctors, "Doctors")}>
                        <FaFileExcel /> Export Excel
                    </button>
                    <button className="ms-btn ms-btn-primary ms-btn-sm" onClick={openAdd}>
                        <FaPlus /> Add Doctor
                    </button>
                </div>
            </div>

            {/* Table */}
            {loading ? <Loader /> : (
                <div className="ms-table-card">
                    <table className="table table-hover mb-0">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Doctor</th>
                                <th>Specialization</th>
                                <th>Qualification</th>
                                <th>Exp.</th>
                                <th>Phone</th>
                                <th>DOB</th>
                                <th>Fee</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctors.length === 0 ? (
                                <tr><td colSpan={9} className="text-center py-5" style={{ color: "var(--gray-400)" }}>
                                    <FaUserMd style={{ fontSize: 36, marginBottom: 8, display: "block", margin: "0 auto 8px" }} />
                                    No doctors found
                                </td></tr>
                            ) : doctors.map((doc, i) => (
                                <tr key={doc.id}>
                                    <td style={{ color: "var(--gray-400)", fontSize: 12 }}>{currentPage * PAGE_SIZE + i + 1}</td>
                                    <td>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <div style={{
                                                width: 36, height: 36, borderRadius: "50%",
                                                background: "linear-gradient(135deg, #0d6efd, #20c997)",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                color: "#fff", fontWeight: 700, fontSize: 13, flexShrink: 0
                                            }}>
                                                {doc.doctorName?.[0] || "D"}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: 14 }}>{doc.doctorName}</div>
                                                <div style={{ fontSize: 12, color: "var(--gray-500)" }}>{doc.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span style={{ fontSize: 13, color: "#0d6efd", fontWeight: 500 }}>{doc.specialization}</span></td>
                                    <td>{doc.qualification}</td>
                                    <td>{doc.experience} yrs</td>
                                    <td>{doc.phone}</td>
                                    <td>{doc.dob}</td>
                                    <td>₹ {doc.consultationFee}</td>
                                    <td><StatusBadge status={doc.status ? "active" : "inactive"} /></td>
                                    <td>
                                        <button className="ms-btn ms-btn-warning ms-btn-sm me-1" onClick={() => openEdit(doc)}>Edit</button>
                                        <button className="ms-btn ms-btn-danger ms-btn-sm" onClick={() => { setToDelete(doc.id); setShowConfirm(true); }}>Delete</button>
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

            <ConfirmDialog show={showConfirm} title="Delete Doctor"
                message="Are you sure you want to delete this doctor? This action cannot be undone."
                onConfirm={handleDelete} onCancel={() => { setShowConfirm(false); setToDelete(null); }} />

            {showModal && (
                <AddDoctorModal
                    doctorData={selected}
                    onClose={() => { setShowModal(false); setSelected(null); }}
                    onSuccess={() => loadDoctors(currentPage)}
                />
            )}
        </AdminLayout>
    );
}

export default Doctors;