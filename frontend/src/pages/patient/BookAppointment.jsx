import { useEffect, useState } from "react";
import PatientLayout from "../../layouts/PatientLayout";
import Loader from "../../components/common/Loader";
import { toast } from "react-toastify";
import { FaCalendarPlus, FaUserMd, FaStar } from "react-icons/fa";
import { getAvailableDoctors } from "../../services/doctorService";
import { bookAppointmentPatient } from "../../services/appointmentService";
import { useNavigate } from "react-router-dom";

function BookAppointment() {
    const navigate = useNavigate();
    const [doctors, setDoctors]   = useState([]);
    const [loading, setLoading]   = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState({
        doctorId: "", appointmentDate: "", appointmentTime: "", reason: ""
    });

    useEffect(() => {
        getAvailableDoctors()
            .then(setDoctors)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleSelectDoctor = (doc) => {
        setSelected(doc);
        setForm(f => ({ ...f, doctorId: doc.id }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.doctorId) { toast.error("Please select a doctor."); return; }
        setSubmitting(true);
        try {
            await bookAppointmentPatient(form);
            toast.success("Appointment booked successfully! Confirmation sent to your email.");
            navigate("/patient/appointments");
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data || "Booking failed.";
            toast.error(typeof msg === "string" ? msg : "Booking failed.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <PatientLayout title="Book Appointment" subtitle="Choose a doctor and schedule your visit">
            <div style={{
                background: "#fff",
                minHeight: "calc(100vh - 80px)",
                paddingBottom: 40
            }}>
                {/* Top Banner */}
                <div style={{
                    background: "linear-gradient(135deg, #4477d9, #3562bb)",
                    padding: "60px 40px",
                    color: "#fff",
                    marginBottom: 50,
                    borderRadius: "0 0 24px 24px"
                }}>
                    <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 12 }}>Home — <span style={{ opacity: 1 }}>Appointment</span></div>
                    <h1 style={{ fontSize: 36, fontWeight: 700, margin: 0 }}>Appointment</h1>
                </div>

                <div className="container">
                    <div className="row g-5">
                        {/* Left Column: Form */}
                        <div className="col-lg-6">
                            <div style={{ marginBottom: 30 }}>
                                <div style={{ fontSize: 14, color: "#4477d9", fontWeight: 700, fontStyle: "italic", marginBottom: 8 }}>Online Booking</div>
                                <h2 style={{ fontSize: 42, fontWeight: 800, color: "#222", lineHeight: 1.2 }}>Make an<br/>Appointment</h2>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <div className="ms-form-group">
                                            <label className="ms-form-label" style={{ fontSize: 13, color: "#666" }}>Select Doctor</label>
                                            <select className="ms-form-control" 
                                                value={form.doctorId} 
                                                onChange={e => {
                                                    const doc = doctors.find(d => d.id === Number(e.target.value) || d.id === e.target.value);
                                                    setSelected(doc || null);
                                                    setForm({...form, doctorId: e.target.value});
                                                }}
                                                required
                                                style={{ border: "none", borderBottom: "1px solid #0d6efd", borderRadius: 0, padding: "8px 0", background: "transparent" }}>
                                                <option value="">Select a Doctor</option>
                                                {doctors.map(d => (
                                                    <option key={d.id} value={d.id}>Dr. {d.doctorName} - {d.specialization}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="ms-form-group">
                                            <label className="ms-form-label" style={{ fontSize: 13, color: "#666" }}>Date</label>
                                            <input type="date" className="ms-form-control"
                                                value={form.appointmentDate}
                                                onChange={e => setForm({ ...form, appointmentDate: e.target.value })}
                                                min={new Date().toISOString().split("T")[0]}
                                                required
                                                style={{ border: "none", borderBottom: "1px solid #0d6efd", borderRadius: 0, padding: "8px 0", background: "transparent" }} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="ms-form-group">
                                            <label className="ms-form-label" style={{ fontSize: 13, color: "#666" }}>Preferred Time</label>
                                            <input type="time" className="ms-form-control"
                                                value={form.appointmentTime}
                                                onChange={e => setForm({ ...form, appointmentTime: e.target.value })}
                                                required
                                                style={{ border: "none", borderBottom: "1px solid #0d6efd", borderRadius: 0, padding: "8px 0", background: "transparent" }} />
                                        </div>
                                    </div>
                                    <div className="col-12 mt-4">
                                        <div className="ms-form-group">
                                            <label className="ms-form-label" style={{ fontSize: 13, color: "#666" }}>Your Message</label>
                                            <textarea className="ms-form-control" rows={3}
                                                value={form.reason}
                                                onChange={e => setForm({ ...form, reason: e.target.value })}
                                                style={{ resize: "none", border: "1px solid #0d6efd", borderRadius: 8, padding: 12, background: "transparent" }} required />
                                        </div>
                                    </div>
                                    <div className="col-12 mt-4">
                                        <button type="submit" className="ms-btn" 
                                            style={{ background: "#4477d9", color: "#fff", padding: "12px 32px", fontSize: 15, fontWeight: 700, borderRadius: 30 }}
                                            disabled={submitting || !selected}>
                                            {submitting ? "Booking..." : "Book Appointment"}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Right Column: Why Us */}
                        <div className="col-lg-6">
                            <div style={{ paddingLeft: "40px" }}>
                                <div style={{ fontSize: 14, color: "#4477d9", fontWeight: 700, fontStyle: "italic", marginBottom: 8 }}>Why Us</div>
                                <h2 style={{ fontSize: 42, fontWeight: 800, color: "#222", lineHeight: 1.2, marginBottom: 16 }}>Why Choose Us</h2>
                                <p style={{ color: "#666", fontSize: 15, lineHeight: 1.6, marginBottom: 30, borderBottom: "1px solid #eee", paddingBottom: 30 }}>
                                    Medicare Health Center, the No.1 Multi speciality Hospital in South Tamil Nadu, providing exceptional care around the clock.
                                </p>

                                <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
                                    <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                                        <div style={{ fontSize: 32, color: "#4477d9", opacity: 0.8 }}>📈</div>
                                        <div>
                                            <div style={{ fontSize: 18, fontWeight: 700, color: "#333", marginBottom: 4 }}>Doctors on Duty</div>
                                            <div style={{ fontSize: 14, color: "#777" }}>450+ doctors available round the clock</div>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                                        <div style={{ fontSize: 32, color: "#4477d9", opacity: 0.8 }}>🏥</div>
                                        <div>
                                            <div style={{ fontSize: 18, fontWeight: 700, color: "#333", marginBottom: 4 }}>Happy Patients</div>
                                            <div style={{ fontSize: 14, color: "#777" }}>40 Lakh+ Happy Patients</div>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                                        <div style={{ fontSize: 32, color: "#4477d9", opacity: 0.8 }}>🩺</div>
                                        <div>
                                            <div style={{ fontSize: 18, fontWeight: 700, color: "#333", marginBottom: 4 }}>Nursing Staff</div>
                                            <div style={{ fontSize: 14, color: "#777" }}>1100+ Dedicated Nursing Staff</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PatientLayout>
    );
}

export default BookAppointment;
