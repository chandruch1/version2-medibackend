import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function Pagination({ currentPage, totalPages, onPrevious, onNext }) {
    if (totalPages <= 1) return null;

    return (
        <div className="d-flex justify-content-end align-items-center mt-4 gap-3">
            <button
                className="ms-btn ms-btn-outline ms-btn-sm"
                disabled={currentPage === 0}
                onClick={onPrevious}
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
                <FaChevronLeft size={11} /> Previous
            </button>

            <span style={{ fontSize: 13, color: "var(--gray-600)", fontWeight: 500 }}>
                Page <strong>{currentPage + 1}</strong> of <strong>{totalPages}</strong>
            </span>

            <button
                className="ms-btn ms-btn-outline ms-btn-sm"
                disabled={currentPage + 1 >= totalPages}
                onClick={onNext}
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
                Next <FaChevronRight size={11} />
            </button>
        </div>
    );
}

export default Pagination;