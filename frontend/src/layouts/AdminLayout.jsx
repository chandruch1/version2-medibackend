import AdminSidebar from "../components/layout/Sidebar";
import TopNavbar from "../components/layout/Navbar";

function AdminLayout({ children, title, subtitle }) {
    return (
        <div style={{ display: "flex" }}>
            <AdminSidebar />
            <div className="ms-main-content">
                <TopNavbar title={title} subtitle={subtitle} />
                <div className="ms-page">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default AdminLayout;