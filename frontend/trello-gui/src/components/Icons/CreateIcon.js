function CreateIcon({ className }) {
    return (
        <>
            <svg
                className={className}
                focusable="false"
                ariahidden="true"
                viewBox="0 0 24 24"
                tabIndex="-1"
                title="LibraryAdd"
                fill="currentColor"
            >
                <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m-1 9h-4v4h-2v-4H9V9h4V5h2v4h4z"></path>
            </svg>
        </>
    );
}
export default CreateIcon;
