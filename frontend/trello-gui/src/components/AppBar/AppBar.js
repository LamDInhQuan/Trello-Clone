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

const cx = classNames.bind(styles);

function AppBar() {
    return (
        <>
            <div className={cx('wrapper')}>
                <div className={cx('box')}>
                    <Icons.MenuBarIcon className={cx('menuBar-Icon')} />
                    <div className={cx('logo-and-name')}>
                        <Icons.TrelloIcon className={cx('trelloLogo-Icon')} />
                        <h4 className={cx('logo-name')}>Trello</h4>
                    </div>
                    <ButtonDropDownMenu rightIcon={<FontAwesomeIcon icon={faAngleDown} />}>
                        WORKSPACES
                    </ButtonDropDownMenu>
                    <ButtonDropDownMenu rightIcon={<FontAwesomeIcon icon={faAngleDown} />}>RENCENT</ButtonDropDownMenu>
                    <ButtonDropDownMenu rightIcon={<FontAwesomeIcon icon={faAngleDown} />}>STARRED</ButtonDropDownMenu>
                    <ButtonDropDownMenu rightIcon={<FontAwesomeIcon icon={faAngleDown} />}>
                        TEMPLATES
                    </ButtonDropDownMenu>
                    <Button leftIcon={<Icons.CreateIcon className={cx('icon')} />} outline>
                        Create
                    </Button>
                </div>
                <div className={cx('search-andMode')}>
                    <InputSearch />
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
                            '//yt3.ggpht.com/6A2OSDRZX3MEGnXz18r6vCr3RjTXuGRHb3fLaYO9LaGmahqEv--apCBj1Gv3FaVAon_5cRJIH-U=s88-c-k-c0x00fff'
                        }
                    ></ButtonDropDownMenu>
                </div>
            </div>
        </>
    );
}

export default AppBar;
