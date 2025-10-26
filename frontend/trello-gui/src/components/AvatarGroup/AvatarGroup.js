//thuư viện ngoài
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
// src
import styles from './AvatarGroup.module.scss';
import images from '~/assets/images';
import { useState } from 'react';
import ButtonDropDownMenu from '../ButtonDropDownMenu/ButtonDropDownMenu';
import CheckListIcon from '../Icons/CheckListIcon';
const cx = classNames.bind(styles);

function AvatarGroup({ avatarGroups = [], maxAvatarVisible, hidePosition, classname, addMember }) {
    const visibleAvatars = avatarGroups.slice(0, maxAvatarVisible); // ảnh dc hiện
    const avatarHideCount = avatarGroups.length - maxAvatarVisible; // đếm số ảnh ẩn

    const [image, setImage] = useState({});
    const setDefaultImage = (index) => {
        setImage((prev) => ({
            ...prev,
            [index]: true,
        }));
    };

    return (
        <div className={cx('wrapper', classname)}>
            {visibleAvatars.map((avatar, index) => {
                return (
                    <Tippy content={avatar.username} arrow={true} key={index} placement="bottom">
                        <img
                            alt=""
                            src={!image[index] ? avatar.avatar : images.noImage2}
                            className={cx('avatar-visible')}
                            style={{
                                zIndex: avatarGroups.length - index
                            }}
                            onError={() => setDefaultImage(index)}
                        />
                    </Tippy>
                );
            })}
            {avatarHideCount > 0 && (
                <ButtonDropDownMenu
                    className={maxAvatarVisible > 0 ? cx('avatar-hide') : cx('avatar-hide', { hidePosition })}
                    menuItems={avatarGroups}
                    avatarGroups={true}
                    calcPosition
                    magin={80}
                    translateY={35}
                    buttonClassName={cx('buttonDropDown')}
                    addMemberAvatarGroup={addMember}
                >
                    {addMember ? <span style={{ fontSize: '18px' }}>+</span> : <span> +{avatarHideCount}</span>}
                </ButtonDropDownMenu>
            )}
        </div>
    );
}

export default AvatarGroup;
