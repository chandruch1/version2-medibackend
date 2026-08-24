import { useEffect, useState } from "react";
import DoctorLayout from "../../layouts/DoctorLayout";
import Loader from "../../components/common/Loader";
import { getAllPrescriptions } from "../../services/prescriptionService";
import { FaFileMedical } from "react-icons/fa";

function DoctorPrescriptions() {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading]             = useState(true);

    useEffect(() => {
        getAllPrescriptions()
            .then(setPrescriptions)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <DoctorLayout title="Prescriptions" subtitle="All prescriptions you have added">
            {loading ? <Loader /> : (
                <div className="ms-table-card">
                    <table className="table table-hover mb-0">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Patient</th>
                                <th>Medicine</th>
                                <th>Dosage</th>
                                <th>Duration</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prescriptions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-5" style={{ color: "var(--gray-400)" }}>
                                        <FaFileMedical style={{ fontSize: 36, display: "block", margin: "0 auto 8px" }} />
                                        No prescriptions added yet
                                    </td>
                                </tr>
                            ) : prescriptions.map((p, i) => (
                                <tr key={p.id}>
                                    <td style={{ fontSize: 12, color: "var(--gray-400)" }}>{i + 1}</td>
                                    <td style={{ fontWeight: 600 }}>{p.patientName || "—"}</td>
                                    <td>
                                        <span style={{
                                            background: "rgba(32,201,151,0.12)", color: "#20c997",
                                            padding: "3px 10px", borderRadius: 6, fontSize: 13, fontWeight: 600
                                        }}>
                                            {p.medicine}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: 13 }}>{p.dosage}</td>
                                    <td style={{ fontSize: 13 }}>{p.duration}</td>
                                    <td style={{ fontSize: 13, color: "var(--gray-500)" }}>{p.notes || "—"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </DoctorLayout>
    );
}

export default DoctorPrescriptions;
