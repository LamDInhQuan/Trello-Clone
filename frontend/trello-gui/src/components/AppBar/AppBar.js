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
import { useEffect, useState } from 'react';
import { useConfirm } from 'material-ui-confirm';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUserAPIRedux, selectCurrentUser } from '~/redux/user/userSlice';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function AppBar() {
    const dispatch = useDispatch();
    const user = useSelector(selectCurrentUser);

    const [inputSearch, setInputSearch] = useState('');
    const setOnChangeInputSearch = (e) => {
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
        {
            label: 'Profile',
            icon: Icons.AccountIcon,
            onClick: handelMenuClick(() => {}),
        },
        { label: 'My account', icon: Icons.AccountIcon, onClick: handelMenuClick(() => {}) },
        { label: 'Add another account', icon: Icons.AddUserIcon, onClick: handelMenuClick(() => {}) },
        { label: 'Settings', icon: Icons.SettingIcon, onClick: handelMenuClick(() => {}), link: '/settings/account' },
        {
            label: 'Logout',
            icon: Icons.LogoutIcon,
            onClick: handelMenuClick(() => handelLogout()),
        },
    ];
    // console.log(user);
    return (
        <>
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
                    <Button
                        leftIcon={<Icons.CreateIcon className={cx('icon')} />}
                        outline
                        onClick={() => {
                            alert(inputSearch);
                        }}
                    >
                        Create
                    </Button>
                </div>
                <div className={cx('search-andMode')}>
                    <InputSearch title={'Search...'} value={inputSearch} onChange={setOnChangeInputSearch} />
                    <ModeSelect />
                    <Tippy content="inbox" arrow={true}>
                        <span className={cx('faBell-icon')}>
                            <FontAwesomeIcon icon={faBell} />
                        </span>
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
