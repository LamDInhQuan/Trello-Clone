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
import { useRef, useState } from 'react';
import randomColor from 'randomcolor';
import { useSearchParam } from 'react-use';
import { useSearchParams } from 'react-router-dom';
import PopupInput from '~/components/PopupInput';

const cx = classNames.bind(styles);

function CreateBoard() {
    console.log('render');
    const [onPopupInput, setOnPopupInput] = useState(false);
    const createNewBoard = () => {
        setOnPopupInput(!onPopupInput);
    };
    const [searchParams, setSearchParams] = useSearchParams();
    const indexPage = Number(searchParams.get('page')) || 1; // mặc định trang 1 nếu null
    // console.log(currentPage1);
    // Array.from({ length: 50 }) tạo mảng rỗng 50 phần tử
    // (_, i) => i + 1 chính là hàm xử lý mỗi phần tử (map luôn trong đó)
    const [currentPage, setCurrentPage] = useState(indexPage);
    // console.log(currentPage);
    const mang = Array.from({ length: 200 }, (_, i) => i + 1);
    const itemsInPage = 20;
    const totalPages = Math.ceil(mang.length / itemsInPage); // tổng trang
    const lastIndexInCurrentPage = currentPage * itemsInPage;
    const firstIndexInCurrentPage = lastIndexInCurrentPage - itemsInPage;
    const boardsInPage = mang.slice(firstIndexInCurrentPage, lastIndexInCurrentPage); // cắt mảng theo trang
    // hàm tính toán phân trang
    const caculateClickNextOrPrevPageArray = (number) => {
        const soPhanTuTruocVaSauDau3Cham = 5;
        const soPhanTuoGiua2Dau3Cham = 3;
        let mang;
        if (number <= soPhanTuTruocVaSauDau3Cham) {
            // hiển thị 5 phần tử đầu
            mang = Array.from({ length: soPhanTuTruocVaSauDau3Cham }, (_, i) => i + 1);
            mang.push('...');
            mang.push(totalPages);
        } else if (number >= 6 && number < totalPages - 1) {
            // hiển thị đoạn giữa [...,5,6,7,...]
            mang = Array.from({ length: soPhanTuoGiua2Dau3Cham }, (_, i) => number - i).reverse(); // hiển thị 3 phần tử
            mang.unshift('...');
            mang.unshift(1);
            mang.push('...');
            mang.push(totalPages);
        } else if (number >= totalPages - 1) {
            // hiển thị đoạn cuối
            mang = Array.from({ length: soPhanTuTruocVaSauDau3Cham }, (_, i) => totalPages - i).reverse();
            mang.unshift('...');
            mang.unshift(1);
        }
        return mang;
    };

    // xử lí phân mục
    const [paginationArray, setPaginationArray] = useState(caculateClickNextOrPrevPageArray(indexPage));
    // xử lí click trang
    const clickPage = (number) => {
        if (isNaN(parseInt(number)) || number === currentPage) {
            return;
        }
        const soPhanTuTruocVaSauDau3Cham = 5;
        const soPhanTuoGiua2Dau3Cham = 3;
        let mang;
        if (number > totalPages) {
            return;
        }
        if (number < soPhanTuTruocVaSauDau3Cham) {
            // hiển thị 5 phần tử đầu
            mang = Array.from({ length: soPhanTuTruocVaSauDau3Cham }, (_, i) => i + 1);
            mang.push('...');
            mang.push(totalPages);
            setCurrentPage(number);
        } else if (number >= soPhanTuTruocVaSauDau3Cham && number < totalPages - 2) {
            // hiển thị đoạn giữa [...,5,6,7,...]
            const nextNumberClick = number + 1;
            mang = Array.from({ length: soPhanTuoGiua2Dau3Cham }, (_, i) => nextNumberClick - i).reverse(); // hiển thị 3 phần tử
            mang.unshift('...');
            mang.unshift(1);
            mang.push('...');
            mang.push(totalPages);
            setCurrentPage(number);
        } else if (number >= totalPages - 2) {
            // hiển thị đoạn cuối
            mang = Array.from({ length: soPhanTuTruocVaSauDau3Cham }, (_, i) => totalPages - i).reverse();
            mang.unshift('...');
            mang.unshift(1);
            setCurrentPage(number);
        }
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
        const arrayResponse = caculateClickNextOrPrevPageArray(number);
        setPaginationArray(arrayResponse);
        setCurrentPage(nextPage);
        setSearchParams({ page: nextPage }); // thêm vào url '?page=n'
    };
    const clickPrevPage = (number) => {
        const prevPage = currentPage - 1;
        if (number < 1) {
            return;
        }
        const arrayResponse = caculateClickNextOrPrevPageArray(number);
        setPaginationArray(arrayResponse);
        setCurrentPage(prevPage);
        setSearchParams({ page: prevPage }); // thêm vào url '?page=n'
    };

    const colors = randomColor({ count: 5, luminosity: 'bright' });
    const colorMapRef = useRef({});
    // console.log(currentPage);
    return (
        <>
            <PopupInput onPopUp={onPopupInput} closePopup={createNewBoard} />
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
                            {boardsInPage.map((item) => {
                                if (!colorMapRef.current[item]) {
                                    colorMapRef.current[item] = colors[Math.floor(Math.random() * colors.length)];
                                }
                                return (
                                    <div className={cx('board')} key={item}>
                                        <h1 style={{ backgroundColor: colorMapRef.current[item] }}></h1>
                                        <h3>Board {item}</h3>
                                        <p>This impressive paella is a perfect...</p>
                                        <Button
                                            rightIcon={<ArrowRightIcon className={cx('icon-goto-board')} />}
                                            className={cx('btn-goto-board')}
                                        >
                                            Go to board
                                        </Button>
                                    </div>
                                );
                            })}
                        </div>
                        <div className={cx('pagination')}>
                            {totalPages >= 2 && (
                                <span onClick={clickFirstPage}>
                                    <ArrowLastLeftIcon className={cx('icon-pagination')} />
                                </span>
                            )}
                            {totalPages >= 2 && (
                                <span onClick={() => clickPrevPage(currentPage - 1)}>
                                    <ArrowLeftI2Icon className={cx('icon-pagination')} />
                                </span>
                            )}
                            {paginationArray.map((item, index) => {
                                // console.log(item);
                                return (
                                    <p
                                        key={index}
                                        className={cx({ currentPage: item === currentPage })}
                                        onClick={() => clickPage(item)}
                                    >
                                        {item}
                                    </p>
                                );
                            })}

                            {totalPages >= 2 && (
                                <span onClick={() => clickNextPage(currentPage + 1)}>
                                    <ArrowRight2Icon className={cx('icon-pagination')} />
                                </span>
                            )}
                            {totalPages >= 2 && (
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
