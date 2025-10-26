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
    useSensors,
    useSensor,
    PointerSensor,
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
import stylesInterceptorLoading from '~/components/GlobalAppStyle/interceptorLoading.module.scss';
import { generatePlaceHolderCard } from '~/utils/formatters';
import InputSearch from '~/components/InputSearch';
import { createNewColumnApi } from '~/apis';
import { selectCurrentActiveBoard, updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

const cx = classNames.bind(styles);
const cx2 = classNames.bind(stylesInterceptorLoading);
const ACTIVE_DRAG_ITEM_TYPE = {
    COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
    CARD_ITEM: 'ACTIVE_DRAG_ITEM_TYPE_CARD-ITEM',
};

function BoardContent({ moveColumnByColumnOrderIds, moveCardInTheSameColumn, moveCardInTwoColumns }) {
    const dispatch = useDispatch();
    // Không dùng state của component nữa mà dùng state của Redux
    // const [board, setBoard] = useState();
    const board = useSelector(selectCurrentActiveBoard);

    // lấy nội dung form input add column
    const { register, watch, setValue } = useForm();
    const newColumnTitle = watch('columnTitleInput'); // sẽ update liên tục khi gõ

    // state lưu trạng thái của UI add column
    const [openNewColumnForm, setOpenNewColumnForm] = useState(false);
    const toggleOpenNewColumnForm = () => {
        setValue('columnTitleInput', '');
        setOpenNewColumnForm(!openNewColumnForm);
    };

    const addNewColumn = async () => {
        if (!newColumnTitle) {
            toast.error('Please enter column title !');
            return;
        }
        let createdColumn;
        try {
            createdColumn = await createNewColumnApi({
                boardId: board._id,
                title: newColumnTitle,
            });
        } catch (error) {
            return;
        }
        const newBoard = {
            ...board,
            columns: [...board.columns], // clone array column
            columnOrderIds: [...board.columnOrderIds], // clone array columnOrderIds
        };
        const columnNew = {
            ...createdColumn.result,
            _id: createdColumn.result.columnId, // dùng cho frontend
            cards: [],
            cardOrderIds: [],
        };
        delete columnNew.columnId; // xóa columnId
        const placeHolderCard = generatePlaceHolderCard(columnNew);
        columnNew.cards = [placeHolderCard];
        columnNew.cardOrderIds = [placeHolderCard._id];
        // gán _id cho column mới nếu cần
        // push cho phép chỉnh sửa phần tử của mảng còn concat cho phép tạo ra một mảng truyền vào
        // và ghép với mảng cũ thành 1 mảng mới
        newBoard.columns.push(columnNew);
        newBoard.columnOrderIds.push(columnNew._id);
        // hoặc
        // newBoard.columns = newBoard.columns.concat([columnNew])
        // newBoard.columnOrderIds = newBoard.columnOrderIds.concat([columnNew._id])
        dispatch(updateCurrentActiveBoard(newBoard));
        toggleOpenNewColumnForm();
        setValue('columnTitleInput', '');
    };

    // xử lí dữ liệu board
    // clone object và ghi đè field columnIds

    // dữ liệu dc sắp xếp theo order
    const [oderredCards, setOderredCards] = useState([]);
    // xử lí phần tử được kéo ( chỉ có thể column hoặc carditem )
    const [itemDragId, setItemDragId] = useState();
    const [itemDragType, setItemDragType] = useState();
    const [itemDragData, setItemDragData] = useState();
    // 1 state để lưu dữ liệu của card active khi kéo qua 2 cột xử lí drag end vì drag over đã cập nhật
    // oderredCards nên cột active ko còn là cột cũ nữa
    const [oldColumnWhenDragginCard, setOldColumnWhenDraggingCard] = useState(); // lấy data của column
    const [oldColumnWhenDragginCardEnd, setOldColumnWhenDraggingCardEnd] = useState(); // dùng cho dragend
    const [activeOverCard, setActiveOverCard] = useState(); // dùng cho dragend
    const [cardOverWhenDragginCardEnd, setCardOverWhenDragginCardEnd] = useState();
    const [newColumnWhenDragginCardEnd, setNewColumnWhenDraggingCardEnd] = useState();
    const [eventDndKitCardWhenEnd, setEventDndKitCardWhenEnd] = useState();

    // điểm va chạm cuối cùng , xử lí thuật toán phát hiện va cham
    const lastOverId = useRef();

    useEffect(() => {
        // đã sắp xếp columns ở comp cao nhất
        setOderredCards(board.columns);
    }, [board]);

    // handelDragStart : bắt đầu kéo 1 phần tửtử
    // bắt đầu kéo , xác định id phần tử kéo , loại ( card , cardItem ) , data của thẻ kéo

    const handelDragStart = (event) => {
        console.log('kéo');
        // console.log("event",event);
        setItemDragId(event.active.id);

        setItemDragType(
            event.active.data.current.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD_ITEM : ACTIVE_DRAG_ITEM_TYPE.COLUMN,
        ); // nếu phần tử kéo là carditem thì có columnId trong card , còn column thì ko có
        setItemDragData(event.active.data.current);
        // set column nếu đang kéo card

        if (event?.active?.data?.current?.columnId) {
            setOldColumnWhenDraggingCard(getColumnIdByCardId(event?.active?.id));
            setOldColumnWhenDraggingCardEnd(getColumnIdByCardId(event?.active?.id));
        }
    };
    // handelDragEnd : trigger khi kéo xog 1 phần tử  ( thả )
    // active : kéo và over : thả vào
    const handelDragEnd = (event) => {
        //  code xử lí thêm card ảo khi cột rỗng đã xử ở dragover
        let overTop = false; // thả card lên top
        let overBottom = false; // thả card xuống bottom
        // console.log(event);
        let { active, over } = event;
        if (!active) return;

        // xử lí trường hợp khi event có over null
        if (!over && activeOverCard.columnId !== oldColumnWhenDragginCard._id) {
            // console.log('xử lí lần 2 ');
            // console.log(oderredCards);
            // console.log('active._id', activeOverCard);
            // console.log('oldColumnWhenDragginCard._id', oldColumnWhenDragginCard._id);
            if (!newColumnWhenDragginCardEnd || !cardOverWhenDragginCardEnd) return;
            if (cardOverWhenDragginCardEnd._id.includes('-placeholder-card')) {
                overTop = true;
                // xử lý riêng cho trường hợp column rỗng
                // console.log('xử lí lần 3 ');
                over = active;
                // console.log(over);
            } else {
                // console.log('xử lí lần 4 ');
                over = eventDndKitCardWhenEnd.over;
                // console.log(eventDndKitCardWhenEnd);
                // xử lí lấy ra tọa độ của cột over để xử lí thả card lên đầu hoặc xuống đáy column này
                const columnEl = document.querySelector(`[data-column-id="${newColumnWhenDragginCardEnd._id}"]`);
                const columnRect = columnEl?.getBoundingClientRect();
                // console.log(columnRect);
                // console.log(over.rect.top);
                const difference = over.rect.top - columnRect.top;
                // console.log(difference);
                if (difference < 100) {
                    // mốc phụ thuộc vào tọa độ của column
                    // vị trí cách top của thẻ card lúc over vào column - vị trí cách top của column
                    overTop = true;
                    // console.log('Thả lên đầu ');
                } else if (difference > 100) {
                    overBottom = true;
                    // console.log('Thả xuống đáy');
                }
            }
        } else if (!over) {
            // một lỗi nữa là bỏ qua trường hợp !over và kéo cùng một cột => return luôn
            // console.log('activeOverCard.columnId == oldColumnWhenDragginCard._id nên không thỏa mãn ');
            return;
        }

        // xử lí kết thúc kéo card
        if (itemDragType === ACTIVE_DRAG_ITEM_TYPE.CARD_ITEM) {
            // console.log('Xử lí kéo card ');
            const {
                id: activeCardId,
                data: { current: dataActiveCardId },
            } = active; // giải mã object
            const {
                id: overCardId,
                data: { current: dataOverCardId },
            } = over || {};
            // console.log('dataOverCardId', dataOverCardId);
            // lấy cột của 2 card
            const columnActive = getColumnIdByCardId(activeCardId); // vẫn là cột over nên ko dùng
            let columnOver = getColumnIdByCardId(overCardId); // trường hợp lỗi kéo thẻ placeholder card sang column
            // khác cần set lại columnOver

            // oldColumnWhenDragginCard bạn lưu từ onDragStart mới là "cột gốc lúc bắt đầu kéo".
            // columnOver lúc dragEnd là "cột đích sau khi thả".
            // Còn columnActive khi bạn getColumnIdByCardId(activeCardId) ở dragEnd thì nó
            // đã thành column mới (vì trong dragOver bạn đã splice/move card sang đó).
            // return nếu ko có 1 trong 2 cột
            // console.log('columnOver', columnOver);
            // console.log("dataOverCardId.columnId",dataOverCardId.columnId)
            // console.log('oldColumnWhenDragginCard', oldColumnWhenDragginCard._id);
            // console.log('oldColumnWhenDragginCardEnd', oldColumnWhenDragginCardEnd._id);

            if (overCardId.includes('-placeholder-card')) {
                // console.log('lỗi kéo thẻ placeholder card ');
                columnOver = { ...columnOver, _id: dataOverCardId.columnId }; // gán lại id phải clone lại obj
                // console.log('columnOver', columnOver);
            }
            if (!columnOver) return;
            // oldColumnWhenDragginCard === columnActive
            // Xử lí kéo card trên 2 cột
            if (oldColumnWhenDragginCardEnd._id !== columnOver._id) {
                // console.log('Xử lí kéo card trên 2 cột');
                setOderredCards((prev) => {
                    // clone lại prev và cập nhật các card
                    const cloneOrderedCards = prev.map((column) => ({
                        ...column,
                        cards: [...column.cards],
                    }));
                    const cloneColumnActive = cloneOrderedCards.find(
                        (col) => col._id === oldColumnWhenDragginCardEnd._id,
                    );
                    // console.log('oldColumnWhenDragginCard', oldColumnWhenDragginCardEnd._id);
                    // console.log('cloneColumnActive', cloneColumnActive);
                    // khi rê card active sang column khác thì xóa nó ở column cũ
                    if (cloneColumnActive) {
                        cloneColumnActive.cards = cloneColumnActive.cards.filter((item) => item._id !== activeCardId);
                        // console.log(cloneColumnActive.cardOrderIds.map(id => id))
                        // nếu kéo hết card từ column có card active thì thêm 1 card PlaceHolder để có thể chuyển
                        // card lại column đang rỗng này
                        cloneColumnActive.cardOrderIds = cloneColumnActive.cards.map((card) => card._id);
                        // console.log('cloneColumnActive', cloneColumnActive);
                    }
                    const overCardIndex = columnOver?.cards?.findIndex((card) => card._id === overCardId);
                    // console.log('Vị trí over:', overCardIndex, 'Modifier:', modifier, '=> Vị trí mới:', newCardIndex);

                    // cập nhật column

                    // lấy ra vị trí của over để chèn luôn
                    const cloneColumnOver = cloneOrderedCards.find((col) => col._id === columnOver._id);
                    // console.log('cloneColumnOver', cloneColumnOver);
                    if (cloneColumnOver) {
                        if (overTop) {
                            // xử lí luôn chèn đầu khi over null
                            // nếu có card đó trong column thì xóa trc
                            cloneColumnOver.cards = cloneColumnOver.cards.filter((item) => item._id !== activeCardId);
                            // cập nhật lại dữ liệu dataActiveCardIddataActiveCardId
                            const rebuild_dataActiveCardId = { ...dataActiveCardId, columnId: cloneColumnOver._id };
                            // chèn lên đầu
                            cloneColumnOver.cards.unshift(rebuild_dataActiveCardId);
                            cloneColumnOver.cardOrderIds = cloneColumnOver.cards.map((card) => card._id);
                        } else if (overBottom) {
                            // xử lí luôn chèn cuối khi over null
                            // nếu có card đó trong column thì xóa trc
                            cloneColumnOver.cards = cloneColumnOver.cards.filter((item) => item._id !== activeCardId);
                            // cập nhật lại dữ liệu dataActiveCardIddataActiveCardId
                            const rebuild_dataActiveCardId = { ...dataActiveCardId, columnId: cloneColumnOver._id };
                            // chèn lên đầu
                            cloneColumnOver.cards.push(rebuild_dataActiveCardId);
                            cloneColumnOver.cardOrderIds = cloneColumnOver.cards.map((card) => card._id);
                        } else {
                            // nếu có card đó trong column thì xóa trc
                            cloneColumnOver.cards = cloneColumnOver.cards.filter((item) => item._id !== activeCardId);
                            // cập nhật lại dữ liệu dataActiveCardIddataActiveCardId
                            const rebuild_dataActiveCardId = { ...dataActiveCardId, columnId: cloneColumnOver._id };
                            cloneColumnOver.cards.splice(overCardIndex, 0, rebuild_dataActiveCardId); // chèn
                            cloneColumnOver.cardOrderIds = cloneColumnOver.cards.map((card) => card._id);
                        }
                    }

                    // gọi api update
                    moveCardInTwoColumns(activeCardId, cloneColumnActive, cloneColumnOver);
                    return cloneOrderedCards;
                });
            } else {
                // console.log('Xử lí kéo card trên cùng 1 cột ');
                // console.log(dataOverCardId);
                const oldCardIndex = oldColumnWhenDragginCard.cards.findIndex((card) => card._id === itemDragId);
                const newCardIndex = columnOver.cards.findIndex((card) => card._id === overCardId);
                const newOrderedCards = sortByIndex(oldColumnWhenDragginCard.cards, oldCardIndex, newCardIndex);
                const newOrderedCardsIds = newOrderedCards.map((card) => card._id);
                // vì ở lần call api board từ backend lên mảng cards chưa được sắp xếp theo mảng cardOrderIds
                // nên dẫn tới lần gọi đầu tiên gây rối loạn thứ tự , các lần kéo tiếp theo bình thường
                // console.log('oldColumnWhenDraggin ', oldColumnWhenDragginCard);
                // console.log('oldColumnWhenDragginCard ', oldColumnWhenDragginCard.cards);
                // console.log('oldCardIndex ', oldCardIndex);
                // console.log('newCardIndex ', newCardIndex);
                // set mảng
                setOderredCards((prev) => {
                    // clone mang orderedCards
                    const cloneOrderredCards = prev.map((column) => ({
                        ...column,
                        cards: [...column.cards],
                    }));
                    const newColumn = cloneOrderredCards.find((col) => col._id === oldColumnWhenDragginCard._id); // tìm cột đang dragdrag
                    newColumn.cards = newOrderedCards; // gán cards sắp xếp cho column này
                    newColumn.cardOrderIds = newOrderedCardsIds;
                    // column này tham chiếu đến cloneOrderredCards
                    return cloneOrderredCards;
                });
                // gọi api update
                if (oldCardIndex !== newCardIndex) {
                    moveCardInTheSameColumn(oldColumnWhenDragginCard._id, newOrderedCards, newOrderedCardsIds);
                }
            }
        }

        // xử lí kết thúc kéo column
        if (itemDragType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
            // console.log('Xử lí kéo column ');
            if (active.id !== over?.id) {
                // lấy vị trí lúc kéo
                const oldColumnIndex = oderredCards.findIndex((item) => item._id === active.id);

                // lấy vị trí mới lúc thả
                const newColumnIndex = oderredCards.findIndex((item) => item._id === over.id);
                // đổi chỗ vị trí khi kéo thả
                const newOddredCards = sortByIndex(oderredCards, oldColumnIndex, newColumnIndex);
                setOderredCards(newOddredCards);
                moveColumnByColumnOrderIds(board._id, newOddredCards);
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
    const handelDragOver = (event) => {
        if (itemDragType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return;
        // giải mã để lấy id card đang kéo và card đi qua
        const { active, over } = event;

        if (!active || !active.data?.current) return;
        const {
            id: activeCardId,
            data: { current: dataActiveCardId },
        } = active; // giải mã object

        // nếu over = null thì bỏ qua luôn
        if (!over) {
            // console.log('Lỗi over: null hoặc không có data.current');
            return; // hoặc return state cũ, không làm gì
        }

        const {
            id: overCardId,
            data: { current: dataOverCardId },
        } = over;

        if (!overCardId || !dataOverCardId) {
            // console.log('Lỗi over: thiếu id hoặc thiếu data');
            return;
        }
        // lấy cột của 2 card
        const columnActive = getColumnIdByCardId(activeCardId);
        const columnOver = getColumnIdByCardId(overCardId);

        setActiveOverCard(dataActiveCardId);

        // return nếu ko có 1 trong 2 cột
        if (!columnActive || !columnOver) return;
        // code phần dịch chuyển card từ column này sang column khác
        if (oldColumnWhenDragginCard._id !== columnOver._id) {
            // console.log('xử lí over');
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
                const cloneColumnActive = cloneOrderedCards.find((col) => col._id === oldColumnWhenDragginCard._id);
                // khi rê card active sang column khác thì xóa nó ở column cũ
                if (cloneColumnActive) {
                    // console.log(activeCardId);
                    cloneColumnActive.cards = cloneColumnActive.cards.filter((item) => item._id !== activeCardId);
                    cloneColumnActive.cardOrderIds = cloneColumnActive.cards.map((id) => id);
                    if (!cloneColumnActive.cards?.length) {
                        // console.log('Het card ');

                        // tạo PlaceHolderCard và add vào mảng
                        const placeHolderCard = generatePlaceHolderCard(cloneColumnActive);
                        // cloneColumnActive.cards.splice(0, 0, placeHolderCard);
                        // hoặc
                        cloneColumnActive.cards = [placeHolderCard];
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
                    cloneColumnOver.cards = cloneColumnOver.cards.filter(
                        (item) => item._id !== activeCardId && !item.FE_PlaceHolderCard,
                    );
                    // 🚀 thêm check: nếu card chưa tồn tại thì mới chèn
                    const alreadyExist = cloneColumnOver.cards.some((c) => c._id === dataActiveCardId._id);
                    if (!alreadyExist) {
                        cloneColumnOver.cards.splice(newCardIndex, 0, dataActiveCardId);
                    }

                    cloneColumnOver.cardOrderIds = cloneColumnOver.cards.map((card) => card._id);
                }
                // console.log('cloneColumnActive', cloneColumnActive);
                // console.log('cloneColumnOver', cloneColumnOver);
                if (oldColumnWhenDragginCard._id !== cloneColumnOver._id) {
                    setOldColumnWhenDraggingCard(cloneColumnOver);
                    setNewColumnWhenDraggingCardEnd(cloneColumnOver);
                    setCardOverWhenDragginCardEnd(dataOverCardId);
                    setEventDndKitCardWhenEnd(event);
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
            // const intersections = !!pointerIntersections?.length ? pointerIntersections : rectIntersection(args);
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

    const pointerSensor = useSensor(PointerSensor, {
        activationConstraint: {
            distance: 10,
        },
    });
    // Vẫn nhấn (pointer down) bình thường, nhưng chưa kích hoạt drag ngay.
    // Nó chờ bạn di chuyển con trỏ vượt quá khoảng cách distance (ví dụ 10px) mới bắt đầu drag thực sự.
    const sensors = useSensors(pointerSensor);
    return (
        <DndContext
            // collisionDetection={closestCorners} // thuật toán phát hiện va chạm dành cho phần tử to
            // custom lại thuật toán va chạm ko bug ko giật
            sensors={sensors}
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
                                <Card key={card._id} title={card.title} items={card} id={card._id} />
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
                                        valueInput={newColumnTitle}
                                        hasValue={newColumnTitle !== ''}
                                        {...register('columnTitleInput')}
                                    />
                                    <div className={cx('wrapper-button-add-column2')}>
                                        {/* // onMouseDown xảy ra trước blur input */}
                                        <Button
                                            className={`${cx('button-add-column2')} ${cx2('interceptor-loading')}`}
                                            onClick={addNewColumn}
                                        >
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
