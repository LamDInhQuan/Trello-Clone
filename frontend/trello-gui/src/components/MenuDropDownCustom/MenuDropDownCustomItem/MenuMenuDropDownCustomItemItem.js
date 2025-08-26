//thuư viện ngoài
import Button from '~/components/Button';
import styles from './MenuDropDownCustomItem.module.scss';
import classNames from 'classnames/bind';
import Icons from '~/components/Icons';

// src

const cx = classNames.bind(styles);

function MenuDropDownCustomItem({ children, leftIcon }) {
    return (
        <div className={cx('wrapper')}>
            <Button className={cx('buttonItem')} leftIcon={leftIcon}>
                {children}
            </Button>
        </div>
    );
}

export default MenuDropDownCustomItem;
