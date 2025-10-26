//thuư viện ngoài
import classNames from 'classnames/bind';

// src
import styles from './CreateBoard.module.scss';
import AppBar from '~/components/AppBar';
import MenuDropDownCustomItem from '~/components/MenuDropDownCustom/MenuDropDownCustomItem';
import CreateIcon from '~/components/Icons/CreateIcon';
import BoardsIcon from '~/components/Icons/BoardsIcon';
import TemplateIcon from '~/components/Icons/TemplateIcon';
import HomeIcon from '~/components/Icons/HomeIcon';
import Button from '~/components/Button';
import ArrowRightIcon from '~/components/Icons/ArrowRightIcon';
import ArrowLastLeftIcon from '~/components/Icons/ArrowLastLeftIcon';
import ArrowLeftI2Icon from '~/components/Icons/ArrowLeftI2Icon';
import ArrowLastRightIcon from '~/components/Icons/ArrowLastRightIcon';
import ArrowRight2Icon from '~/components/Icons/ArrowRight2Icon';
import { useEffect, useRef, useState } from 'react';
import randomColor from 'randomcolor';
import { useSearchParam } from 'react-use';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PopupInput from '~/components/PopupInput';
import { getListBoardsAPI } from '~/apis';
import ActiveCard from '~/components/Modal/ActiveCard';

const cx = classNames.bind(styles);

function CreateBoard() {
    // xử lí khi thêm board ở popup thành công
    const [renderPopUp, setRenderPopup] = useState();
    const handleRenderPopup = () => {
        setRenderPopup((prev) => !prev);
    };
    // console.log('render');
    const [onPopupInput, setOnPopupInput] = useState(false);
    const createNewBoard = () => {
        setOnPopupInput(!onPopupInput);
    };

    // xử lí mở card modal
    const [renderCardModal, setRenderCardModal] = useState();
    const handleRenderCardModal = () => {
        setRenderCardModal((prev) => !prev);
    };
    // console.log('render');
    const [onCardModal, setCardModal] = useState(false);
    const openCardModal = () => {
        setCardModal(!onCardModal);
    };

    const [searchParams, setSearchParams] = useSearchParams();
    const indexPage = Number(searchParams.get('page')) || 1; // mặc định trang 1 nếu null

    // chuyển vào chi tiết board
    const navigate = useNavigate();
    const goToBoardDetail = (boardId) => {
        navigate(`/boards/${boardId}`);
    };

    // console.log(currentPage1);
    // Array.from({ length: 50 }) tạo mảng rỗng 50 phần tử
    // (_, i) => i + 1 chính là hàm xử lý mỗi phần tử (map luôn trong đó)
    const [currentPage, setCurrentPage] = useState(indexPage);
    // console.log(currentPage);
    // let mang = Array.from({ length: 141 }, (_, i) => i + 1);
    const [mang, setMang] = useState([]);
    const [totalBoards, setTotalBoards] = useState([]);

    const itemsInPage = 12;
    const totalPages = Math.ceil(totalBoards / itemsInPage); // tổng trang
    // const lastIndexInCurrentPage = currentPage * itemsInPage;
    // const firstIndexInCurrentPage = lastIndexInCurrentPage - itemsInPage;
    // console.log(mang);
    // const boardsInPage = mang.slice(firstIndexInCurrentPage, lastIndexInCurrentPage); // cắt mảng theo trang

    // hàm tính toán phân trang ( dãy button click chuyển )
    const caculateClickNextOrPrevPageArray = (number, totalPage) => {
        // number là trang hiện tại z
        // console.log(number, totalPage);
        const soPhanTuCuaDay = 7; // tất cả phần tử click
        const soPhanTuTruocVaSauDau3Cham = 5;
        const soPhanTuoGiua2Dau3Cham = 3;
        let mang = [];
        if (totalPage > soPhanTuCuaDay) {
            // console.log('xu li tren 7 trang');
            if (number < soPhanTuTruocVaSauDau3Cham) {
                // hiển thị 5 phần tử đầu
                mang = Array.from({ length: soPhanTuTruocVaSauDau3Cham }, (_, i) => i + 1);
                mang.push('...');
                mang.push(totalPages);
            } else if (number >= soPhanTuTruocVaSauDau3Cham && number < totalPages - 2) {
                // hiển thị đoạn giữa [...,5,6,7,...]
                mang = Array.from({ length: soPhanTuoGiua2Dau3Cham }, (_, i) => number + 1 - i).reverse(); // hiển thị 3 phần tử
                mang.unshift('...');
                mang.unshift(1);
                mang.push('...');
                mang.push(totalPages);
            } else if (number >= totalPages - 2) {
                // hiển thị đoạn cuối
                mang = Array.from({ length: soPhanTuTruocVaSauDau3Cham }, (_, i) => totalPages - i).reverse();
                mang.unshift('...');
                mang.unshift(1);
            }
        } else {
            mang = Array.from({ length: totalPage }, (_, i) => i + 1);
            // console.log('xu li phan trang', mang);
        }
        return mang;
    };

    // xử lí phân mục

    useEffect(() => {
        getListBoardsAPI(indexPage).then((res) => {
            setMang(res.result[0]?.queryBoards || res.result);
            setTotalBoards(res.result[0]?.queryTotalBoards[0]?.total);
        });
    }, [indexPage, renderPopUp]);

    useEffect(() => {
        if (totalBoards > 0) {
            setPaginationArray(caculateClickNextOrPrevPageArray(indexPage, totalPages));
        }
    }, [totalBoards, indexPage, renderPopUp]);

    // console.log(mang);
    const [paginationArray, setPaginationArray] = useState([]);
    // xử lí click trang
    // hàm tính toán phân trang ( dãy button click chuyển )
    const clickPage = (number, totalPage) => {
        if (isNaN(parseInt(number)) || number === currentPage) {
            return;
        }
        const soPhanTuCuaDay = 7; // tất cả phần tử click
        const soPhanTuTruocVaSauDau3Cham = 5;
        const soPhanTuoGiua2Dau3Cham = 3;
        let mang = [];

        if (number > totalPages) {
            return;
        }
        if (totalPage > soPhanTuCuaDay) {
            if (number < soPhanTuTruocVaSauDau3Cham) {
                // hiển thị 5 phần tử đầu
                mang = Array.from({ length: soPhanTuTruocVaSauDau3Cham }, (_, i) => i + 1);
                mang.push('...');
                mang.push(totalPages);
            } else if (number >= soPhanTuTruocVaSauDau3Cham && number < totalPages - 2) {
                // hiển thị đoạn giữa [...,5,6,7,...]
                console.log('th2');
                const nextNumberClick = number + 1;
                mang = Array.from({ length: soPhanTuoGiua2Dau3Cham }, (_, i) => nextNumberClick - i).reverse(); // hiển thị 3 phần tử
                mang.unshift('...');
                mang.unshift(1);
                mang.push('...');
                mang.push(totalPages);
            } else if (number >= totalPages - 2) {
                // hiển thị đoạn cuối
                mang = Array.from({ length: soPhanTuTruocVaSauDau3Cham }, (_, i) => totalPages - i).reverse();
                mang.unshift('...');
                mang.unshift(1);
            }
        } else {
            mang = Array.from({ length: totalPage }, (_, i) => i + 1);
            // console.log('dsfsfddsf');
        }
        setCurrentPage(number);
        setPaginationArray(mang);
        setSearchParams({ page: number }); // thêm vào url '?page=n'
    };
    const clickFirstPage = () => {
        if (currentPage !== 1) {
            setCurrentPage(1);
            setSearchParams({ page: 1 });
        }
    };
    const clickLastPage = () => {
        if (currentPage !== totalPages) {
            setCurrentPage(totalPages);
            setSearchParams({ page: totalPages }); // thêm vào url '?page=n'
        }
    };

    const clickNextPage = (number) => {
        const nextPage = currentPage + 1;

        if (number > totalPages) {
            return;
        }
        const arrayResponse = caculateClickNextOrPrevPageArray(number, totalPages);
        setPaginationArray(arrayResponse);
        setCurrentPage(nextPage);
        setSearchParams({ page: nextPage }); // thêm vào url '?page=n'
    };
    const clickPrevPage = (number) => {
        const prevPage = currentPage - 1;
        if (number < 1) {
            return;
        }
        const arrayResponse = caculateClickNextOrPrevPageArray(number, totalPages);
        setPaginationArray(arrayResponse);
        setCurrentPage(prevPage);
        setSearchParams({ page: prevPage }); // thêm vào url '?page=n'
    };

    const colorsRef = randomColor({ count: 5, luminosity: 'bright' });
    const colorMapRef = useRef({});
    // console.log(currentPage);

    return (
        <>
            <ActiveCard onCreated={handleRenderCardModal} onPopUp={onCardModal} closePopup={openCardModal} />
            <PopupInput onCreated={handleRenderPopup} onPopUp={onPopupInput} closePopup={createNewBoard} />
            <div className={cx('wrapper')}>
                <AppBar />
                <div className={cx('container')}>
                    <div className={cx('sidebar')}>
                        <MenuDropDownCustomItem
                            leftIcon={<BoardsIcon className={cx('create-board-icon')} />}
                            classNameWrapper={cx('menuitemWrapper')}
                            classNameItem={cx('menuitem')}
                        >
                            Boards
                        </MenuDropDownCustomItem>
                        <MenuDropDownCustomItem
                            leftIcon={<TemplateIcon className={cx('create-board-icon')} />}
                            classNameWrapper={cx('menuitemWrapper')}
                            classNameItem={cx('menuitem')}
                        >
                            Templates
                        </MenuDropDownCustomItem>
                        <MenuDropDownCustomItem
                            leftIcon={<HomeIcon className={cx('create-board-icon')} />}
                            classNameWrapper={cx('menuitemWrapper')}
                            classNameItem={cx('menuitem')}
                        >
                            Home
                        </MenuDropDownCustomItem>
                        <span></span>
                        <MenuDropDownCustomItem
                            leftIcon={<CreateIcon className={cx('create-board-icon')} />}
                            classNameWrapper={cx('menuitemWrapper')}
                            classNameItem={cx('menuitem')}
                            onClick={createNewBoard}
                        >
                            Create a new board
                        </MenuDropDownCustomItem>
                    </div>
                    <div className={cx('content')}>
                        <h1>Your boards: </h1>
                        <div className={cx('list-boards')}>
                            {mang && mang.length > 0 ? (
                                mang.map((item) => {
                                    // console.log(item);
                                    if (!colorMapRef.current[item._id]) {
                                        colorMapRef.current[item._id] =
                                            colorsRef[Math.floor(Math.random() * colorsRef.length)];
                                    }
                                    return (
                                        <div className={cx('board')} key={item._id}>
                                            <h1 style={{ backgroundColor: colorMapRef.current[item._id] }}></h1>
                                            <h3>{item.title}</h3>
                                            <p>{item.description}</p>
                                            <Button
                                                rightIcon={<ArrowRightIcon className={cx('icon-goto-board')} />}
                                                className={cx('btn-goto-board')}
                                                onClick={() => goToBoardDetail(item._id)}
                                            >
                                                Go to board
                                            </Button>
                                        </div>
                                    );
                                })
                            ) : (
                                <p>Board is empty</p>
                            )}
                        </div>
                        <div className={cx('pagination')}>
                            {totalPages >= 1 && (
                                <span onClick={clickFirstPage}>
                                    <ArrowLastLeftIcon className={cx('icon-pagination')} />
                                </span>
                            )}
                            {totalPages >= 1 && (
                                <span onClick={() => clickPrevPage(currentPage - 1)}>
                                    <ArrowLeftI2Icon className={cx('icon-pagination')} />
                                </span>
                            )}
                            {paginationArray?.map((item, index) => {
                                // console.log(item);
                                return (
                                    <p
                                        key={index}
                                        className={cx({ currentPage: item === currentPage })}
                                        onClick={() => clickPage(item, totalPages)}
                                    >
                                        {item}
                                    </p>
                                );
                            })}

                            {totalPages >= 1 && (
                                <span onClick={() => clickNextPage(currentPage + 1)}>
                                    <ArrowRight2Icon className={cx('icon-pagination')} />
                                </span>
                            )}
                            {totalPages >= 1 && (
                                <span onClick={clickLastPage}>
                                    <ArrowLastRightIcon className={cx('icon-pagination')} />
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CreateBoard;
