//thuư viện ngoài
import { forwardRef, useImperativeHandle, useState } from 'react';
import styles from './InputSearch.module.scss';
import classNames from 'classnames/bind';

// src

const cx = classNames.bind(styles);

const InputSearch = forwardRef(
    (
        {
            leftIcon = false,
            title,
            label_search_className,
            searchInput_className,
            autoFocus = false,
            hasValue = false,
            valueInput = '',
            typeInput = 'text',
            ...rest
        },
        ref,
    ) => {
        const [placeholder, setPlaceholder] = useState(title);

        // console.log(valueInput);

        return (
            <div className={cx('wrapper')}>
                {leftIcon && <span className={cx('left-icon')}>{leftIcon}</span>}
                <input
                    type={typeInput}
                    // phần tử css trong obj đứng sau vẫn ghi đè phần tử css đứng trước nếu cả 2 thỏa mãn
                    className={cx('searchInput', searchInput_className, {
                        hasValueInInput: !hasValue && valueInput !== '',
                        hasValue: hasValue,
                        marginLeft : leftIcon
                    })}
                    ref={ref} // ✅ rất quan trọng
                    {...rest}
                    onFocus={() => {
                        setPlaceholder('');
                    }}
                    onBlur={() => {
                        setPlaceholder(title);
                    }}
                    placeholder={placeholder}
                    autoFocus={autoFocus}
                    value={valueInput}
                />
                <label className={cx('label-search', label_search_className)}>{title}</label>
            </div>
        );
    },
);

export default InputSearch;
