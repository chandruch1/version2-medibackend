import { useEffect, useState } from "react";
import PatientLayout from "../../layouts/PatientLayout";
import Loader from "../../components/common/Loader";
import { getMyPrescriptions } from "../../services/prescriptionService";
import { FaFileMedical, FaPills, FaClock, FaStickyNote, FaUserMd, FaSearch } from "react-icons/fa";

function PatientPrescriptions() {
    const [prescriptions, setPrescriptions] = useState([]);
    const [filtered,      setFiltered]      = useState([]);
    const [loading,       setLoading]        = useState(true);
    const [search,        setSearch]         = useState("");

    useEffect(() => {
        getMyPrescriptions()
            .then(data => {
                setPrescriptions(data);
                setFiltered(data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    // Live search – filter by medicine, doctor or notes
    useEffect(() => {
        const q = search.toLowerCase();
        if (!q) {
            setFiltered(prescriptions);
        } else {
            setFiltered(
                prescriptions.filter(p =>
                    (p.medicine   || "").toLowerCase().includes(q) ||
                    (p.doctorName || "").toLowerCase().includes(q) ||
                    (p.notes      || "").toLowerCase().includes(q)
                )
            );
        }
    }, [search, prescriptions]);

    return (
        <PatientLayout title="My Prescriptions" subtitle="All prescriptions issued by your doctors">

            {/* Search bar */}
            <div className="ms-card mb-4" style={{ padding: "16px 20px" }}>
                <div style={{ position: "relative", maxWidth: 400 }}>
                    <FaSearch style={{
                        position: "absolute", left: 12, top: "50%",
                        transform: "translateY(-50%)",
                        color: "var(--gray-400, #94a3b8)", fontSize: 14
                    }} />
                    <input
                        id="prescription-search"
                        type="text"
                        className="form-control"
                        placeholder="Search by medicine, doctor or notes..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ paddingLeft: 36, borderRadius: 10, fontSize: 14 }}
                    />
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <Loader text="Loading prescriptions..." />
            ) : filtered.length === 0 ? (
                <div className="ms-card" style={{ textAlign: "center", padding: "60px 20px" }}>
                    <FaFileMedical style={{
                        fontSize: 52, color: "var(--gray-300, #cbd5e1)",
                        display: "block", margin: "0 auto 16px"
                    }} />
                    <h5 style={{ color: "var(--gray-500, #64748b)", fontWeight: 600, marginBottom: 6 }}>
                        {search ? "No matching prescriptions found" : "No prescriptions yet"}
                    </h5>
                    <p style={{ color: "var(--gray-400, #94a3b8)", fontSize: 14, margin: 0 }}>
                        {search
                            ? "Try adjusting your search term."
                            : "Your prescriptions from doctors will appear here."}
                    </p>
                </div>
            ) : (
                <div className="row g-4">
                    {filtered.map((p, i) => (
                        <div className="col-12 col-md-6 col-xl-4" key={p.id ?? i}>
                            <PrescriptionCard prescription={p} index={i} />
                        </div>
                    ))}
                </div>
            )}
        </PatientLayout>
    );
}

/* Card component */
function PrescriptionCard({ prescription: p, index }) {
    return (
        <div
            className="ms-card h-100"
            style={{
                borderRadius: 16,
                overflow: "hidden",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "default",
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "";
            }}
        >
            {/* Card header stripe */}
            <div style={{
                background: "linear-gradient(135deg, #20c997 0%, #0d9488 100%)",
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                gap: 10,
            }}>
                <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: "rgba(255,255,255,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    <FaPills style={{ color: "#fff", fontSize: 17 }} />
                </div>
                <div>
                    <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>
                        {p.medicine || "—"}
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>
                        Prescription #{index + 1}
                    </div>
                </div>
            </div>

            {/* Card body */}
            <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12 }}>

                {p.doctorName && (
                    <InfoRow
                        icon={<FaUserMd style={{ color: "#6366f1" }} />}
                        label="Doctor"
                        value={p.doctorName}
                    />
                )}

                <InfoRow
                    icon={<FaPills style={{ color: "#20c997" }} />}
                    label="Dosage"
                    value={p.dosage || "—"}
                />

                <InfoRow
                    icon={<FaClock style={{ color: "#f59e0b" }} />}
                    label="Duration"
                    value={p.duration || "—"}
                />

                {p.notes && (
                    <div style={{
                        background: "var(--surface-2, #f8faff)",
                        border: "1px solid var(--border-color, #e5eaf3)",
                        borderRadius: 10,
                        padding: "10px 12px",
                    }}>
                        <div style={{
                            fontSize: 11, fontWeight: 600, letterSpacing: 0.6,
                            textTransform: "uppercase", color: "var(--gray-400, #94a3b8)",
                            marginBottom: 4, display: "flex", alignItems: "center", gap: 6
                        }}>
                            <FaStickyNote style={{ color: "#f59e0b" }} /> Notes
                        </div>
                        <div style={{ fontSize: 13, color: "var(--gray-700, #334155)" }}>
                            {p.notes}
                        </div>
                    </div>
                )}

                {p.prescribedDate && (
                    <div style={{
                        marginTop: "auto",
                        fontSize: 11, color: "var(--gray-400, #94a3b8)",
                        borderTop: "1px solid var(--border-color, #e5eaf3)",
                        paddingTop: 10,
                    }}>
                        Prescribed on&nbsp;
                        <strong style={{ color: "var(--gray-500, #64748b)" }}>
                            {new Date(p.prescribedDate).toLocaleDateString("en-IN", {
                                day: "numeric", month: "short", year: "numeric"
                            })}
                        </strong>
                    </div>
                )}
            </div>
        </div>
    );
}

function InfoRow({ icon, label, value }) {
    return (
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <div style={{
                width: 30, height: 30, borderRadius: 8,
                background: "var(--surface-2, #f8faff)",
                border: "1px solid var(--border-color, #e5eaf3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, fontSize: 13,
            }}>
                {icon}
            </div>
            <div>
                <div style={{
                    fontSize: 11, fontWeight: 600, letterSpacing: 0.5,
                    textTransform: "uppercase", color: "var(--gray-400, #94a3b8)",
                    lineHeight: 1,
                }}>
                    {label}
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--gray-800, #1e293b)", marginTop: 3 }}>
                    {value}
                </div>
            </div>
        </div>
    );
}

export default PatientPrescriptions;
