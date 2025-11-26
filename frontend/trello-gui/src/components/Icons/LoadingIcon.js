function LoadingIcon({ size = 24, color = 'currentColor', className }) {
    return (
        <svg className={`spinner ${className || ''}`} width={size} height={size} viewBox="0 0 50 50">
            <circle className="path" cx="25" cy="25" r="20" fill="none" stroke={color} strokeWidth="5" />
            <style>
                {`
          .path {
            stroke-dasharray: 80,150; /* cắt mất một đoạn */
            stroke-linecap: round;
          }
        `}
            </style>
        </svg>
    );
}

export default LoadingIcon;
