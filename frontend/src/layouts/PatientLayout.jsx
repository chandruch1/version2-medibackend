import PatientSidebar from "../components/layout/PatientSidebar";
import TopNavbar from "../components/layout/Navbar";

function PatientLayout({ children, title, subtitle }) {
    return (
        <div style={{ display: "flex" }}>
            <PatientSidebar />
            <div className="ms-main-content">
                <TopNavbar title={title} subtitle={subtitle} />
                <div className="ms-page">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default PatientLayout;
