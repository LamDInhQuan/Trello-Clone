//thuư viện ngoài
import Button from '~/components/Button';
import styles from './MenuDropDownCustomItem.module.scss';
import classNames from 'classnames/bind';
import Icons from '~/components/Icons';
import { Link } from 'react-router-dom';

// src

const cx = classNames.bind(styles);

function MenuDropDownCustomItem({
    children,
    leftIcon,
    onClick,
    link,
    classNameWrapper = false,
    classNameItem = false,
}) {
    return (
        <div className={cx('wrapper',classNameWrapper)}>
            {link ? (
                <Link to={link}>
                    <Button className={cx('buttonItem')} leftIcon={leftIcon} onClick={onClick}>
                        <span className={cx('buttonLabel')}>{children}</span>
                    </Button>
                </Link>
            ) : (
                <Button className={cx('buttonItem', classNameItem)} leftIcon={leftIcon} onClick={onClick}>
                    <span className={cx('buttonLabel')}>{children}</span>
                </Button>
            )}
        </div>
    );
}

export default MenuDropDownCustomItem;
