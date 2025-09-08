//thuư viện ngoài
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faList } from '@fortawesome/free-solid-svg-icons';
import { verticalListSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toast } from 'react-toastify';
import { useConfirm } from 'material-ui-confirm';
// src
import styles from './Card.module.scss';
import ButtonDropDownMenu from '../ButtonDropDownMenu/ButtonDropDownMenu';
import Button from '../Button';
import Icons from '../Icons';
import CardItem from './CardItem';
import { mapOrder } from '~/utils/sorts';
import InputSearch from '../InputSearch';
import { useState } from 'react';

const cx = classNames.bind(styles);

function Card({ title = 'Column Title', items = [], createNewCard }) {
    //  Khi bạn gọi useSortable() trong mỗi Card, tức là:
    //✅ Card đó đã đăng ký vào hệ thống kéo-thả của DndKit, và được phép tham gia kéo-thả.
    // DndKit context (SortableContext)	Xác định phần tử để theo dõi vị trí, thứ tự
    // data	: event.active.data.current	Lưu trữ thông tin phụ, để bạn truy xuất trong callback
    // { ... } giải mã các thuôc tính của useSortalbe dùng để kéo thảthả
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: items._id,
        data: { ...items },
    });

    const dndKitCardStyles = {
        // style của thẻ kéo
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : undefined, // đang kéo làm mờ phần tử kéo
    };

    // mảng
    const orderArray = items.cardOrderIds || [];
    const orderredArray = items.cards || [];

    // state lưu trạng thái của UI add card
    const [openNewCardForm, setOpenNewCardForm] = useState(false);
    const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm);

    // lấy nội dung form input add column
    const [newColumnTitle, setNewColumnTitle] = useState('');

    const addNewColumn = () => {
        console.log('value : ', newColumnTitle);
        if (!newColumnTitle) {
            toast.error('Please enter card title !', {
                position: 'bottom-right',
            });
            return;
        }
        createNewCard({
            boardId: items.boardId,
            columnId: items._id,
            title: newColumnTitle,
        });
        toggleOpenNewCardForm();
        setNewColumnTitle('');
    };
    const setInputChangeAddColumn = (e) => {
        const val = e.target.value;
        setNewColumnTitle(val);
    };

    const confirmDeleteColumn = useConfirm();
    const handelDeleteColumn = () => {
        console.log('delete column');
        confirmDeleteColumn({
            title: 'Delete Column ?',
            description: 'This action will permanently delete your Column and its Cards ! Are you sure ?',
        })
            .then(console.log())
            .catch(() => {});
    };

    const menuHandelColumnItem = [
        { label: 'Cut', icon: Icons.CutIcon, onClick: () => console.log('Cut') },
        { label: 'Copy', icon: Icons.CopyIcon, onClick: () => console.log('Copy') },
        { label: 'Paste', icon: Icons.PasteIcon, onClick: () => console.log('Paste') },
        { label: 'Remove', icon: Icons.RemoveIcon, onClick: () => console.log('Remove') },
    ];
    return (
        <div className={cx('preventive')} ref={setNodeRef} style={dndKitCardStyles}>
            <ButtonDropDownMenu
                rightIcon={<FontAwesomeIcon icon={faAngleDown} className={cx('icon-dropDown')} />}
                calcPosition
                magin={15}
                deleteOnClick={handelDeleteColumn}
                className={cx('button_menu')}
                menuItems={menuHandelColumnItem}
            ></ButtonDropDownMenu>
            <div className={cx('wrapper')} data-column-id={items._id}>
                <div className={cx('scroll-inner')} {...attributes} {...listeners}>
                    <div className={cx('column-title')}>
                        <h4 className={cx('title')} onClick={addNewColumn}>
                            {title}
                        </h4>
                    </div>
                    <SortableContext items={orderArray} strategy={verticalListSortingStrategy}>
                        <div className={cx('list-card')}>
                            {orderredArray.map((item) => {
                                return <CardItem key={item._id} card={item} />;
                            })}
                        </div>
                    </SortableContext>
                </div>
                <div className={cx('footer')}>
                    {!openNewCardForm ? (
                        <>
                            <Button
                                onClick={(e) => {
                                    toggleOpenNewCardForm();
                                }}
                                className={cx('button-add')}
                                leftIcon={<Icons.AddCardIcon className={cx('icon')} />}
                            >
                                Add new card
                            </Button>
                            <FontAwesomeIcon icon={faList} className={cx('icon-2')} />
                        </>
                    ) : (
                        <div className={cx('input-add-title')}>
                            <InputSearch
                                title={'Enter card title...'}
                                label_search_className={cx('label-search')}
                                searchInput_className={cx('searchInput')}
                                autoFocus={true}
                                hasValue={newColumnTitle !== ''}
                                onChange={setInputChangeAddColumn}
                                value={newColumnTitle}
                            />
                            <div className={cx('wrapper-button-add-column2')}>
                                {/* // onMouseDown xảy ra trước blur input */}
                                <Button className={cx('button-add-column2')} onClick={addNewColumn}>
                                    Add Card
                                </Button>
                                <Button
                                    onClick={toggleOpenNewCardForm}
                                    leftIcon={<Icons.CloseIcon className={cx('icon2')} />}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Card;
