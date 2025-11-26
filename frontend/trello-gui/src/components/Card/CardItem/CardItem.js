//thuư viện ngoài
import classNames from 'classnames/bind';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

// src

import Button from '~/components/Button';
import Icons from '~/components/Icons';
import styles from './CardItem.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import {
    clearCurrentActiveCard,
    selectCurrentActiveCard,
    updateCurrentActiveCard,
} from '~/redux/activeCard/activeCardSlice';
import AvatarGroup from '~/components/AvatarGroup';
import { selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice';

const cx = classNames.bind(styles);
const maxAvatarVisible = 4;
function CardItem({ card }) {
    const dispatch = useDispatch();
    const board = useSelector(selectCurrentActiveBoard);

    const memberIds = card?.memberIds;
    const Fe_MemberInCard = board?.FeUsersFromBoard.filter((item) => memberIds?.some((id) => id === item._id));
    // console.log(Fe_MemberInCard.length);

    // gọi useSortable đăng kí sự kiện kéo thả
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: card._id,
        data: { ...card },
    });
    const dndKitCardStyles = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : undefined, // đang kéo làm mờ phần tử kéo ,
        border: isDragging ? '1px solid black' : undefined,
        display: card?.FE_PlaceHolderCard ? 'none' : null,
    };

    const showCardActionFooter = () => {
        return !!card?.attachments?.length || !!card?.comments?.length || !!card?.memberIds?.length;
    };

    const handleClickCardItem = () => {
        // console.log("click ");
        // console.log(card);
        dispatch(updateCurrentActiveCard(card));
    };
    return (
        // preventive : dự phòng
        // <div className={cx('preventive')} ref={setNodeRef} style={dndKitCardStyles} {...attributes}  >
        <div
            className={cx('wrapper')}
            ref={setNodeRef}
            style={dndKitCardStyles}
            {...attributes}
            {...listeners}
            onClick={handleClickCardItem}
        >
            {card?.cardCover && <img className={cx('image')} src={card?.cardCover}></img>}
            <p className={cx('content')}>{card.title}</p>
            {showCardActionFooter() && (
                <div className={cx('footer')}>
                    {card?.memberIds?.length > 0 && (
                        <div>
                            <Button
                                leftIcon={<Icons.GroupIcon className={cx('icon')} />}
                                style={{ color: 'var(---color-blue)' }}
                            >
                                {card?.memberIds?.length}
                            </Button>
                        </div>
                    )}
                    {card?.comments?.length > 0 && (
                        <div>
                            <Button
                                leftIcon={<Icons.MessageIcon className={cx('icon2')} />}
                                style={{ color: 'var(---color-blue)' }}
                            >
                                {card?.comments?.length}
                            </Button>
                        </div>
                    )}
                    {card?.attachments?.length > 0 && (
                        <div>
                            <Button
                                leftIcon={<Icons.AttachIcon className={cx('icon')} />}
                                style={{ color: 'var(---color-blue)' }}
                            >
                                {card?.attachments?.length}
                            </Button>
                        </div>
                    )}
                </div>
            )}
            <div className={cx('avatarGroup')}>
                <AvatarGroup
                    avatarGroups={Fe_MemberInCard}
                    maxAvatarVisible={maxAvatarVisible}
                    hidePosition={maxAvatarVisible > 0 ? false : true}
                    avatarClassName={cx('avatarItemGroup', {
                        avatarTranslate: Fe_MemberInCard?.length === 1,
                    })}
                    buttonDropDownClassName={cx('buttonDropDownClassName')}
                    hiddenButtonDropDown={true}
                />
            </div>
        </div>
        // </div>
    );
}

export default CardItem;
