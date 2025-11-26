function BoardsIcon({ className }) {
    return (
        <>
            <svg
                className={className}
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="currentColor"
                title="SpaceDashboard"
            >
                <path d="M11 21H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h6zm2 0h6c1.1 0 2-.9 2-2v-7h-8zm8-11V5c0-1.1-.9-2-2-2h-6v7z"></path>
            </svg>
        </>
    );
}

export default BoardsIcon;
