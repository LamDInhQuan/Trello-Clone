//thuư viện ngoài
import { useState } from 'react';
import styles from './InputSearch.module.scss';
import classNames from 'classnames/bind';

// src

const cx = classNames.bind(styles);

function InputSearch({
    title,
    label_search_className,
    searchInput_className,
    autoFocus = false,
    onChange ,
    hasValue = false,
    value = "" 
}) {

    const [placeholder, setPlaceholder] = useState(title);
    return (
        <div className={cx('wrapper')}>
            <input
                type="text"
                // phần tử css trong obj đứng sau vẫn ghi đè phần tử css đứng trước nếu cả 2 thỏa mãn 
                className={cx('searchInput', searchInput_className, {
                    hasValueInInput: !hasValue && value !== "",
                    hasValue: hasValue,
                })}
                value={ value}
                onChange={onChange}
                onFocus={() => {
                    setPlaceholder('');
                }}
                onBlur={() => {
                    setPlaceholder(title);
                }}
                placeholder={placeholder}
                autoFocus={autoFocus}
            />
            <label className={cx('label-search', label_search_className)}>{title}</label>
        </div>
    );
}

export default InputSearch;
