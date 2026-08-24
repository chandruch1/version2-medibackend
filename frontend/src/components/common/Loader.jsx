function Loader({ text = "Loading..." }) {
    return (
        <div className="ms-loader">
            <div className="ms-spinner" />
            <span className="ms-loader-text">{text}</span>
        </div>
    );
}

export default Loader;