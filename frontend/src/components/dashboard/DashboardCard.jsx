function DashboardCard({ title, value, icon, color, colorClass }) {
    return (
        <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 mb-4">
            <div className={`ms-stat-card ${colorClass || "blue"}`}>
                <div className={`ms-stat-icon ${colorClass || "blue"}`}>
                    {icon}
                </div>
                <div className="ms-stat-value">{value ?? 0}</div>
                <div className="ms-stat-label">{title}</div>
            </div>
        </div>
    );
}

export default DashboardCard;