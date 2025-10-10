function HomeIcon({ className }) {
    return (
        <>
            <svg
                className={className}
                focusable="false"
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="currentColor"
                title="Home"
            >
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path>
            </svg>
        </>
    );
}
export default HomeIcon;
