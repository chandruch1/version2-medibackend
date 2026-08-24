import { useState } from "react";
import DoctorSidebar from "../components/layout/DoctorSidebar";
import TopNavbar from "../components/layout/Navbar";

function DoctorLayout({ children, title, subtitle }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div style={{ display: "flex" }}>
            <DoctorSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
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

export default DoctorLayout;
