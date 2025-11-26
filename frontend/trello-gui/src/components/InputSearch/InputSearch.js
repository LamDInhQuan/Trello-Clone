//thuư viện ngoài
import { forwardRef, useImperativeHandle, useState } from 'react';
import styles from './InputSearch.module.scss';
import classNames from 'classnames/bind';
import { faL, faTruckLoading } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LoadingIcon from '../Icons/LoadingIcon';
import CloseIcon from '../Icons/CloseIcon';

// src

const cx = classNames.bind(styles);

const InputSearch = forwardRef(
    (
        {
            noValueInPlaceHolder = false,
            leftIcon = false,
            title,
            label_search_className,
            searchInput_className,
            autoFocus = false,
            hasValue = false,
            valueInput = '',
            typeInput = 'text',
            isSeach,
            onFocus,
            setValueInput,
            normalInput = false ,
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
                        marginLeft: leftIcon,
                    })}
                    ref={ref} // ✅ rất quan trọng
                    {...rest}
                    onFocus={(e) => {
                        setPlaceholder('');
                        if (onFocus) onFocus(e); // chạy thêm onFocus do cha truyền vào
                    }}
                    onBlur={() => {
                        setPlaceholder(title);
                    }}
                    placeholder={noValueInPlaceHolder ? '' : placeholder}
                    autoFocus={autoFocus}
                    value={valueInput}
                />
                {!normalInput && isSeach && <LoadingIcon className={cx('loadingIcon')} />}
                {!normalInput && !isSeach && valueInput && <CloseIcon className={cx('closeIcon')} onClick={() => setValueInput('')} />}
                <label className={cx('label-search', label_search_className)}>{title}</label>
            </div>
        );
    },
);

export default InputSearch;
