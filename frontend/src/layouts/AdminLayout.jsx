import { useState } from "react";
import AdminSidebar from "../components/layout/Sidebar";
import TopNavbar from "../components/layout/Navbar";

function AdminLayout({ children, title, subtitle }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div style={{ display: "flex" }}>
            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
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

export default AdminLayout;