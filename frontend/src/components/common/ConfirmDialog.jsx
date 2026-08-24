import { FaExclamationTriangle, FaTimes } from "react-icons/fa";

function ConfirmDialog({ show, title, message, onConfirm, onCancel, confirmText = "Delete", confirmClass = "danger" }) {
    if (!show) return null;

    return (
        <div className="ms-modal-overlay" onClick={onCancel}>
            <div className="ms-modal" style={{ maxWidth: "420px" }} onClick={(e) => e.stopPropagation()}>
                <div className="ms-modal-header">
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: "50%",
                            background: "rgba(220,53,69,0.12)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#dc3545", fontSize: 16
                        }}>
                            <FaExclamationTriangle />
                        </div>
                        <span className="ms-modal-title">{title}</span>
                    </div>
                    <button className="ms-modal-close" onClick={onCancel}>
                        <FaTimes />
                    </button>
                </div>

                <div className="ms-modal-body">
                    <p style={{ color: "var(--gray-600)", margin: 0 }}>{message}</p>
                </div>

                <div className="ms-modal-footer">
                    <button className="ms-btn ms-btn-outline" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className={`ms-btn ms-btn-${confirmClass}`} onClick={onConfirm}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;