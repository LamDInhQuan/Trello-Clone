//thuư viện ngoài
import styles from './Board.module.scss';
import classNames from 'classnames/bind';

// src
import AppBar from '~/components/AppBar';
import BoardContent from './BoardContent';
import BoardBar from './BoardBar';
import { useEffect, useState } from 'react';
import { fetchBoardDetailsAPI } from '~/apis';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Board() {
    const [board, setBoard] = useState();
    const [error, setError] = useState();
    // call api lấy obj board
    console.log(board);

    useEffect(() => {
        console.log('call api');
        let retryTimer;
        const boardId = '68af4b814b6913bb70d835bb';

        const fetchData = () => {
            fetchBoardDetailsAPI(boardId)
                .then((board) => {
                    console.log('sdfvs', board);
                    setBoard(board.result);
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
            <BoardContent board={board} />
        </div>
    );
}

export default Board;
