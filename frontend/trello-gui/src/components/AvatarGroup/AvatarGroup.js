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
import { CARD_MEMBER_ACTIONS } from '~/utils/constants';
const cx = classNames.bind(styles);

function AvatarGroup({
    avatarGroups = [],
    maxAvatarVisible,
    hidePosition,
    classname,
    addMember,
    membersInBoard = [],
    isMemberInCard,
    onUpdateMemberIds,
    avatarClassName,
    buttonDropDownClassName,
    hiddenButtonDropDown,
}) {
    // console.log(avatarGroups);
    // console.log(membersInBoard);

    const visibleAvatars = avatarGroups.slice(0, maxAvatarVisible); // ảnh dc hiện
    const avatarHideCount = avatarGroups.length - maxAvatarVisible; // đếm số ảnh ẩn
    // console.log(avatarHideCount);
    const [image, setImage] = useState({});
    const setDefaultImage = (index) => {
        setImage((prev) => ({
            ...prev,
            [index]: true,
        }));
    };
    const handelUpdateMemberInBoard = (memberId) => {
        const status = isMemberInCard?.(memberId);
        const incomingMemberInfo = {
            userId: memberId,
            cardMemberAction: status ? CARD_MEMBER_ACTIONS.REMOVE : CARD_MEMBER_ACTIONS.ADD,
        };
        // console.log('incomingMemberInfo', incomingMemberInfo);
        onUpdateMemberIds(incomingMemberInfo);
    };
    // thêm thuộc tính onClick
    const enhancedMembers = membersInBoard.map((member) => ({
        ...member,
        onClick: handelUpdateMemberInBoard,
    }));

    return (
        <div className={cx('wrapper', classname)}>
            {visibleAvatars.map((avatar, index) => {
                return (
                    <Tippy content={avatar.username} arrow={true} key={index} placement="bottom">
                        <img
                            alt=""
                            src={!image[index] ? avatar.avatar : images.noImage2}
                            className={cx('avatar-visible', avatarClassName)}
                            style={{
                                zIndex: avatarGroups.length - index,
                            }}
                            onError={() => setDefaultImage(index)}
                        />
                    </Tippy>
                );
            })}
            {avatarHideCount > 0 && !addMember && (
                <ButtonDropDownMenu
                    className={cx('avatar-hide', maxAvatarVisible <= 0 && { hidePosition }, buttonDropDownClassName)}
                    menuItems={!hiddenButtonDropDown && addMember ? enhancedMembers : avatarGroups}
                    avatarGroups={true}
                    calcPosition
                    magin={105}
                    translateY={35}
                    buttonClassName={cx('buttonDropDown')}
                    addMemberAvatarGroup={addMember}
                    isMemberInCard={isMemberInCard}
                >
                    {!addMember && <span>+{avatarHideCount}</span>}
                </ButtonDropDownMenu>
            )}
            {avatarHideCount < 0 && addMember && (
                <ButtonDropDownMenu
                    className={cx('avatar-hide', maxAvatarVisible <= 0 && { hidePosition }, buttonDropDownClassName)}
                    menuItems={!hiddenButtonDropDown && addMember ? enhancedMembers : avatarGroups}
                    avatarGroups={true}
                    calcPosition
                    magin={25}
                    translateY={35}
                    buttonClassName={cx('buttonDropDown')}
                    addMemberAvatarGroup={addMember}
                    isMemberInCard={isMemberInCard}
                >
                    {addMember && !hiddenButtonDropDown && <span style={{ fontSize: '18px' }}>+</span>}
                </ButtonDropDownMenu>
            )}
        </div>
    );
}

export default AvatarGroup;
