import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";
import { addDoctor, updateDoctor } from "../../services/doctorService";

const SPECIALIZATIONS = [
    "Cardiologist", "Dermatologist", "Neurologist", "Orthopedic", "Pediatrician",
    "Gynecologist", "Ophthalmologist", "Psychiatrist", "Radiologist", "General Physician",
    "ENT Specialist", "Urologist", "Gastroenterologist", "Endocrinologist", "Pulmonologist"
];

const QUALIFICATIONS = ["MBBS", "MD", "MS", "DM", "MCh", "DNB", "BDS", "MDS", "BAMS", "BHMS"];

const DEFAULT_FORM = {
    doctorName: "", email: "", phone: "", dob: "",
    qualification: "MBBS", experience: "", specialization: "Cardiologist",
    consultationFee: "", availableDays: "", availableTime: "", status: true
};

function AddDoctorModal({ doctorData, onClose, onSuccess }) {
    const isEdit = !!doctorData;
    const [form, setForm]     = useState(DEFAULT_FORM);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (doctorData) {
            setForm({
                doctorName: doctorData.doctorName || "",
                email: doctorData.email || "",
                phone: doctorData.phone || "",
                dob: doctorData.dob || "",
                qualification: doctorData.qualification || "MBBS",
                experience: doctorData.experience || "",
                specialization: doctorData.specialization || "Cardiologist",
                consultationFee: doctorData.consultationFee || "",
                availableDays: doctorData.availableDays || "",
                availableTime: doctorData.availableTime || "",
                status: doctorData.status !== undefined ? doctorData.status : true,
            });
        }
    }, [doctorData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEdit) {
                await updateDoctor(doctorData.id, form);
                toast.success("Doctor updated successfully!");
            } else {
                await addDoctor(form);
                toast.success("Doctor added successfully! Login credentials have been sent to their email.");
            }
            onSuccess();
            onClose();
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data || (isEdit ? "Update failed." : "Add failed.");
            toast.error(typeof msg === "string" ? msg : "Operation failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ms-modal-overlay" onClick={onClose}>
            <div className="ms-modal ms-modal-lg" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="ms-modal-header">
                    <span className="ms-modal-title">{isEdit ? "Edit Doctor" : "Add New Doctor"}</span>
                    <button className="ms-modal-close" onClick={onClose}><FaTimes /></button>
                </div>

                {/* Body */}
                <div className="ms-modal-body">
                    <form id="doctor-form" onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <div className="ms-form-group">
                                    <label className="ms-form-label">Full Name</label>
                                    <input type="text" name="doctorName" className="ms-form-control"
                                        placeholder="Dr. John Smith" value={form.doctorName}
                                        onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="ms-form-group">
                                    <label className="ms-form-label">Email Address</label>
                                    <input type="email" name="email" className="ms-form-control"
                                        placeholder="doctor@hospital.com" value={form.email}
                                        onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="ms-form-group">
                                    <label className="ms-form-label">Phone Number</label>
                                    <input type="text" name="phone" className="ms-form-control"
                                        placeholder="9876543210" pattern="[0-9]{10}" title="Phone number must be exactly 10 digits" value={form.phone}
                                        onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="ms-form-group">
                                    <label className="ms-form-label">Date of Birth</label>
                                    <input type="date" name="dob" className="ms-form-control"
                                        value={form.dob}
                                        onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="ms-form-group">
                                    <label className="ms-form-label">Qualification</label>
                                    <input type="text" name="qualification" className="ms-form-control"
                                        list="qualifications-list"
                                        placeholder="e.g. MBBS, MD" value={form.qualification}
                                        onChange={handleChange} required />
                                    <datalist id="qualifications-list">
                                        {QUALIFICATIONS.map(q => <option key={q} value={q} />)}
                                    </datalist>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="ms-form-group">
                                    <label className="ms-form-label">Experience (Years)</label>
                                    <input type="number" name="experience" className="ms-form-control"
                                        placeholder="5" value={form.experience}
                                        onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="ms-form-group">
                                    <label className="ms-form-label">Specialization</label>
                                    <input type="text" name="specialization" className="ms-form-control"
                                        list="specializations-list"
                                        placeholder="e.g. Cardiologist" value={form.specialization}
                                        onChange={handleChange} required />
                                    <datalist id="specializations-list">
                                        {SPECIALIZATIONS.map(s => <option key={s} value={s} />)}
                                    </datalist>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="ms-form-group">
                                    <label className="ms-form-label">Consultation Fee (₹)</label>
                                    <input type="number" name="consultationFee" className="ms-form-control"
                                        placeholder="500" value={form.consultationFee}
                                        onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="ms-form-group">
                                    <label className="ms-form-label">Available Days</label>
                                    <input type="text" name="availableDays" className="ms-form-control"
                                        placeholder="e.g. Mon-Fri" value={form.availableDays}
                                        onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="ms-form-group">
                                    <label className="ms-form-label">Available Time</label>
                                    <input type="text" name="availableTime" className="ms-form-control"
                                        placeholder="e.g. 10:00 AM - 04:00 PM" value={form.availableTime}
                                        onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="col-12">
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <input type="checkbox" id="doc-status" name="status"
                                        checked={form.status} onChange={handleChange}
                                        style={{ width: 18, height: 18, cursor: "pointer" }} />
                                    <label htmlFor="doc-status" className="ms-form-label" style={{ margin: 0, cursor: "pointer" }}>
                                        Active (visible to patients for booking)
                                    </label>
                                </div>
                            </div>
                            {!isEdit && (
                                <div className="col-12">
                                    <div style={{ background: "#e8f0fe", borderRadius: 8, padding: "10px 14px",
                                        fontSize: 13, color: "#0d6efd", display: "flex", alignItems: "center", gap: 8 }}>
                                        ℹ️ Login credentials auto-generated: Password is First Name + Birth Year (e.g., John1985).
                                    </div>
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="ms-modal-footer">
                    <button className="ms-btn ms-btn-outline" onClick={onClose}>Cancel</button>
                    <button className="ms-btn ms-btn-primary" form="doctor-form" type="submit" disabled={loading}>
                        {loading ? "Saving..." : (isEdit ? "Update Doctor" : "Add Doctor")}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddDoctorModal;