function FilterIcon({ className }) {
    return (
        <>
            <svg
                className={className}
                focusable="false"
                aria-hidden="true"
                viewBox="0 0 24 24"
                tabIndex="-1"
                title="FilterList"
                fill="currentColor"
            >
                <path d="M10 18h4v-2h-4zM3 6v2h18V6zm3 7h12v-2H6z"></path>
            </svg>
        </>
    );
}
export default FilterIcon;
