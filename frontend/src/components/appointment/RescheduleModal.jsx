import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";
import { updateAppointment } from "../../services/appointmentService";

function RescheduleModal({ appointment, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        appointmentDate: "",
        appointmentTime: ""
    });

    useEffect(() => {
        if (appointment) {
            setForm({
                appointmentDate: appointment.appointmentDate || "",
                appointmentTime: appointment.appointmentTime || "",
            });
        }
    }, [appointment]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Need to pass the full request object to updateAppointment since it replaces the entity fields.
            const updatedAppointment = {
                doctorId: appointment.doctorId,
                patientId: appointment.patientId,
                reason: appointment.reason || "Rescheduled",
                appointmentDate: form.appointmentDate,
                appointmentTime: form.appointmentTime
            };
            await updateAppointment(appointment.id, updatedAppointment);
            toast.success("Appointment rescheduled successfully!");
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
                    <span className="ms-modal-title">Reschedule Appointment</span>
                    <button className="ms-modal-close" onClick={onClose}><FaTimes /></button>
                </div>

                <div className="ms-modal-body">
                    <form id="reschedule-form" onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-12">
                                <div style={{ marginBottom: "1rem" }}>
                                    <strong>Patient:</strong> {appointment.patientName} <br />
                                    <strong>Doctor:</strong> Dr. {appointment.doctorName}
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
                        </div>
                    </form>
                </div>

                <div className="ms-modal-footer">
                    <button className="ms-btn ms-btn-outline" type="button" onClick={onClose}>Cancel</button>
                    <button className="ms-btn ms-btn-primary" form="reschedule-form" type="submit" disabled={loading}>
                        {loading ? "Saving..." : "Update Time"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RescheduleModal;
