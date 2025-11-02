function TickIcon({ className }) {
    return (
        <>
            <svg
                class={className}
                focusable="false"
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="currentColor"
                title="Done"
            >
                <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"></path>
            </svg>
        </>
    );
}

export default TickIcon;
