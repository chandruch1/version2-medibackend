import DoctorSidebar from "../components/layout/DoctorSidebar";
import TopNavbar from "../components/layout/Navbar";

function DoctorLayout({ children, title, subtitle }) {
    return (
        <div style={{ display: "flex" }}>
            <DoctorSidebar />
            <div className="ms-main-content">
                <TopNavbar title={title} subtitle={subtitle} />
                <div className="ms-page">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default DoctorLayout;
