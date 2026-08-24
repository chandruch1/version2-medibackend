import { useState } from "react";
import PatientSidebar from "../components/layout/PatientSidebar";
import TopNavbar from "../components/layout/Navbar";

function PatientLayout({ children, title, subtitle }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div style={{ display: "flex" }}>
            <PatientSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="ms-main-content">
                <TopNavbar
                    title={title}
                    subtitle={subtitle}
                    onMenuToggle={() => setSidebarOpen(prev => !prev)}
                />
                <div className="ms-page">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default PatientLayout;
