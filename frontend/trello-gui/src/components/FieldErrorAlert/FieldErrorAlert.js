//thuư viện ngoài
import classNames from 'classnames/bind';

// src

import Button from '~/components/Button';
import Icons from '~/components/Icons';
import styles from './FieldErrorAlert.module.scss';

const cx = classNames.bind(styles);

function FieldErrorAlert({ errors, fieldName, className, messageClassName = false, iconClassName }) {
    const message = errors?.[fieldName]?.message;
    // console.log(errors)
    return !message ? null : (
        <div className={cx('wrapper', className)}>
            <Icons.ErrorOutline className={cx('icon', iconClassName)} />
            <p className={messageClassName}>{message || ''}</p>
        </div>
    );
}

export default FieldErrorAlert;
