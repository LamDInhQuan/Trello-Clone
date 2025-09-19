//thuư viện ngoài
import styles from './Board.module.scss';
import classNames from 'classnames/bind';

// src
import AppBar from '~/components/AppBar';
import BoardContent from './BoardContent';
import BoardBar from './BoardBar';
import { useEffect, useState } from 'react';
import {
    createNewCardApi,
    createNewColumnApi,
    deleteColumnInBoard,
    fetchBoardDetailsAPI,
    updateCardOrderIdsInSameColumn,
    updateCardOrderIdsInTwoColumn,
    updateColumnOrderIds,
} from '~/apis';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { generatePlaceHolderCard } from '~/utils/formatters';
import { mapOrder } from '~/utils/sorts';
import { toast } from 'react-toastify';
import {
    fetchBoardDetailAPI,
    updateCurrentActiveBoard,
    selectCurrentActiveBoard,
} from '~/redux/activeBoard/activeBoardSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const cx = classNames.bind(styles);

// với redux phải dùng clone deep
// thay đổi giá trị trong mảng phải hoặc can thiệp sâu thì clone còn nếu gán lại = 1 giá trị khác thì ko cần
// Redux bắt buộc phải return state mới.
// Dùng spread/concat/map khi có thể.
// Chỉ dùng deep clone khi bạn phải thay đổi sâu nhiều cấp.
function Board() {
    const dispatch = useDispatch();
    // Không dùng state của component nữa mà dùng state của Redux
    // const [board, setBoard] = useState();
    const board = useSelector(selectCurrentActiveBoard);

    // useParams là hook của react-router-dom (v6 trở lên).
    // Nó trả về một object chứa các tham số động (route parameters) từ URL.
    // Mỗi key trong object chính là tên biến bạn định nghĩa trong Route.
    const { boardId} = useParams() 
    // console.log(boardId)

    const [error, setError] = useState();
    // call api lấy obj board

    useEffect(() => {
        // console.log('call api');
        // const boardId = '68af4b814b6913bb70d835bb';
        // call API
        dispatch(fetchBoardDetailAPI(boardId));
    }, [dispatch,boardId]);

    const moveColumnByColumnOrderIds = async (boardId, orderedCards) => {
        const newBoard = { ...board };
        newBoard.columns = orderedCards;
        newBoard.columnOrderIds = orderedCards.map((col) => col._id);
        dispatch(updateCurrentActiveBoard(newBoard));
        try {
            console.log('call api updateColumnOrderIds');
            // console.log('orderedCards', orderedCards);
            // console.log('columnOrderIds', newBoard.columnOrderIds);
            await updateColumnOrderIds(boardId, newBoard.columnOrderIds);
        } catch (err) {
            console.error('API cập nhật thất bại:', err);
        }
    };

    const moveCardInTheSameColumn = async (columnId, orderedCards, orderedCardIds) => {
        const newBoard = {
            ...board,
            columns: board.columns.map((col) => ({
                ...col,
                cards: [...col.cards],
                cardOrderIds: [...col.cardOrderIds], // clone array column
            })),
            columnOrderIds: [...board.columnOrderIds], // clone array columnOrderIds
        };
        // tìm cột chứa card
        const columnOfCard = newBoard.columns.find((col) => col._id === columnId);
        if (!columnOfCard.cards) columnOfCard.cards = [];
        if (!columnOfCard.cardOrderIds) columnOfCard.cardOrderIds = [];
        columnOfCard.cards = orderedCards;
        columnOfCard.cardOrderIds = orderedCardIds;
        dispatch(updateCurrentActiveBoard(newBoard));
        try {
            console.log('call api updateCardOrderIdsInSameColumn');
            await updateCardOrderIdsInSameColumn(columnId, orderedCardIds);
        } catch (err) {
            console.error('API cập nhật thất bại:', err);
        }
    };

    const moveCardInTwoColumns = async (cardId, prevColumn, nextColumn) => {
        const newBoard = {
            ...board,
            columns: [...board.columns],
            columnOrderIds: [...board.columnOrderIds], // clone array columnOrderIds
        };
        // console.log('prevColumn', prevColumn);
        // console.log('nextColumn', nextColumn);
        const FE_PlaceHolderCard = prevColumn.cards.find((card) => card.FE_PlaceHolderCard);
        // tìm cột chứa card
        const prevIndex = newBoard.columns.findIndex((col) => col._id === prevColumn._id);
        if (prevIndex !== -1) {
            newBoard.columns[prevIndex] = prevColumn;
        }
        const nextIndex = newBoard.columns.findIndex((col) => col._id === nextColumn._id);
        if (nextIndex !== -1) {
            newBoard.columns[nextIndex] = nextColumn;
        }
        dispatch(updateCurrentActiveBoard(newBoard));
        // console.log("cardId",cardId)
        // console.log("prevColumn._id,",prevColumn._id,)
        // console.log("prevColumn.cardOrderIds",prevColumn.cardOrderIds)
        // console.log("nextColumn._id",nextColumn._id)
        // console.log("nextColumn.cardOrderIds",nextColumn.cardOrderIds)
        try {
            console.log('call api moveCardInTwoColumns');
            updateCardOrderIdsInTwoColumn(
                cardId,
                prevColumn._id,
                FE_PlaceHolderCard ? [] : prevColumn.cardOrderIds,
                nextColumn._id,
                nextColumn.cardOrderIds,
            );
        } catch (err) {
            console.error('API cập nhật thất bại:', err);
        }
    };

    if (error ) {
        return (
            <div className={cx('status-wrapper')}>
                <div className={cx('error-box')}>
                    <FontAwesomeIcon icon={faTriangleExclamation} className={cx('error-icon')} />
                    <h2 className={cx('error-title')}>Không thể tải bảng làm việc</h2>
                    <p className={cx('error-message')}>Vui lòng kiểm tra kết nối hoặc đảm bảo server đang hoạt động.</p>
                </div>
                <div className={cx('icon-box')}>
                    <FontAwesomeIcon icon={faSpinner} className={cx('spinner')} />
                    <h2 className={cx('loading-title')}>Đang tải bảng làm việc...</h2>
                </div>
            </div>
        );
    }
    if(!board){
        return null
    }

    return (
        <div className={cx('wrapper')}>
            <AppBar />
            <BoardBar />
            <BoardContent
                moveColumnByColumnOrderIds={moveColumnByColumnOrderIds}
                moveCardInTheSameColumn={moveCardInTheSameColumn}
                moveCardInTwoColumns={moveCardInTwoColumns}
            />
        </div>
    );
}

export default Board;
