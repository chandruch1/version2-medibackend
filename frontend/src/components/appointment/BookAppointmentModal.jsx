import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";
import { bookAppointment, updateAppointment } from "../../services/appointmentService";
import { getDoctors } from "../../services/doctorService";
import { getPatients } from "../../services/patientService";

function BookAppointmentModal({ appointmentData, onClose, onSuccess }) {
    const isEdit = !!appointmentData;
    const [doctors, setDoctors]   = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading]   = useState(false);
    const [form, setForm] = useState({
        patientId: "", doctorId: "",
        appointmentDate: "", appointmentTime: "",
        reason: ""
    });

    useEffect(() => {
        Promise.all([getDoctors(), getPatients()])
            .then(([docs, pats]) => { setDoctors(docs); setPatients(pats); })
            .catch(console.error);

        if (appointmentData) {
            setForm({
                patientId: appointmentData.patientId || "",
                doctorId: appointmentData.doctorId || "",
                appointmentDate: appointmentData.appointmentDate || "",
                appointmentTime: appointmentData.appointmentTime || "",
                reason: appointmentData.reason || "",
            });
        }
    }, [appointmentData]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEdit) {
                await updateAppointment(appointmentData.id, form);
                toast.success("Appointment updated!");
            } else {
                await bookAppointment(form);
                toast.success("Appointment booked successfully!");
            }
            onSuccess();
            onClose();
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data || "Operation failed.";
            toast.error(typeof msg === "string" ? msg : "Operation failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ms-modal-overlay" onClick={onClose}>
            <div className="ms-modal" onClick={(e) => e.stopPropagation()}>
                <div className="ms-modal-header">
                    <span className="ms-modal-title">{isEdit ? "Edit Appointment" : "Book Appointment"}</span>
                    <button className="ms-modal-close" onClick={onClose}><FaTimes /></button>
                </div>

                <div className="ms-modal-body">
                    <form id="appt-form" onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-12">
                                <div className="ms-form-group">
                                    <label className="ms-form-label">Patient</label>
                                    <select name="patientId" className="ms-form-control"
                                        value={form.patientId} onChange={handleChange} required>
                                        <option value="">-- Select Patient --</option>
                                        {patients.map(p => (
                                            <option key={p.id} value={p.id}>{p.patientName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="ms-form-group">
                                    <label className="ms-form-label">Doctor</label>
                                    <select name="doctorId" className="ms-form-control"
                                        value={form.doctorId} onChange={handleChange} required>
                                        <option value="">-- Select Doctor --</option>
                                        {doctors.map(d => (
                                            <option key={d.id} value={d.id}>
                                                Dr. {d.doctorName} — {d.specialization}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="ms-form-group">
                                    <label className="ms-form-label">Date</label>
                                    <input type="date" name="appointmentDate" className="ms-form-control"
                                        value={form.appointmentDate} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="ms-form-group">
                                    <label className="ms-form-label">Time</label>
                                    <input type="time" name="appointmentTime" className="ms-form-control"
                                        value={form.appointmentTime} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="ms-form-group">
                                    <label className="ms-form-label">Reason</label>
                                    <textarea name="reason" className="ms-form-control" rows={3}
                                        value={form.reason} onChange={handleChange}
                                        placeholder="Describe the reason..." style={{ resize: "none" }} />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="ms-modal-footer">
                    <button className="ms-btn ms-btn-outline" onClick={onClose}>Cancel</button>
                    <button className="ms-btn ms-btn-primary" form="appt-form" type="submit" disabled={loading}>
                        {loading ? "Saving..." : (isEdit ? "Update" : "Book Appointment")}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BookAppointmentModal;