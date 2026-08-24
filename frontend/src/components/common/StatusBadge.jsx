/**
 * StatusBadge — reusable appointment/user status badge.
 * Supports: PENDING, APPROVED, REJECTED, COMPLETED, CANCELLED, BOOKED, active, inactive
 */
function StatusBadge({ status }) {
    if (!status) return null;

    const key = status.toString().toLowerCase();

    return (
        <span className={`ms-badge ${key}`}>
            {status}
        </span>
    );
}

export default StatusBadge;
