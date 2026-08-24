import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export function AppointmentDonutChart({ data, d, labels, colors, title }) {
    // accept either 'data' or 'd'
    const chartDataValues = d || data || [0, 0, 0];
    
    const chartData = {
        labels: labels || ["Booked", "Completed", "Cancelled"],
        datasets: [{
            data: chartDataValues,
            backgroundColor: colors || ["#0d6efd", "#198754", "#dc3545"],
            borderWidth: 2,
            borderColor: "#fff",
            hoverOffset: 6
        }]
    };

    return (
        <div className="ms-card h-100">
            <div className="ms-card-header">{title || "Appointment Status"}</div>
            <div style={{ position: "relative", maxWidth: 240, margin: "0 auto", height: 240 }}>
                <Doughnut
                    data={chartData}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: "65%",
                        plugins: {
                            legend: { position: "bottom", labels: { padding: 16, font: { size: 12 } } }
                        }
                    }}
                />
            </div>
        </div>
    );
}

export function StatsBarChart({ labels, values, colors, title }) {
    const chartData = {
        labels: labels || [],
        datasets: [{
            data: values || [],
            backgroundColor: colors || ["#0d6efd", "#20c997"],
            borderRadius: 6,
            borderSkipped: false,
        }]
    };

    return (
        <div className="ms-card h-100">
            <div className="ms-card-header">{title || "Statistics"}</div>
            <div style={{ position: "relative", height: 300, width: "100%" }}>
                <Bar
                    data={chartData}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false },
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: { stepSize: 1 },
                                grid: { color: "rgba(0,0,0,0.05)" }
                            },
                            x: { grid: { display: false } }
                        }
                    }}
                />
            </div>
        </div>
    );
}

// ── Legacy AppointmentChart (backward compat) ────────────────────────────────
function AppointmentChart({ dashboard }) {
    return (
        <div className="col-lg-4 col-md-6 mb-4">
            <AppointmentDonutChart
                d={[
                    dashboard.bookedAppointments,
                    dashboard.completedAppointments,
                    dashboard.cancelledAppointments,
                ]}
            />
        </div>
    );
}

export default AppointmentChart;