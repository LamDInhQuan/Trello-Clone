//thuư viện ngoài
import classNames from 'classnames/bind';

// src
import CreateIcon from '~/components/Icons/CreateIcon';
import styles from './ActiveCard.module.scss';
import CloseBorderIcon from '~/components/Icons/CloseBorderIcon';
import images from '~/assets/images';
import BoardsIcon from '~/components/Icons/BoardsIcon';
import AvatarGroup from '~/components/AvatarGroup';
import CardDescriptionMdEditor from './CardDescriptionMdEditor';
import CardActivitySection from './CardActivitySection';
import CardIcon from '~/components/Icons/CardIcon';
import DescriptionIcon2 from '~/components/Icons/DescriptionIcon2';
import CommentIcon from '~/components/Icons/CommentIcon';
import MenuDropDownCustomItem from '~/components/MenuDropDownCustom/MenuDropDownCustomItem';
import UserIcon from '~/components/Icons/UserIcon';
import AttachIcon from '~/components/Icons/AttachIcon';
import UserIconOutline from '~/components/Icons/UserIconOutline';
import CoverIcon from '~/components/Icons/CoverIcon';
import AttachIcon2 from '~/components/Icons/AttachIcon2';
import LabelTagIcon from '~/components/Icons/LabelTagIcon';
import CheckListIcon from '~/components/Icons/CheckListIcon';
import DateIcon from '~/components/Icons/DateIcon';
import CustomFieldIcon from '~/components/Icons/CustomFieldIcon';
import ToggleFocusInput from '~/components/ToggleFocusInput';
import { useState } from 'react';
import Button from '~/components/Button';
import { useDispatch, useSelector } from 'react-redux';
import {
    clearCurrentActiveCard,
    selectCurrentActiveCard,
    updateCurrentActiveCard,
} from '~/redux/activeCard/activeCardSlice';
import { updateCoverCardAPI, updateTitleCardAPI } from '~/apis';
import { toast } from 'react-toastify';
import { updateCardInBoard } from '~/redux/activeBoard/activeBoardSlice';
import { singleFileValidator } from '~/utils/validators';

const cx = classNames.bind(styles);
const avatars = Array.from({ length: 16 }, () => ({
    src: 'https://randomuser.me/api/portraits/men/32.jpg',
    title: 'nguyen van a',
}));
const maxAvatarVisible = 8;
function ActiveCard({ onPopUp = true, closePopup, onCreated }) {
    const dispatch = useDispatch();
    const currentActiveCard = useSelector(selectCurrentActiveCard);

    const [editTitleColumn, setEditTitleColumn] = useState(false); // kiểm tra focus title column
    const [updateColumnTitle, setUpdateColumnTitle] = useState('Coladeptrai');

    const updateCardInBoardRedux = (card) => {
        dispatch(updateCurrentActiveCard(card));
        dispatch(updateCardInBoard(card));
    };
    const onUpdateCardTitle = (title) => {
        updateTitleCardAPI({ cardId: currentActiveCard._id || currentActiveCard.cardId, title: title })
            .then((res) => {
                if (!res.error) {
                    toast.success('Cập nhật tiêu đề Card thành công!');
                }
                updateCardInBoardRedux(res.result);
            })
            .catch(() => {});
    };

    const handelClosePopup = () => {
        dispatch(clearCurrentActiveCard());
    };

    const uploadAvatar = (e) => {
        console.log(e.target.files[0]);
        const error = singleFileValidator(e.target.files[0]);
        if (error) {
            toast.error(error);
            return;
        }
        // sử dụng FormData để xử lý dữ liệu liên quan tới file khi gọi API
        // FormData là đối tượng có sẵn trong JavaScript (built-in API của trình duyệt), dùng để
        //  tạo ra một “form ảo” chứa các cặp key–value tương tự như form HTML gửi lên server.
        let reqData = new FormData();
        reqData.append('cardCover', e.target.files[0]);
        reqData.append('cardId', currentActiveCard.cardId || currentActiveCard._id);
        // Cách để log được dữ liệu thông qua FormData
        console.log('reqData', reqData); // ko log dc luôn
        for (const value of reqData.values()) {
            console.log('reqData Value ', value);
        }

        // gọi API
        toast
            .promise(
                updateCoverCardAPI(reqData).finally(() => {
                    console.log('delete file avatar');
                    e.target.value = ''
                    // console.log(e.target.files[0]);
                }),
                {
                    pending: 'Updating...',
                    success : 'Update card cover successfully'
                },
            )
            .then((res) => {
                // kiểm tra đăng nhập không có lỗi điều hướng về route ("/")
                // console.log(res);

                // Lưu ý dù có lỗi hoặc thành công thì cũng phải clear giá trị của file input , nếu không
                // thì sẽ không thể chọn cùng một file liên tiếp được
                e.target.value = '';
                updateCardInBoardRedux(res.result)
            })
            .catch(() => {});
    };
    return (
        <>
            <div className={cx('overlay', { onPopUp: onPopUp })}>
                <div className={cx('wrapper')}>
                    <div className={cx('header')}>
                        <span onClick={handelClosePopup}>
                            <CloseBorderIcon className={cx('iconClose')} />
                        </span>
                    </div>
                    {currentActiveCard?.cardCover && (
                        <div className={cx('imageHeader')}>
                            <img src={currentActiveCard?.cardCover}></img>
                        </div>
                    )}
                    <div className={cx('titleCard')}>
                        <CardIcon className={cx('iconCardTitle')} />
                        <ToggleFocusInput
                            className={cx('titleInput', { active: editTitleColumn })}
                            value={currentActiveCard?.title}
                            onFocusChange={setEditTitleColumn}
                            onUpdateColumnTitle={onUpdateCardTitle}
                        />
                    </div>
                    <div className={cx('content')}>
                        <div className={cx('leftContent')}>
                            <div className={cx('member')}>
                                <p>Members</p>
                                <AvatarGroup
                                    classname={cx('avatarGroup')}
                                    avatarGroups={avatars}
                                    maxAvatarVisible={maxAvatarVisible}
                                    hidePosition={maxAvatarVisible > 0 ? false : true}
                                    addMember={true}
                                />
                            </div>
                            <div className={cx('descriptionCard')}>
                                <div className={cx('descriptionCardHeader')}>
                                    <DescriptionIcon2 className={cx('iconCardDescription')} />
                                    <h3>Description</h3>
                                </div>
                                <CardDescriptionMdEditor
                                    value={currentActiveCard?.description}
                                    updateCardInBoardRedux={updateCardInBoardRedux}
                                />
                            </div>
                            <div className={cx('activityCard')}>
                                <div className={cx('activityCardHeader')}>
                                    <CommentIcon className={cx('iconCardActivity')} />
                                    <h3>Activity</h3>
                                </div>
                                <CardActivitySection />
                            </div>
                        </div>
                        <div className={cx('rightContent')}>
                            <div className={cx('menuAddCard')}>
                                <p>Add To Card</p>
                                <div className={cx('menuAddCardItems')}>
                                    <MenuDropDownCustomItem
                                        leftIcon={<UserIconOutline className={cx('menuItemIcon')} />}
                                        classNameItem={cx('menuItemP')}
                                    >
                                        Join
                                    </MenuDropDownCustomItem>
                                    <Button
                                        inputFile={true}
                                        leftIcon={<CoverIcon className={cx('menuItemIcon')} />}
                                        className={cx('menuItemButton')}
                                        onChangeFile={uploadAvatar}
                                    >
                                        Upload
                                    </Button>
                                    <MenuDropDownCustomItem
                                        leftIcon={<AttachIcon2 className={cx('menuItemIcon')} />}
                                        classNameItem={cx('menuItemP')}
                                    >
                                        Attachment
                                    </MenuDropDownCustomItem>
                                    <MenuDropDownCustomItem
                                        leftIcon={<LabelTagIcon className={cx('menuItemIcon')} />}
                                        classNameItem={cx('menuItemP')}
                                    >
                                        Labels
                                    </MenuDropDownCustomItem>
                                    <MenuDropDownCustomItem
                                        leftIcon={<CheckListIcon className={cx('menuItemIcon')} />}
                                        classNameItem={cx('menuItemP')}
                                    >
                                        Checklist
                                    </MenuDropDownCustomItem>
                                    <MenuDropDownCustomItem
                                        leftIcon={<DateIcon className={cx('menuItemIcon')} />}
                                        classNameItem={cx('menuItemP')}
                                    >
                                        Dates
                                    </MenuDropDownCustomItem>
                                    <MenuDropDownCustomItem
                                        leftIcon={<CustomFieldIcon className={cx('menuItemIcon')} />}
                                        classNameItem={cx('menuItemP')}
                                    >
                                        Custom Fields
                                    </MenuDropDownCustomItem>
                                </div>
                            </div>
                            <span></span>
                            <div className={cx('menuAddCard')}>
                                <p>Power-Ups</p>
                                <div className={cx('menuAddCardItems')}>
                                    <MenuDropDownCustomItem
                                        leftIcon={<CheckListIcon className={cx('menuItemIcon')} />}
                                        classNameItem={cx('menuItemP')}
                                    >
                                        Checklist
                                    </MenuDropDownCustomItem>
                                    <MenuDropDownCustomItem
                                        leftIcon={<DateIcon className={cx('menuItemIcon')} />}
                                        classNameItem={cx('menuItemP')}
                                    >
                                        Dates
                                    </MenuDropDownCustomItem>
                                    <MenuDropDownCustomItem
                                        leftIcon={<CustomFieldIcon className={cx('menuItemIcon')} />}
                                        classNameItem={cx('menuItemP')}
                                    >
                                        Custom Fields
                                    </MenuDropDownCustomItem>
                                </div>
                            </div>
                            <span></span>
                            <div className={cx('menuAddCard')}>
                                <p>Actions</p>
                                <div className={cx('menuAddCardItems')}>
                                    <MenuDropDownCustomItem
                                        leftIcon={<AttachIcon2 className={cx('menuItemIcon')} />}
                                        classNameItem={cx('menuItemP')}
                                    >
                                        Attachment
                                    </MenuDropDownCustomItem>
                                    <MenuDropDownCustomItem
                                        leftIcon={<LabelTagIcon className={cx('menuItemIcon')} />}
                                        classNameItem={cx('menuItemP')}
                                    >
                                        Labels
                                    </MenuDropDownCustomItem>
                                    <MenuDropDownCustomItem
                                        leftIcon={<CheckListIcon className={cx('menuItemIcon')} />}
                                        classNameItem={cx('menuItemP')}
                                    >
                                        Checklist
                                    </MenuDropDownCustomItem>
                                    <MenuDropDownCustomItem
                                        leftIcon={<DateIcon className={cx('menuItemIcon')} />}
                                        classNameItem={cx('menuItemP')}
                                    >
                                        Dates
                                    </MenuDropDownCustomItem>
                                    <MenuDropDownCustomItem
                                        leftIcon={<CustomFieldIcon className={cx('menuItemIcon')} />}
                                        classNameItem={cx('menuItemP')}
                                    >
                                        Custom Fields
                                    </MenuDropDownCustomItem>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ActiveCard;
