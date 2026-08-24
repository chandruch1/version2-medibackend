import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Public
import Landing          from "./pages/Landing";
import Login            from "./pages/auth/Login";
import Register         from "./pages/auth/Register";
import ForgotPassword   from "./pages/auth/ForgotPassword";
import VerifyOtp        from "./pages/auth/VerifyOtp";
import ResetPassword    from "./pages/auth/ResetPassword";

// Admin
import AdminDashboard        from "./pages/admin/Dashboard";
import AdminDoctors          from "./pages/admin/Doctors";
import AdminPatients         from "./pages/admin/Patients";
import AdminAppointments     from "./pages/admin/Appointments";
import AdminProfile          from "./pages/admin/Profile";
import AdminMedicalHistories from "./pages/admin/MedicalHistories";
import AdminLeaves           from "./pages/admin/Leaves";
import AdminFeedback         from "./pages/admin/Feedback";
import AdminNotifications    from "./pages/admin/Notifications";
import AdminPrescriptions    from "./pages/admin/Prescriptions";

// Doctor
import DoctorDashboard      from "./pages/doctor/Dashboard";
import DoctorAppointments   from "./pages/doctor/MyAppointments";
import DoctorPrescriptions  from "./pages/doctor/Prescriptions";
import DoctorProfile        from "./pages/doctor/Profile";
import DoctorLeave          from "./pages/doctor/Leave";
import DoctorFeedback       from "./pages/doctor/Feedback";
import DoctorNotifications  from "./pages/doctor/Notifications";

// Patient
import PatientDashboard    from "./pages/patient/Dashboard";
import BookAppointment     from "./pages/patient/BookAppointment";
import PatientAppointments from "./pages/patient/MyAppointments";
import PatientProfile      from "./pages/patient/Profile";
import ChangePassword      from "./pages/patient/ChangePassword";
import PatientMedicalHistory from "./pages/patient/MedicalHistory";
import PatientFeedback     from "./pages/patient/Feedback";
import PatientNotifications from "./pages/patient/Notifications";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* ── Public ─────────────────────────────────────────── */}
                    <Route path="/"                element={<Landing />} />
                    <Route path="/login"           element={<Login />} />
                    <Route path="/register"        element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/verify-otp"      element={<VerifyOtp />} />
                    <Route path="/reset-password"  element={<ResetPassword />} />

                    {/* ── Admin ──────────────────────────────────────────── */}
                    <Route path="/admin/dashboard"         element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/admin/doctors"           element={<ProtectedRoute role="ADMIN"><AdminDoctors /></ProtectedRoute>} />
                    <Route path="/admin/patients"          element={<ProtectedRoute role="ADMIN"><AdminPatients /></ProtectedRoute>} />
                    <Route path="/admin/appointments"      element={<ProtectedRoute role="ADMIN"><AdminAppointments /></ProtectedRoute>} />
                    <Route path="/admin/prescriptions"     element={<ProtectedRoute role="ADMIN"><AdminPrescriptions /></ProtectedRoute>} />
                    <Route path="/admin/profile"           element={<ProtectedRoute role="ADMIN"><AdminProfile /></ProtectedRoute>} />
                    <Route path="/admin/medical-histories" element={<ProtectedRoute role="ADMIN"><AdminMedicalHistories /></ProtectedRoute>} />
                    <Route path="/admin/leaves"            element={<ProtectedRoute role="ADMIN"><AdminLeaves /></ProtectedRoute>} />
                    <Route path="/admin/feedback"          element={<ProtectedRoute role="ADMIN"><AdminFeedback /></ProtectedRoute>} />
                    <Route path="/admin/notifications"     element={<ProtectedRoute role="ADMIN"><AdminNotifications /></ProtectedRoute>} />

                    {/* ── Doctor ─────────────────────────────────────────── */}
                    <Route path="/doctor/dashboard"     element={<ProtectedRoute role="DOCTOR"><DoctorDashboard /></ProtectedRoute>} />
                    <Route path="/doctor/appointments"  element={<ProtectedRoute role="DOCTOR"><DoctorAppointments /></ProtectedRoute>} />
                    <Route path="/doctor/prescriptions" element={<ProtectedRoute role="DOCTOR"><DoctorPrescriptions /></ProtectedRoute>} />
                    <Route path="/doctor/profile"       element={<ProtectedRoute role="DOCTOR"><DoctorProfile /></ProtectedRoute>} />
                    <Route path="/doctor/leave"         element={<ProtectedRoute role="DOCTOR"><DoctorLeave /></ProtectedRoute>} />
                    <Route path="/doctor/feedback"      element={<ProtectedRoute role="DOCTOR"><DoctorFeedback /></ProtectedRoute>} />
                    <Route path="/doctor/notifications" element={<ProtectedRoute role="DOCTOR"><DoctorNotifications /></ProtectedRoute>} />

                    {/* ── Patient ────────────────────────────────────────── */}
                    <Route path="/patient/dashboard"       element={<ProtectedRoute role="PATIENT"><PatientDashboard /></ProtectedRoute>} />
                    <Route path="/patient/book"            element={<ProtectedRoute role="PATIENT"><BookAppointment /></ProtectedRoute>} />
                    <Route path="/patient/appointments"    element={<ProtectedRoute role="PATIENT"><PatientAppointments /></ProtectedRoute>} />
                    <Route path="/patient/profile"         element={<ProtectedRoute role="PATIENT"><PatientProfile /></ProtectedRoute>} />
                    <Route path="/patient/change-password" element={<ProtectedRoute role="PATIENT"><ChangePassword /></ProtectedRoute>} />
                    <Route path="/patient/medical-history" element={<ProtectedRoute role="PATIENT"><PatientMedicalHistory /></ProtectedRoute>} />
                    <Route path="/patient/feedback"        element={<ProtectedRoute role="PATIENT"><PatientFeedback /></ProtectedRoute>} />
                    <Route path="/patient/notifications"   element={<ProtectedRoute role="PATIENT"><PatientNotifications /></ProtectedRoute>} />

                    {/* ── Fallback ────────────────────────────────────────── */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                draggable
                theme="light"
                toastStyle={{ borderRadius: 12, fontSize: 14, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
            />
        </AuthProvider>
    );
}

export default App;