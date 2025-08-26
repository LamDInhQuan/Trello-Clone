//thuư viện ngoài
import { useState } from 'react';
import styles from './InputSearch.module.scss';
import classNames from 'classnames/bind';

// src

const cx = classNames.bind(styles);

function InputSearch() {
    const [inputValue, setInputValue] = useState('');
    const [placeholder, setPlaceholder] = useState('Search...');
    return (
        <div className={cx('wrapper')}>
            <input
                type="text"
                className={cx('searchInput')}
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value);
                }}
                onFocus={() => {
                    setPlaceholder('');
                }}
                onBlur={() => {
                    setPlaceholder('Search...');
                    setInputValue('');
                }}
                placeholder={placeholder}
            />
            <label className={cx('label-search')}>Search...</label>
        </div>
    );
}

export default InputSearch;
