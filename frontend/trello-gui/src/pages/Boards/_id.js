//thuư viện ngoài
import styles from './Board.module.scss';
import classNames from 'classnames/bind';

// src
import AppBar from '~/components/AppBar';
import BoardContent from './BoardContent';
import BoardBar from './BoardBar';
import { useEffect, useState } from 'react';
import { createNewCardApi, createNewColumnApi, fetchBoardDetailsAPI, updateColumnOrderIds } from '~/apis';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { generatePlaceHolderCard } from '~/utils/formatters';

const cx = classNames.bind(styles);

function Board() {
    const [board, setBoard] = useState();
    const [error, setError] = useState();
    // call api lấy obj board

    useEffect(() => {
        console.log('call api');
        let retryTimer;
        const boardId = '68af4b814b6913bb70d835bb';

        const fetchData = () => {
            fetchBoardDetailsAPI(boardId)
                .then((board) => {
                    // thêm thẻ ảo cho column mới tạo
                    const newColumns = board.result.columns.map((col) => {
                        if (!col.cards || col.cards.length === 0) {
                            const placeholder = generatePlaceHolderCard(col);
                            return {
                                ...col,
                                cards: [placeholder],
                                cardOrderIds: [placeholder._id],
                            };
                        }
                        return col; // giữ nguyên nếu đã có cards
                    });
                    const newBoard = {
                        ...board.result,
                        columns: newColumns,
                    };
                    setBoard(newBoard);

                    setError(null); // reset lỗi nếu có trước đó
                    // Thành công => không gọi lại nữa
                })
                .catch((err) => {
                    setError('error');
                    retryTimer = setTimeout(fetchData, 3000); // Thử lại sau 3s nếu lỗi
                });
        };
        fetchData(); // gọi lần đầu

        return () => {
            clearTimeout(retryTimer); // dọn dẹp nếu component unmount
        };
    }, []);

    const createNewColumn = async (newColumnData) => {
        const createdColumn = await createNewColumnApi(newColumnData);

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

        setBoard((prev) => ({
            ...prev,
            columns: [...prev.columns, columnNew],
            columnOrderIds: [...prev.columnOrderIds, columnNew._id],
        }));
    };

    const createNewCard = async (newCardData) => {
        const createdCard = await createNewCardApi(newCardData);
        // clone board và các array bên trong
        const newBoard = {
            ...board,
            columns: [...board.columns], // clone array column
            columnOrderIds: [...board.columnOrderIds], // clone array columnOrderIds
        };
        console.log(newBoard);
        // gán _id cho card mới nếu cần
        createdCard.result._id = createdCard.result.cardId;
        // tìm cột chứa card
        const columnOfCard = newBoard.columns.find((col) => col._id === createdCard.result.columnId);
        if (!columnOfCard.cards) columnOfCard.cards = [];
        if (!columnOfCard.cardOrderIds) columnOfCard.cardOrderIds = [];
        columnOfCard.cards.push(createdCard.result);
        columnOfCard.cardOrderIds.push(createdCard.result.cardId);
        setBoard(newBoard);
    };

    const moveColumnByColumnOrderIds = async (boardId, orderedCards) => {
        const newBoard = { ...board };
        newBoard.columns = orderedCards;
        newBoard.columnOrderIds = orderedCards.map((col) => col._id);
        setBoard(newBoard);
        try {
            console.log("call api updateColumnOrderIds")
            await updateColumnOrderIds(boardId, newBoard.columnOrderIds);
        } catch (err) {
            console.error('API cập nhật thất bại:', err);
        }
    };

    if (error) {
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
    if (!board) {
        return null;
    }

    return (
        <div className={cx('wrapper')}>
            <AppBar />
            <BoardBar board={board} />
            <BoardContent
                board={board}
                createNewColumn={createNewColumn}
                createNewCard={createNewCard}
                moveColumnByColumnOrderIds={moveColumnByColumnOrderIds}
            />
        </div>
    );
}

export default Board;
