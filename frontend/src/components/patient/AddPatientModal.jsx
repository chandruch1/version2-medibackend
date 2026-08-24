import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";
import { addPatient, updatePatient } from "../../services/patientService";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const GENDERS = ["Male", "Female", "Other"];

const DEFAULT_FORM = {
    patientName: "", age: "", gender: "Male", dob: "",
    phone: "", email: "", address: "", bloodGroup: "A+",
    disease: "", status: true
};

function AddPatientModal({ patientData, onClose, onSuccess }) {
    const isEdit = !!patientData;
    const [form, setForm]     = useState(DEFAULT_FORM);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (patientData) {
            setForm({
                patientName: patientData.patientName || "",
                age: patientData.age || "",
                gender: patientData.gender || "Male",
                dob: patientData.dob || "",
                phone: patientData.phone || "",
                email: patientData.email || "",
                address: patientData.address || "",
                bloodGroup: patientData.bloodGroup || "A+",
                disease: patientData.disease || "",
                status: patientData.status !== undefined ? patientData.status : true,
            });
        }
    }, [patientData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newForm = { ...form, [name]: type === "checkbox" ? checked : value };
        if (name === "dob" && value) {
            const birthDate = new Date(value);
            const today = new Date();
            let calculatedAge = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                calculatedAge--;
            }
            newForm.age = calculatedAge > 0 ? calculatedAge : 0;
        }
        setForm(newForm);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEdit) {
                await updatePatient(patientData.id, form);
                toast.success("Patient updated successfully!");
            } else {
                await addPatient(form);
                toast.success("Patient added successfully!");
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
            <div className="ms-modal ms-modal-lg" onClick={(e) => e.stopPropagation()}>
                <div className="ms-modal-header">
                    <span className="ms-modal-title">{isEdit ? "Edit Patient" : "Add New Patient"}</span>
                    <button className="ms-modal-close" onClick={onClose}><FaTimes /></button>
                </div>

                <div className="ms-modal-body">
                    <form id="patient-form" onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-12">
                                <div className="ms-form-group">
                                    <label className="ms-form-label">Full Name</label>
                                    <input name="patientName" className="ms-form-control" value={form.patientName}
                                        onChange={handleChange} placeholder="John Doe" required />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="ms-form-group">
                                    <label className="ms-form-label">Age</label>
                                    <input name="age" type="number" className="ms-form-control" value={form.age}
                                        onChange={handleChange} placeholder="25" required />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="ms-form-group">
                                    <label className="ms-form-label">Gender</label>
                                    <select name="gender" className="ms-form-control" value={form.gender} onChange={handleChange}>
                                        {GENDERS.map(g => <option key={g}>{g}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="ms-form-group">
                                    <label className="ms-form-label">Date of Birth</label>
                                    <input name="dob" type="date" className="ms-form-control" value={form.dob} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="ms-form-group">
                                    <label className="ms-form-label">Phone</label>
                                    <input name="phone" className="ms-form-control" value={form.phone}
                                        onChange={handleChange} placeholder="+91 98765 43210" required />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="ms-form-group">
                                    <label className="ms-form-label">Blood Group</label>
                                    <select name="bloodGroup" className="ms-form-control" value={form.bloodGroup} onChange={handleChange}>
                                        {BLOOD_GROUPS.map(bg => <option key={bg}>{bg}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="ms-form-group">
                                    <label className="ms-form-label">Email</label>
                                    <input name="email" type="email" className="ms-form-control" value={form.email}
                                        onChange={handleChange} placeholder="patient@email.com" required />
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="ms-form-group">
                                    <label className="ms-form-label">Address</label>
                                    <input name="address" className="ms-form-control" value={form.address}
                                        onChange={handleChange} placeholder="123 Main St, City" />
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="ms-form-group">
                                    <label className="ms-form-label">Disease / Medical Condition</label>
                                    <input name="disease" className="ms-form-control" value={form.disease}
                                        onChange={handleChange} placeholder="Hypertension, Diabetes..." />
                                </div>
                            </div>
                            <div className="col-12">
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <input type="checkbox" id="pat-status" name="status"
                                        checked={form.status} onChange={handleChange}
                                        style={{ width: 18, height: 18, cursor: "pointer" }} />
                                    <label htmlFor="pat-status" className="ms-form-label" style={{ margin: 0, cursor: "pointer" }}>
                                        Active Patient
                                    </label>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="ms-modal-footer">
                    <button className="ms-btn ms-btn-outline" onClick={onClose}>Cancel</button>
                    <button className="ms-btn ms-btn-primary" form="patient-form" type="submit" disabled={loading}>
                        {loading ? "Saving..." : (isEdit ? "Update Patient" : "Add Patient")}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddPatientModal;