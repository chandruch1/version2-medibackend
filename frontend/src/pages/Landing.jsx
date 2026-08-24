import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    FaHospital, FaUserMd, FaCalendarCheck, FaPills, FaHeartbeat,
    FaPhone, FaEnvelope, FaMapMarkerAlt, FaStar, FaArrowRight,
    FaShieldAlt, FaClock, FaAward, FaUsers, FaBars, FaTimes
} from "react-icons/fa";

const SERVICES = [
    { icon: <FaUserMd />, title: "Expert Doctors",     desc: "500+ verified specialists across all medical fields available for consultations.", color: "#0d6efd" },
    { icon: <FaCalendarCheck />, title: "Easy Booking",  desc: "Book appointments online in seconds. Choose your doctor, date, and time slot.", color: "#20c997" },
    { icon: <FaPills />, title: "Prescriptions",        desc: "Digital prescriptions delivered instantly via email after your consultation.", color: "#6f42c1" },
    { icon: <FaHeartbeat />, title: "Health Tracking",  desc: "Monitor your appointment history and medical records all in one place.", color: "#fd7e14" },
    { icon: <FaShieldAlt />, title: "Secure & Private",  desc: "Your health data is protected with enterprise-grade security and encryption.", color: "#dc3545" },
    { icon: <FaClock />, title: "24/7 Support",          desc: "Round-the-clock patient support to assist you with all your healthcare needs.", color: "#198754" },
];

const DOCTORS = [
    { name: "Dr. Priya Sharma",   spec: "Cardiologist",      exp: "12 years", rating: 4.9 },
    { name: "Dr. Arjun Mehta",    spec: "Neurologist",       exp: "8 years",  rating: 4.8 },
    { name: "Dr. Anita Verma",    spec: "Dermatologist",     exp: "10 years", rating: 4.9 },
    { name: "Dr. Ravi Patel",     spec: "Orthopedic",        exp: "15 years", rating: 4.7 },
    { name: "Dr. Sneha Kapoor",   spec: "Gynecologist",      exp: "9 years",  rating: 4.8 },
    { name: "Dr. Karan Singh",    spec: "Pediatrician",      exp: "11 years", rating: 4.9 },
];



function Landing() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Close mobile menu on resize to desktop
    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth >= 992) setMobileMenuOpen(false);
        };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    const avatarColors = ["#0d6efd", "#20c997", "#6f42c1", "#fd7e14", "#dc3545", "#198754"];

    const sliderData = [
        { image: "/firstkural.png", text: "" },
        { image: "/image 3.jpg", text: "" },
        { image: "/image 4.jpg", text: "Compassion in Every Step, Care in Every Heart." },
        { image: "/OIP.webp", text: "Your Comfort. Your Health. Our Mission." }
    ];
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % sliderData.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const navItems = ["HOME", "ABOUT US", "SERVICES", "SPECIALITIES", "CONTACT"];

    return (
        <div style={{ fontFamily: "Inter, sans-serif" }}>

            {/* ── Top Bar ─────────────────────────────────────────────────── */}
            <div className="landing-topbar">
                <div className="container d-flex justify-content-between align-items-center">
                    <span><FaPhone style={{marginRight:6}}/> +91 452 711 3333</span>
                    <div style={{ display: "flex", gap: 16 }}>
                        <a href="#" style={{ color: "#fff", textDecoration: "none" }}>Fb</a>
                        <a href="#" style={{ color: "#fff", textDecoration: "none" }}>Tw</a>
                        <a href="#" style={{ color: "#fff", textDecoration: "none" }}>In</a>
                    </div>
                </div>
            </div>

            {/* ── Main Navbar ─────────────────────────────────────────────── */}
            <nav className="landing-navbar">
                <div className="container d-flex justify-content-between align-items-center">
                    {/* Logo */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{
                            width: 48, height: 48,
                            background: "#0d6efd",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#fff", fontSize: 24,
                            clipPath: "polygon(33% 0, 66% 0, 66% 33%, 100% 33%, 100% 66%, 66% 66%, 66% 100%, 33% 100%, 33% 66%, 0 66%, 0 33%, 33% 33%)"
                        }}>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
                            <span className="landing-brand-name">MEDICARE</span>
                            <span style={{ fontSize: 12, fontWeight: 600, color: "#6c757d", letterSpacing: 1 }}>HEALTH CENTER</span>
                        </div>
                    </div>

                    {/* Desktop Links */}
                    <div className="landing-nav-links">
                        {navItems.map(item => (
                            <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`}
                                style={{ color: "#222", textDecoration: "none",
                                    fontSize: 14, fontWeight: 700, transition: "color 0.2s" }}
                                onMouseEnter={e => e.target.style.color = "#0d6efd"}
                                onMouseLeave={e => e.target.style.color = "#222"}
                            >
                                {item}
                            </a>
                        ))}
                    </div>

                    {/* Desktop CTA Buttons */}
                    <div className="landing-nav-cta">
                        <Link to="/login" className="landing-login-btn">
                            LOGIN
                        </Link>
                        <Link to="/register" className="landing-appt-btn">
                            <FaCalendarCheck /> APPOINTMENT
                        </Link>
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        className="landing-hamburger"
                        onClick={() => setMobileMenuOpen(prev => !prev)}
                        aria-label="Toggle navigation"
                    >
                        {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                {mobileMenuOpen && (
                    <div className="landing-mobile-menu">
                        {navItems.map(item => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase().replace(" ", "-")}`}
                                className="landing-mobile-link"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item}
                            </a>
                        ))}
                        <div className="landing-mobile-cta">
                            <Link to="/login" className="landing-login-btn" onClick={() => setMobileMenuOpen(false)}>
                                LOGIN
                            </Link>
                            <Link to="/register" className="landing-appt-btn" onClick={() => setMobileMenuOpen(false)}>
                                <FaCalendarCheck /> APPOINTMENT
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* ── Hero Slider ──────────────────────────────────────────────── */}
            <section id="home" className="landing-hero">
                {sliderData.map((slide, index) => (
                    <div
                        key={index}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            opacity: index === currentSlide ? 1 : 0,
                            transition: "opacity 1s ease-in-out",
                            zIndex: index === currentSlide ? 1 : 0
                        }}
                    >
                        <div
                            style={{
                                position: "absolute",
                                top: 0, left: 0,
                                width: "100%", height: "100%",
                                backgroundImage: `url("${slide.image}")`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                filter: "brightness(0.5)"
                            }}
                        />
                        <div className="container" style={{ position: "relative", zIndex: 2, height: "100%" }}>
                            <div className="row align-items-center justify-content-center" style={{ height: "100%" }}>
                                <div className="col-12 text-center" style={{ color: "#fff", padding: "0 20px" }}>
                                    <h1 className="landing-hero-title">
                                        {slide.text}
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </section>



            {/* ── Login Option ────────────────────────────────────────────── */}
            <section id="login-option" style={{ padding: "60px 0", background: "#fff", textAlign: "center", borderBottom: "1px solid #eee" }}>
                <div className="container">
                    <h3 className="landing-section-title" style={{ marginBottom: 16 }}>Welcome Back to Medicare Health Center</h3>
                    <p style={{ color: "#6c757d", marginBottom: 24, fontSize: 16 }}>Access your patient dashboard, manage appointments, and view medical records.</p>
                    <Link to="/login" className="landing-appt-btn" style={{
                        padding: "14px 40px", borderRadius: 12, fontSize: 16,
                        boxShadow: "0 8px 24px rgba(13,110,253,0.3)"
                    }}>
                        Login to your Account <FaArrowRight />
                    </Link>
                </div>
            </section>

            {/* ── About ───────────────────────────────────────────────────── */}
            <section id="about" style={{ padding: "80px 0", background: "#f8f9fa" }}>
                <div className="container">
                    <div className="row align-items-center g-5">
                        <div className="col-lg-6">
                            <div style={{
                                width: "100%", maxWidth: 460, height: 300,
                                background: "linear-gradient(135deg, #0d6efd, #20c997)",
                                borderRadius: 24, display: "flex", alignItems: "center", justifyContent: "center",
                                color: "#fff", fontSize: 80, boxShadow: "0 20px 60px rgba(13,110,253,0.3)",
                                margin: "0 auto"
                            }}>
                                <FaHospital />
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div style={{ display: "inline-flex", alignItems: "center", gap: 8,
                                background: "#e8f0fe", borderRadius: 20, padding: "4px 14px", marginBottom: 16,
                                fontSize: 12, color: "#0d6efd", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
                                About Medicare Health Center
                            </div>
                            <h2 className="landing-section-title" style={{ marginBottom: 16 }}>
                                Transforming Healthcare, One Patient at a Time
                            </h2>
                            <p style={{ color: "#6c757d", fontSize: 16, lineHeight: 1.8, marginBottom: 24 }}>
                                Medicare Health Center is a comprehensive healthcare management platform designed to bridge the gap between patients and healthcare providers. We make quality healthcare accessible, affordable, and efficient.
                            </p>
                            <ul style={{ listStyle: "none", padding: 0 }}>
                                {["Verified & certified doctors", "Secure patient data management", "Instant appointment confirmation", "Digital prescription delivery"].map(item => (
                                    <li key={item} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12,
                                        fontSize: 15, color: "#495057" }}>
                                        <div style={{ width: 22, height: 22, borderRadius: "50%",
                                            background: "rgba(13,110,253,0.1)", color: "#0d6efd",
                                            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                                            ✓
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/register" className="landing-appt-btn" style={{ marginTop: 8 }}>
                                Join Medicare Health Center <FaArrowRight />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Services ────────────────────────────────────────────────── */}
            <section id="services" style={{ padding: "80px 0", background: "#fff" }}>
                <div className="container">
                    <div style={{ textAlign: "center", marginBottom: 48 }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 8,
                            background: "#e8f0fe", borderRadius: 20, padding: "4px 14px", marginBottom: 12,
                            fontSize: 12, color: "#0d6efd", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
                            Our Services
                        </div>
                        <h2 className="landing-section-title" style={{ marginBottom: 12 }}>
                            Everything You Need for Better Health
                        </h2>
                        <p style={{ color: "#6c757d", fontSize: 16, maxWidth: 500, margin: "0 auto" }}>
                            A comprehensive suite of healthcare services designed for modern patients and providers.
                        </p>
                    </div>
                    <div className="row g-4">
                        {SERVICES.map((s, i) => (
                            <div key={i} className="col-md-6 col-lg-4">
                                <div style={{
                                    background: "#fff", border: "1px solid #e9ecef", borderRadius: 16,
                                    padding: 28, height: "100%", transition: "all 0.3s",
                                    cursor: "default"
                                }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.1)";
                                        e.currentTarget.style.transform = "translateY(-4px)";
                                        e.currentTarget.style.borderColor = s.color + "44";
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.boxShadow = "none";
                                        e.currentTarget.style.transform = "none";
                                        e.currentTarget.style.borderColor = "#e9ecef";
                                    }}
                                >
                                    <div style={{
                                        width: 52, height: 52, borderRadius: 12,
                                        background: s.color + "15", color: s.color,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: 22, marginBottom: 16
                                    }}>
                                        {s.icon}
                                    </div>
                                    <h5 style={{ fontWeight: 700, marginBottom: 10, color: "#212529" }}>{s.title}</h5>
                                    <p style={{ color: "#6c757d", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Doctors ─────────────────────────────────────────────────── */}
            <section id="doctors" style={{ padding: "80px 0", background: "#f8f9fa" }}>
                <div className="container">
                    <div style={{ textAlign: "center", marginBottom: 48 }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 8,
                            background: "rgba(32,201,151,0.1)", borderRadius: 20, padding: "4px 14px", marginBottom: 12,
                            fontSize: 12, color: "#20c997", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
                            <FaUserMd /> Our Specialists
                        </div>
                        <h2 className="landing-section-title" style={{ marginBottom: 12 }}>Meet Our Expert Doctors</h2>
                        <p style={{ color: "#6c757d", fontSize: 16, maxWidth: 500, margin: "0 auto" }}>
                            Our team of experienced, certified specialists is dedicated to providing exceptional patient care.
                        </p>
                    </div>
                    <div className="row g-4">
                        {DOCTORS.map((doc, i) => (
                            <div key={i} className="col-md-6 col-lg-4">
                                <div style={{
                                    background: "#fff", borderRadius: 16, padding: 24,
                                    border: "1px solid #e9ecef", transition: "all 0.3s",
                                    display: "flex", flexDirection: "column", alignItems: "center",
                                    textAlign: "center"
                                }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.1)";
                                        e.currentTarget.style.transform = "translateY(-4px)";
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.boxShadow = "none";
                                        e.currentTarget.style.transform = "none";
                                    }}
                                >
                                    <div style={{
                                        width: 72, height: 72, borderRadius: "50%",
                                        background: `linear-gradient(135deg, ${avatarColors[i]}, ${avatarColors[(i+1)%6]})`,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: 28, color: "#fff", marginBottom: 14, fontWeight: 700
                                    }}>
                                        {doc.name.split(" ")[1][0]}
                                    </div>
                                    <div style={{ fontWeight: 700, fontSize: 16, color: "#212529" }}>{doc.name}</div>
                                    <div style={{ fontSize: 13, color: "#6c757d", margin: "4px 0 12px" }}>
                                        {doc.spec} • {doc.exp}
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                        {[...Array(5)].map((_, j) => (
                                            <FaStar key={j} style={{ color: j < Math.floor(doc.rating) ? "#ffc107" : "#dee2e6", fontSize: 13 }} />
                                        ))}
                                        <span style={{ fontSize: 13, fontWeight: 600, color: "#495057", marginLeft: 4 }}>{doc.rating}</span>
                                    </div>
                                    <Link to="/register" style={{
                                        display: "inline-flex", alignItems: "center", gap: 6,
                                        marginTop: 16, padding: "8px 20px", borderRadius: 8,
                                        background: "#e8f0fe", color: "#0d6efd",
                                        textDecoration: "none", fontSize: 13, fontWeight: 600
                                    }}>
                                        Book Now
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Contact ─────────────────────────────────────────────────── */}
            <section id="contact" style={{ padding: "80px 0", background: "#fff" }}>
                <div className="container">
                    <div className="row g-5">
                        <div className="col-lg-5">
                            <div style={{ display: "inline-flex", alignItems: "center", gap: 8,
                                background: "#e8f0fe", borderRadius: 20, padding: "4px 14px", marginBottom: 16,
                                fontSize: 12, color: "#0d6efd", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
                                Contact Us
                            </div>
                            <h2 className="landing-section-title" style={{ marginBottom: 16 }}>Get In Touch</h2>
                            <p style={{ color: "#6c757d", fontSize: 15, lineHeight: 1.8, marginBottom: 28 }}>
                                Have questions? Our team is here to help you with appointments, technical support, and anything else you need.
                            </p>
                            {[
                                { icon: <FaPhone />, label: "Phone",   value: "+91 1800 123 4567" },
                                { icon: <FaEnvelope />, label: "Email",  value: "support@medisphere.com" },
                                { icon: <FaMapMarkerAlt />, label: "Address", value: "123 Medical Tower, Health City" },
                            ].map(c => (
                                <div key={c.label} style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 20 }}>
                                    <div style={{ width: 40, height: 40, borderRadius: 10,
                                        background: "#e8f0fe", color: "#0d6efd",
                                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                                        {c.icon}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 12, color: "#6c757d", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>{c.label}</div>
                                        <div style={{ fontWeight: 600, color: "#212529" }}>{c.value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="col-lg-7">
                            <div style={{ background: "#f8f9fa", borderRadius: 20, padding: 36 }}>
                                <div className="row g-3">
                                    {[
                                        { label: "Your Name", placeholder: "John Doe", type: "text", half: true },
                                        { label: "Email", placeholder: "john@email.com", type: "email", half: true },
                                        { label: "Subject", placeholder: "Appointment inquiry", type: "text", half: false },
                                    ].map(f => (
                                        <div key={f.label} className={f.half ? "col-md-6" : "col-12"}>
                                            <div className="ms-form-group mb-0">
                                                <label className="ms-form-label">{f.label}</label>
                                                <input type={f.type} className="ms-form-control" placeholder={f.placeholder} />
                                            </div>
                                        </div>
                                    ))}
                                    <div className="col-12">
                                        <div className="ms-form-group mb-0">
                                            <label className="ms-form-label">Message</label>
                                            <textarea className="ms-form-control" rows={4} placeholder="How can we help you?" style={{ resize: "none" }} />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <button className="ms-btn ms-btn-primary w-100" style={{ justifyContent: "center" }}>
                                            Send Message
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Footer ──────────────────────────────────────────────────── */}
            <footer style={{ background: "#0f1623", color: "rgba(255,255,255,0.6)", padding: "32px 0" }}>
                <div className="container">
                    <div className="landing-footer-inner">
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 8,
                                background: "linear-gradient(135deg, #0d6efd, #20c997)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: "#fff", fontSize: 14 }}>
                                <FaHospital />
                            </div>
                            <span style={{ color: "#fff", fontWeight: 700 }}>Medicare Health Center</span>
                        </div>
                        <p style={{ margin: 0, fontSize: 13 }}>
                            © 2025 Medicare Health Center. All rights reserved.
                        </p>
                        <div style={{ display: "flex", gap: 20 }}>
                            <Link to="/login" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: 13 }}>Sign In</Link>
                            <Link to="/register" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: 13 }}>Register</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Landing;
