//thuư viện ngoài
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ModeSelect from '../ModeSelect';
import styles from './AppBar.module.scss';
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
// src

import Icons from '~/components/Icons';
import Button from '../Button';
import InputSearch from '../InputSearch';
import { faAngleDown, faBell, faCircle, faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import ButtonDropDownMenu from '../ButtonDropDownMenu/ButtonDropDownMenu';
import { Tooltip } from 'react-tooltip';
import { useEffect, useRef, useState } from 'react';
import { useConfirm } from 'material-ui-confirm';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUserAPIRedux, selectCurrentUser } from '~/redux/user/userSlice';
import { toast } from 'react-toastify';
import { createSearchParams, Link, useNavigate } from 'react-router-dom';
import Notification from './Notification';
import SearchIcon from '../Icons/SearchIcon';
import useDebounceCustom from '~/hooks/useDebounceCustom';
import { findListBoardsAPI, getListBoardsAPI } from '~/apis';
import randomColor from 'randomcolor';
import useClickOutSide from '~/hooks/useClickOutSide';
import PopupInput from '../PopupInput';

const cx = classNames.bind(styles);

function AppBar() {
    const dispatch = useDispatch();
    const user = useSelector(selectCurrentUser);

    const [inputSearch, setInputSearch] = useState('');
    const setOnChangeInputSearch = (e) => {
        // console.log(inputSearch);
        setInputSearch(e.target.value);
    };

    const confirmDeleteColumn = useConfirm();
    const handelLogout = () => {
        // đóng dropdown
        setMenuDropDownHide(true);

        // clear focus khỏi button dropdown
        document.activeElement?.blur();

        // gọi confirm sau 1 tick để root kịp update
        setTimeout(() => {
            confirmDeleteColumn({
                title: 'Log out your account?',
                description: 'Are you sure ?',
            })
                .then(() => {
                    dispatch(logoutUserAPIRedux());
                })
                .catch(() => {});
        }, 0);
    };

    const [overlay, setOverlay] = useState();
    const [menuDropDownHide, setMenuDropDownHide] = useState(false);
    useEffect(() => {
        if (menuDropDownHide) {
            // reset lại sau khi ép ẩn
            setMenuDropDownHide(false);
        }
        if (overlay) {
            // reset lại sau khi ép ẩn
            setOverlay(false);
        }
    }, [menuDropDownHide, overlay]);
    // custom hàm callback
    const handelMenuClick = (callback) => () => {
        if (callback) {
            callback();
        }
        setMenuDropDownHide(true);
    };

    const menuAvatarItems = [
        { label: 'My account', icon: Icons.AccountIcon, onClick: handelMenuClick(() => {}), link: '/settings/account' },
        { label: 'Add another account', icon: Icons.AddUserIcon, onClick: handelMenuClick(() => {}) },
        { label: 'Settings', icon: Icons.SettingIcon, onClick: handelMenuClick(() => {}), link: '/settings/account' },
        {
            label: 'Logout',
            icon: Icons.LogoutIcon,
            onClick: handelMenuClick(() => handelLogout()),
        },
    ];
    // console.log(user);
    const boardAndColor = JSON.parse(localStorage.getItem('allBoardAndColor')) || {};

    const [searchResults, setSearchResult] = useState();
    const [isLoading, setIsLoading] = useState(false);
    // goi API tìm kiếm ( param mặc định là q[field] : field là cột trong db )
    const debounceValue = useDebounceCustom(inputSearch, 500);
    useEffect(() => {
        if (!debounceValue) return; // chỉ gọi khi có giá trị search
        const searchObj = createSearchParams({ 'q[title]': debounceValue });
        setIsLoading(true);
        findListBoardsAPI(searchObj)
            .then((res) => {
                const results = res.result;
                // console.log(results);
                const colorsRef = randomColor({ count: results.length, luminosity: 'bright' });
                results.forEach((item, index) => {
                    if (!boardAndColor[item._id]) {
                        item.color = colorsRef[index];
                        boardAndColor[item._id] = item;
                    }
                });
                localStorage.setItem('allBoardAndColor', JSON.stringify(boardAndColor));
                setHideSearchResult(true);
                setSearchResult(results);
            })
            .catch(() => {
                setHideSearchResult(true);
                setSearchResult([]);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [debounceValue]);

    searchResults?.forEach((item) => {
        if (boardAndColor[item._id]) {
            item.color = boardAndColor[item._id]?.color;
        }
    });
    // console.log(result);

    // chuyển vào chi tiết board
    const navigate = useNavigate();
    const goToBoardDetail = (boardId) => {
        navigate(`/boards/${boardId}`);
        setHideSearchResult(false);
    };

    const searchResultRef = useRef();
    const [hideSearchResult, setHideSearchResult] = useState(false);
    useClickOutSide(
        searchResultRef,
        () => {
            setHideSearchResult(false);
        },
        hideSearchResult,
    );

    // xử lí khi thêm board ở popup thành công
    const [renderPopUp, setRenderPopup] = useState();
    const handleRenderPopup = () => {
        setRenderPopup((prev) => !prev);
    };
    // xử lí hiển thị popupp add board
    const [onPopupInput, setOnPopupInput] = useState(false);
    const createNewBoard = () => {
        setOnPopupInput(!onPopupInput);
    };

    return (
        <>
            <PopupInput onCreated={handleRenderPopup} onPopUp={onPopupInput} closePopup={createNewBoard} />
            <div className={cx('wrapper')}>
                <div className={cx('box')}>
                    <Link to={'/boards'}>
                        <Icons.MenuBarIcon className={cx('menuBar-Icon')} />
                    </Link>
                    <Link to={'/'}>
                        <div className={cx('logo-and-name')}>
                            <Icons.TrelloIcon className={cx('trelloLogo-Icon')} />
                            <h4 className={cx('logo-name')}>Trello</h4>
                        </div>
                    </Link>
                    <ButtonDropDownMenu rightIcon={<FontAwesomeIcon icon={faAngleDown} />}>
                        WORKSPACES
                    </ButtonDropDownMenu>
                    <ButtonDropDownMenu rightIcon={<FontAwesomeIcon icon={faAngleDown} />}>RENCENT</ButtonDropDownMenu>
                    <ButtonDropDownMenu rightIcon={<FontAwesomeIcon icon={faAngleDown} />}>STARRED</ButtonDropDownMenu>
                    <ButtonDropDownMenu rightIcon={<FontAwesomeIcon icon={faAngleDown} />}>
                        TEMPLATES
                    </ButtonDropDownMenu>
                    <Button leftIcon={<Icons.CreateIcon className={cx('icon')} />} outline onClick={createNewBoard}>
                        Create
                    </Button>
                </div>
                <div className={cx('search-andMode')}>
                    {/* searchResultRef bọc cả search  */}
                    <div className={cx('search-board')} ref={searchResultRef}>
                        <InputSearch
                            isSeach={isLoading} // hiện icon bằng isLoading
                            title={'Search...'}
                            leftIcon={<SearchIcon className={cx('hide-info-icon')} />}
                            searchInput_className={cx('input-username')}
                            label_search_className={cx('label-input-username')}
                            valueInput={inputSearch}
                            onChange={setOnChangeInputSearch}
                            onFocus={() => {
                                if (inputSearch === '') {
                                    setHideSearchResult(false);
                                    return;
                                }
                                setHideSearchResult(true);
                            }} // MỞ lại khi focus
                            setValueInput={setInputSearch}
                            hasValue={!!inputSearch}
                        />
                        {searchResults?.length > 0 && hideSearchResult && (
                            <div className={cx('search-board-result')}>
                                <h5>BẢNG</h5>
                                {searchResults?.map((item) => (
                                    <div
                                        key={item._id}
                                        className={cx('result-detail')}
                                        onClick={() => goToBoardDetail(item._id)}
                                    >
                                        <div className={cx('span-result')}>
                                            <span style={{ background: `${item?.color}` }}></span>
                                        </div>
                                        <div className={cx('result-detail-content')}>
                                            <h5>{item?.title}</h5>
                                            <p>{item?.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {searchResults?.length === 0 && hideSearchResult && (
                            <div className={cx('no-results')}>
                                <div className={cx('no-results-icon')}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="48"
                                        height="48"
                                        fill="none"
                                        stroke="#ccc"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className={cx('feather feather-search')}
                                    >
                                        <circle cx="21" cy="21" r="16"></circle>
                                        <line x1="32" y1="32" x2="42" y2="42"></line>
                                    </svg>
                                </div>
                                <p>Không tìm thấy bảng nào phù hợp!</p>
                            </div>
                        )}
                    </div>
                    <ModeSelect />
                    <Tippy content="notification" arrow={true}>
                        <div>
                            <Notification />
                        </div>
                    </Tippy>
                    <Tippy content="question" arrow={true}>
                        <span className={cx('faQuestion-icon')}>
                            <FontAwesomeIcon icon={faCircleQuestion} />
                        </span>
                    </Tippy>
                    <ButtonDropDownMenu
                        imgSrc={
                            user?.avatar ||
                            user?.user?.avatar ||
                            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTa7tBFCEp6gP1NhOcGkP1xrcJOkfkhLVCXOA&s'
                        }
                        menuItems={menuAvatarItems}
                        deleteOnClick={handelLogout}
                        hideFromParent={menuDropDownHide}
                        onClickMenu={(isOpen) => {
                            setOverlay(isOpen);
                        }}
                    ></ButtonDropDownMenu>
                </div>
            </div>
        </>
    );
}

export default AppBar;
