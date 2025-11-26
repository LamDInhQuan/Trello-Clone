//thuư viện ngoài
import Button from '~/components/Button';
import styles from './MenuDropDownCustomItem.module.scss';
import classNames from 'classnames/bind';
import Icons from '~/components/Icons';
import { Link } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import CheckListIcon from '~/components/Icons/CheckListIcon';
import CheckListIcon2 from '~/components/Icons/CheckListIcon2';

// src

const cx = classNames.bind(styles);

function MenuDropDownCustomItem({
    children,
    leftIcon,
    onClick,
    link,
    classNameWrapper = false,
    classNameItem = false,
    src = false,
    avatarName,
    addMemberAvatarGroup = false,
    memberId,
}) {
    // console.log(onClick);
    // console.log(addMemberAvatarGroup);
    return (
        <div className={cx('wrapper', classNameWrapper)}>
            {link ? (
                <Link to={link}>
                    <Button className={cx('buttonItem')} leftIcon={leftIcon} onClick={onClick}>
                        <span className={cx('buttonLabel')}>{children}</span>
                    </Button>
                </Link>
            ) : src ? (
                <Tippy content={avatarName} arrow={true} placement="bottom" className={cx('tippy')}>
                    <div className={cx('avatar-wrapper')}>
                        <img
                            alt=""
                            src={src}
                            className={cx('avatar')}
                            onClick={() => {
                                if (typeof onClick === 'function') {
                                    memberId ? onClick(memberId) : onClick();
                                }
                            }}
                        />
                        {addMemberAvatarGroup && <CheckListIcon2 className={cx('iconMemberAvatarGroup')} />}
                    </div>
                </Tippy>
            ) : (
                <Button className={cx('buttonItem', classNameItem)} leftIcon={leftIcon} onClick={onClick}>
                    <span className={cx('buttonLabel')}>{children}</span>
                </Button>
            )}
        </div>
    );
}

export default MenuDropDownCustomItem;
