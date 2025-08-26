//thuư viện ngoài
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
// src
import styles from './AvatarGroup.module.scss';
import images from '~/assets/images';
import { useState } from 'react';
const cx = classNames.bind(styles);

function AvatarGroup({ avatarGroups = [], maxAvatarVisible, hidePosition }) {
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
        <div className={cx('wrapper')}>
            {visibleAvatars.map((avatar, index) => {
                return (
                    <Tippy content={avatar.title} arrow={true} key={index}>
                        <img
                            alt=""
                            src={!image[index] ? avatar.src : images.noImage2}
                            className={cx('avatar-visible')}
                            style={{
                                zIndex: avatarGroups.length - index,
                                ...(image[index] && { width: '34px', padding: 0, marginLeft: '-10px' }),
                            }}
                            onError={() => setDefaultImage(index)}
                        />
                    </Tippy>
                );
            })}
            <h4 className={maxAvatarVisible > 0 ? cx('avatar-hide') : cx('avatar-hide', { hidePosition })}>
                +{avatarHideCount}
            </h4>
        </div>
    );
}

export default AvatarGroup;
