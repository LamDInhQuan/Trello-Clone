//thuư viện ngoài
import classNames from 'classnames/bind';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

// src

import Button from '~/components/Button';
import Icons from '~/components/Icons';
import styles from './CardItem.module.scss';

const cx = classNames.bind(styles);

function CardItem({ card }) {
    // gọi useSortable đăng kí sự kiện kéo thả 
    const { attributes, listeners, setNodeRef, transform, transition , isDragging } = useSortable({
        id: card._id,
        data: { ...card },
    });
    const dndKitCardStyles = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity : isDragging ? 0.5 : undefined ,// đang kéo làm mờ phần tử kéo ,
        border : isDragging ? '1px solid black' : undefined ,
        display : card?.FE_PlaceHolderCard ? 'none' : null 
    };

    const showCardActionFooter = () => {
        return !!card?.attachments?.length || !!card?.comments?.length || !!card?.memberIds?.length;
    };

    return (
        
        // preventive : dự phòng
        // <div className={cx('preventive')} ref={setNodeRef} style={dndKitCardStyles} {...attributes}  >
        <div className={cx('wrapper')} ref={setNodeRef} style={dndKitCardStyles} {...attributes} {...listeners}>
            {card.cover && <img className={cx('image')} src={card.cover}></img>}
            <p className={cx('content')}>{card.title}</p>
            {showCardActionFooter() && (
                <div className={cx('footer')}>
                    {card?.memberIds?.length >= 0 && (
                        <Button leftIcon={<Icons.GroupIcon className={cx('icon')} />} style={{ color: '#008476' }}>
                            {card?.memberIds?.length}
                        </Button>
                    )}
                    {card?.comments?.length >= 0 && (
                        <Button leftIcon={<Icons.MessageIcon className={cx('icon2')} />} style={{ color: '#008476' }}>
                            {card?.comments?.length}
                        </Button>
                    )}
                    {card?.attachments?.length >= 0 && (
                        <Button leftIcon={<Icons.AttachIcon className={cx('icon')} />} style={{ color: '#008476' }}>
                            {card?.attachments?.length}
                        </Button>
                    )}
                </div>
            )}
        </div>
        // </div>
    );
}

export default CardItem;
