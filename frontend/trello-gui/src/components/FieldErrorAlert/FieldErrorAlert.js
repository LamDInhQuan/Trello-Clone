//thuư viện ngoài
import classNames from 'classnames/bind';

// src

import Button from '~/components/Button';
import Icons from '~/components/Icons';
import styles from './FieldErrorAlert.module.scss';

const cx = classNames.bind(styles);

function FieldErrorAlert({ errors, fieldName }) {
    const message = errors?.[fieldName]?.message;
    // console.log(errors)
    return !message ? null : 
    <div className={cx('wrapper')}>
        <Icons.ErrorOutline className={cx('icon')}/>
        <p>{ message|| ''}</p>
    </div>;
}

export default FieldErrorAlert;
