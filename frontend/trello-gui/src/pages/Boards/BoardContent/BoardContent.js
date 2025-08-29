//thuư viện ngoài
import {
    closestCorners,
    defaultDropAnimationSideEffects,
    DndContext,
    DragOverlay,
    getFirstCollision,
    rectIntersection,
    pointerWithin,
    closestCenter,
} from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import classNames from 'classnames/bind';
import { toast } from 'react-toastify';
// src
import { useCallback, useEffect, useRef, useState } from 'react';
import { mockData } from '~/apis/mock-data';
import Button from '~/components/Button';
import Card from '~/components/Card';
import CardItem from '~/components/Card/CardItem';
import Icons from '~/components/Icons';
import { mapOrder, sortByIndex } from '~/utils/sorts';
import styles from './BoardContent.module.scss';
import { generatePlaceHolderCard } from '~/utils/formatters';
import InputSearch from '~/components/InputSearch';

const cx = classNames.bind(styles);
const ACTIVE_DRAG_ITEM_TYPE = {
    COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
    CARD_ITEM: 'ACTIVE_DRAG_ITEM_TYPE_CARD-ITEM',
};

function BoardContent({ board, createNewColumn, createNewCard }) {
    // state lưu trạng thái của UI add column
    const [openNewColumnForm, setOpenNewColumnForm] = useState(false);
    const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm);

    // lấy nội dung form input add column
    const [newColumnTitle, setNewColumnTitle] = useState('');

    const addNewColumn = () => {
        if (!newColumnTitle) {
            toast.error('Please enter column title !');
            return;
        }
        createNewColumn({
            boardId: board._id,
            title: newColumnTitle,
        });
        toggleOpenNewColumnForm();
        setNewColumnTitle('');
    };
    const setInputChangeAddColumn = (e) => {
        const val = e.target.value;
        setNewColumnTitle(val);
    };
    // xử lí dữ liệu board
    // clone object và ghi đè field columnIds
    const boardData = {
        ...board,
        columnOrderIds: board.columns.map((item) => item._id),
    };

    const originalArray = boardData.columns || [];
    const orderArray = boardData.columnOrderIds || [];
    const key = '_id';

    // dữ liệu dc sắp xếp theo order
    const [oderredCards, setOderredCards] = useState([]);

    // xử lí phần tử được kéo ( chỉ có thể column hoặc carditem )
    const [itemDragId, setItemDragId] = useState();
    const [itemDragType, setItemDragType] = useState();
    const [itemDragData, setItemDragData] = useState();
    // 1 state để lưu dữ liệu của card active khi kéo qua 2 cột xử lí drag end vì drag over đã cập nhật
    // oderredCards nên cột active ko còn là cột cũ nữa
    const [oldColumnWhenDragginCard, setOldColumnWhenDraggingCard] = useState();

    // điểm va chạm cuối cùng , xử lí thuật toán phát hiện va cham
    const lastOverId = useRef();

    useEffect(() => {
        // const orderredArray = mapOrder(originalArray, orderArray, key) // lấy mảng từ sort
        setOderredCards(mapOrder(originalArray, orderArray, key));
    }, [originalArray]);

    // handelDragStart : bắt đầu kéo 1 phần tửtử
    // bắt đầu kéo , xác định id phần tử kéo , loại ( card , cardItem ) , data của thẻ kéo

    const handelDragStart = (event) => {
        console.log('keos : ', event);
        setItemDragId(event.active.id);

        const currentData = event?.active?.data?.current;
        if (!currentData) return;

        const isCard = currentData.columnId !== undefined && currentData.columnId !== null;
        setItemDragType(isCard ? ACTIVE_DRAG_ITEM_TYPE.CARD_ITEM : ACTIVE_DRAG_ITEM_TYPE.COLUMN);

        setItemDragData(currentData);
        // set column nếu đang kéo card

        if (event?.active?.data?.current?.columnId) {
            setOldColumnWhenDraggingCard(getColumnIdByCardId(event?.active?.id));
        }
    };
    // handelDragEnd : trigger khi kéo xog 1 phần tử  ( thả )
    // active : kéo và over : thả vào
    const handelDragEnd = (event) => {
        console.log(event);
        const { active, over } = event;
        if (!active || !over) return;

        // xử lí kết thúc kéo card
        if (itemDragType === ACTIVE_DRAG_ITEM_TYPE.CARD_ITEM) {
            console.log('Xử lí kéo card ');
            const {
                id: activeCardId,
                data: { current: dataActiveCardId },
            } = active; // giải mã object
            // check placeholder trong cards
            const isPlaceHolder = dataActiveCardId.cards?.some((c) => c.FE_PlaceHolderCard);
            if (isPlaceHolder) return; // bỏ qua card placeholder
            const {
                id: overCardId,
                data: { current: dataOverCardId },
            } = over;
            // lấy cột của 2 card
            const columnActive = getColumnIdByCardId(activeCardId);
            const columnOver = getColumnIdByCardId(overCardId);

            // return nếu ko có 1 trong 2 cột
            if (!columnOver) return;

            // oldColumnWhenDragginCard === columnActive
            // Xử lí kéo card trên 2 cột
            if (oldColumnWhenDragginCard._id !== columnOver._id) {
                console.log('Xử lí kéo card trên 2 cột');
                setOderredCards((prev) => {
                    // clone lại prev và cập nhật các card
                    const cloneOrderedCards = prev.map((column) => ({
                        ...column,
                        cards: [...column.cards],
                    }));
                    const cloneColumnActive = cloneOrderedCards.find((col) => col._id === columnActive._id);
                    // khi rê card active sang column khác thì xóa nó ở column cũ
                    if (cloneColumnActive) {
                        cloneColumnActive.cards = cloneColumnActive.cards.filter((item) => item._id !== activeCardId);
                        // nếu kéo hết card từ column có card active thì thêm 1 card PlaceHolder để có thể chuyển
                        // card lại column đang rỗng này

                        cloneColumnActive.cardOrderIds = cloneColumnActive.cards.map((card) => card._id);
                    }
                    const overCardIndex = columnOver?.cards?.findIndex((card) => card._id === overCardId);
                    // console.log('Vị trí over:', overCardIndex, 'Modifier:', modifier, '=> Vị trí mới:', newCardIndex);

                    // cập nhật column

                    // lấy ra vị trí của over để chèn luôn
                    const cloneColumnOver = cloneOrderedCards.find((col) => col._id === columnOver._id);

                    if (cloneColumnOver) {
                        // nếu có card đó trong column thì xóa trc
                        cloneColumnOver.cards = cloneColumnOver.cards.filter((item) => item._id !== activeCardId);
                        // cập nhật lại dữ liệu dataActiveCardIddataActiveCardId
                        const rebuild_dataActiveCardId = { ...dataActiveCardId, columnId: cloneColumnOver._id };
                        cloneColumnOver.cards.splice(overCardIndex, 0, rebuild_dataActiveCardId); // chèn
                        cloneColumnOver.cardOrderIds = cloneColumnOver.cards.map((card) => card._id);
                    }
                    return cloneOrderedCards;
                });
            } else {
                console.log('Xử lí kéo card trên cùng 1 cột ');
                const oldCardIndex = oldColumnWhenDragginCard.cards.findIndex((card) => card._id === itemDragId);
                const newCardIndex = columnOver.cards.findIndex((card) => card._id === overCardId);
                const newCardsColumn = sortByIndex(oldColumnWhenDragginCard.cards, oldCardIndex, newCardIndex);
                // set mảng
                setOderredCards((prev) => {
                    // clone mang orderedCards
                    const cloneOrderredCards = prev.map((column) => ({
                        ...column,
                        cards: [...column.cards],
                    }));
                    const newColumn = cloneOrderredCards.find((col) => col._id === oldColumnWhenDragginCard._id); // tìm cột đang dragdrag
                    newColumn.cards = newCardsColumn; // gán cards sắp xếp cho column này
                    newColumn.cardOrderIds = newColumn.cards.map((cards) => cards._id);
                    // column này tham chiếu đến cloneOrderredCards
                    console.log(cloneOrderredCards);
                    return cloneOrderredCards;
                });
            }
        }

        // xử lí kết thúc kéo column
        if (itemDragType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
            console.log('Xử lí kéo column ');
            if (active.id !== over?.id) {
                // lấy vị trí lúc kéo
                const oldColumnIndex = oderredCards.findIndex((item) => item._id === active.id);

                // lấy vị trí mới lúc thả
                const newColumnIndex = oderredCards.findIndex((item) => item._id === over.id);
                // đổi chỗ vị trí khi kéo thả
                const newOddredCards = sortByIndex(oderredCards, oldColumnIndex, newColumnIndex);
                setOderredCards(newOddredCards);
            }
        }

        // sau khi drag end set hết dữ liệu về null
        setItemDragId(null);
        setItemDragType(null);
        setItemDragData(null);
        setOldColumnWhenDraggingCard(null);
    };

    // hàm find trả về item cụ thể
    const getColumnIdByCardId = (cardId) => {
        return oderredCards.find((column) => column?.cards.map((item) => item._id)?.includes(cardId));
    };
    // trigger khi kéo 1 phần tử qua các phần tử khác
    const handelDragOver = (event) => {
        if (itemDragType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return;
        // giải mã để lấy id card đang kéo và card đi qua
        const { active, over } = event;

        if (!over || !active || !over.data?.current || !active.data?.current) return;
        const {
            id: activeCardId,
            data: { current: dataActiveCardId },
        } = active; // giải mã object
        const {
            id: overCardId,
            data: { current: dataOverCardId },
        } = over;
        // lấy cột của 2 card
        const columnActive = getColumnIdByCardId(activeCardId);
        const columnOver = getColumnIdByCardId(overCardId);
        // return nếu ko có 1 trong 2 cột
        if (!columnActive || !columnOver) return;
        // code phần dịch chuyển card từ column này sang column khác
        if (columnActive._id !== columnOver._id) {
            setOderredCards((prev) => {
                // tìm vị trí của thằng overCard ( nơi active card sẽ thả vào đấy )
                const isBellowOverItem =
                    event.active.rect.current.translated &&
                    event.active.rect.current.translated.top + event.active.rect.current.translated.height / 2 >
                        event.over.rect.top + event.over.rect.height / 2;
                // nếu điểm giữa của thằng card active lớn hơn điểm giữa của thằng over theo trục Y
                // thì thằng active sẽ nằm dưới thằng over và ngược lại
                let newCardIndex;
                // clone lại prev và cập nhật các card
                const cloneOrderedCards = prev.map((column) => ({
                    ...column,
                    cards: [...column.cards],
                }));
                const cloneColumnActive = cloneOrderedCards.find((col) => col._id === columnActive._id);
                // khi rê card active sang column khác thì xóa nó ở column cũ
                if (cloneColumnActive) {
                    cloneColumnActive.cards = cloneColumnActive.cards.filter((item) => item._id !== activeCardId);
                    if (!cloneColumnActive.cards?.length) {
                        console.log('Het card ');

                        // tạo PlaceHolderCard và add vào mảng
                        const placeHolderCard = generatePlaceHolderCard(cloneColumnActive);
                        // cloneColumnActive.cards.splice(0, 0, placeHolderCard);
                        // hoặc
                        cloneColumnActive.cards = [placeHolderCard];
                        console.log(cloneColumnActive.cards);
                    }
                    cloneColumnActive.cardOrderIds = cloneColumnActive.cards.map((card) => card._id);
                }

                // kéo vào card trong cột khác
                const overCardIndex = columnOver?.cards?.findIndex((card) => card._id === overCardId);
                // console.log('vi tri cua card over : ', overCardIndex);
                const modifier = isBellowOverItem ? 1 : 0; // nếu phần tử bên dưới thì index + 1
                const cardCount = columnOver?.cards?.length || 0;
                newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : cardCount;
                // console.log('Vị trí over:', overCardIndex, 'Modifier:', modifier, '=> Vị trí mới:', newCardIndex);

                // cập nhật column

                const cloneColumnOver = cloneOrderedCards.find((col) => col._id === columnOver._id);

                if (cloneColumnOver) {
                    // nếu có card đó trong column thì xóa trc va  nếu cột over có card placeholder thì xóa
                    cloneColumnOver.cards = cloneColumnOver.cards.filter((item) => {
                        return item._id !== activeCardId && !item.FE_PlaceHolderCard;
                    });
                    cloneColumnOver.cards.splice(newCardIndex, 0, dataActiveCardId); // chèn

                    cloneColumnOver.cardOrderIds = cloneColumnOver.cards.map((card) => card._id);
                }

                return cloneOrderedCards;
            });
        }
    };
    const customDropAnimation = {
        sideEffect: defaultDropAnimationSideEffects({ styles: { active: { opacity: 0.5 } } }),
    };

    // args == arguments : các tham số
    // hàm này trả về mảng obj dạng { id: '...' } dựa trên va chạm để lấy phần tử đầu tiên
    // va chạm với card activee
    const collisionDetectionStrategy = useCallback(
        (args) => {
            if (itemDragType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
                return closestCorners({ ...args });
                // 	closestCorners trả về Mảng nhiều phần tử sắp xếp theo độ gần
                // 	DND-Kit chọn phần tử đầu tiên
            }
            // thuật toán va chạm sẽ trả về 1 mảng các phần tử va chạm với active

            const pointerIntersections = pointerWithin(args); //  tìm các phần tử bị chuột đè lên (mảng)
            if (!pointerIntersections?.length) return; // để đơn giản thì trường hợp card kéo
            // giữa 2 cột sẽ return luôn ko làm gì tránh bug

            // nếu card chứa ảnh kéo lên đầu giữa 2 column thì
            // pointerIntersections = [] , bỏ đoạn intersections
            //const intersections = !!pointerIntersections?.length ? pointerIntersections : rectIntersection(args);
            // rectIntersection(args) không quan tâm là cột hay card, mà chỉ kiểm tra tất cả
            // các phần tử có đăng ký là "droppable", tức là:
            // TẤT CẢ CỘT nếu bạn đang kéo cột hoặc TẤT CẢ CARD nếu bạn đang kéo card
            // kiểm tra xem bounding box nào giao nhau với collisionRect

            let overId = getFirstCollision(pointerIntersections, 'id'); // lấy phần tử đầu tiên của mảng là phần tử
            // va chạm
            if (overId) {
                // mục đích chuyển id va chạm từ cột thành card ( vì va cột trước mới va card nên sinh bug )
                // dùng closestCenter và sửa prop droppableContainers
                // closestCorners({
                //   active,                phần tử đang được kéo
                //   collisionRect,         bounding box của phần tử active
                //   droppableRects,        Map chứa bounding boxes của tất cả droppable
                //   droppableContainers,   Danh sách các container có thể droppable
                //   pointerCoordinates     Tọa độ chuột (nếu dùng pointerWithin)
                const checkColumn = oderredCards.find((col) => col._id === overId);

                if (checkColumn) {
                    // xóa luôn column va chạm

                    overId = closestCorners({
                        ...args,
                        // lọc cột va chạm , lọc các card và cột ko có id bằng id cột va chạm ,
                        // giữ lại card trong cột va chạm
                        droppableContainers: args.droppableContainers.filter((container) => {
                            // checkColumn?.cardOrderIds?.includes(container.id) mảng cardOrder của cột tìm thấy chứa containerId
                            return container.id !== overId && checkColumn?.cardOrderIds?.includes(container.id);
                        }),
                    })[0]?.id;
                }

                lastOverId.current = overId;
                return [{ id: overId }];
            }
            // nếu overID null trả về mảng rỗng
            return lastOverId.current ? [{ id: lastOverId.current }] : [];
        },
        [itemDragType, oderredCards],
    );

    const addColumnClick = () => {
        const column = {
            _id: 'column-id-05',
            boardId: 'board-id-01',
            title: 'Done Column 05',
            cardOrderIds: ['card-id-14', 'card-id-15', 'card-id-16'],
            cards: [
                {
                    _id: 'card-id-14',
                    boardId: 'board-id-01',
                    columnId: 'column-id-05',
                    title: 'Title of card 14',
                    description: null,
                    cover: null,
                    memberIds: [],
                    comments: [],
                    attachments: [],
                },
                {
                    _id: 'card-id-12',
                    boardId: 'board-id-15',
                    columnId: 'column-id-05',
                    title: 'Title of card 15',
                    description: null,
                    cover: null,
                    memberIds: [],
                    comments: [],
                    attachments: [],
                },
                {
                    _id: 'card-id-13',
                    boardId: 'board-id-16',
                    columnId: 'column-id-05',
                    title: 'Title of card 16',
                    description: null,
                    cover: null,
                    memberIds: [],
                    comments: [],
                    attachments: [],
                },
            ],
        };
        setOderredCards((prev) => {
            const newArr = prev.map((column) => ({
                ...column,
                cards: [...column.cards],
            }));

            newArr.splice(prev.length, 0, column);
            return newArr;
        });
    };

    return (
        <DndContext
            // collisionDetection={closestCorners} // thuật toán phát hiện va chạm dành cho phần tử to
            // custom lại thuật toán va chạm ko bug ko giật
            onDragStart={handelDragStart}
            onDragEnd={handelDragEnd}
            onDragOver={handelDragOver}
            collisionDetection={collisionDetectionStrategy}
        >
            <SortableContext items={oderredCards.map((item) => item._id)} strategy={horizontalListSortingStrategy}>
                <div className={cx('wrapper')}>
                    <div className={cx('scroll-inner')}>
                        {/* SortableContext yêu cầu nhận 1 mảng item ko phải là mảng object ( chuỗi , số , ...) */}

                        {oderredCards?.length > 0 &&
                            oderredCards.map((card) => (
                                <Card key={card._id} title={card.title} items={card} createNewCard={createNewCard} />
                            ))}

                        {/* DragOverlay nằm tách chỗ chứa phần tử dc kéo  */}
                        <DragOverlay dropAnimation={customDropAnimation}>
                            {!itemDragType && null}
                            {itemDragType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && (
                                <Card title={itemDragData?.title} items={itemDragData} />
                            )}
                            {itemDragType === ACTIVE_DRAG_ITEM_TYPE.CARD_ITEM && <CardItem card={itemDragData} />}
                        </DragOverlay>
                        <div className={!openNewColumnForm ? cx('add-column') : cx('add-column', 'add-column-toggle')}>
                            {!openNewColumnForm ? (
                                <Button
                                    onClick={toggleOpenNewColumnForm}
                                    className={cx('button-add-column')}
                                    leftIcon={<Icons.AddNewColumnIcon className={cx('icon')} />}
                                    padding={cx('padding-button')}
                                >
                                    Add new column
                                </Button>
                            ) : (
                                <div className={cx('input-add-title')}>
                                    <InputSearch
                                        title={'Enter column title...'}
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
                                            Add Column
                                        </Button>
                                        <Button
                                            onClick={toggleOpenNewColumnForm}
                                            leftIcon={<Icons.CloseIcon className={cx('icon2')} />}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </SortableContext>
        </DndContext>
    );
}
export default BoardContent;
