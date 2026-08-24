import { FaSearch } from "react-icons/fa";

function SearchBar({ value, onChange, placeholder = "Search..." }) {
    return (
        <div className="ms-search-wrap" style={{ maxWidth: "360px" }}>
            <FaSearch className="search-icon" />
            <input
                type="text"
                className="ms-search-input"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
        </div>
    );
}

export default SearchBar;