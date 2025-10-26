import classNames from 'classnames/bind';
import styles from './ToggleFocusInput.module.scss';
import { useState, useRef, useEffect } from 'react';
const cx = classNames.bind(styles);

function ToggleFocusInput({ value, className, onFocusChange, onUpdateColumnTitle }) {
    const [valueInput, setValueInput] = useState(value);

    return (
        <input
            spellCheck={false}
            value={valueInput}
            className={cx('input', className)}
            onChange={(e) => setValueInput(e.target.value)}
            onClick={() => onFocusChange?.(true)}
            onBlur={() => {
                onFocusChange?.(false);
                if (!valueInput) {
                    setValueInput(value);
                    return;
                }
                if (valueInput === value) return;
                onUpdateColumnTitle(valueInput.trim());
            }}
        />
    );
}

export default ToggleFocusInput;
