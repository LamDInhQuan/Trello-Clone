//thuư viện ngoài
import Button from '~/components/Button';
import styles from './BoardBar.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Icons from '~/components/Icons';
import AvatarGroup from '~/components/AvatarGroup';
// src

const cx = classNames.bind(styles);
const avatars = [
    {
        src: 'https:/0DlISp7DYINwjAZnu8k0wjY939RuTEcoP5d83SrAO0Nr8',
        title: 'nguyen van a',
    },
    {
        src: 'https:/',
        title: 'nguyen van b',
    },
    {
        src: 'data:image/jpeg;base64,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',
        title: 'nguyen van c',
    },
    {
        src: 'https://yt3.googleusercontent.com/qGrcViAdsmfdL8NhR03s6jZVi2AP4A03XeBFShu2M4Jd88k1fNXDnpMEmHU6CvNJuMyA2z1maA0=s900-c-k-c0x00ffffff-no-rj',
        title: 'nguyen van d',
    },
    {
        src: 'https:/',
        title: 'nguyen van e',
    },
];
const BoardIcon = <Icons.BoardIcon className={cx('icon')} />;
const PublicIcon = <Icons.PublicIcon className={cx('icon')} />;
const DriveIcon = <Icons.DriveIcon className={cx('icon')} />;
const AutomationIcon = <Icons.AutomationIcon className={cx('icon')} />;
const FilterIcon = <Icons.FilterIcon className={cx('icon')} />;
const maxAvatarVisible = 4;
function BoardBar({ board }) {
    const title = board?.title 
    const scope = board?.scope
    return (
        <>
            <div className={cx('wrapper')}>
                <div className={cx('chip-Group')}>
                    <Button leftIcon={BoardIcon} chipHover>
                        {title}
                    </Button>
                    <Button leftIcon={PublicIcon} chipHover>
                        {scope}
                    </Button>
                    <Button leftIcon={DriveIcon} chipHover>
                        Add To Google Drive
                    </Button>
                    <Button leftIcon={AutomationIcon} chipHover>
                        Automation
                    </Button>
                    <Button leftIcon={FilterIcon} chipHover>
                        Filters
                    </Button>
                </div>
                <div className={cx('avatar-Group')}>
                    <Button
                        leftIcon={<Icons.AddGroupIcon className={cx('icon-invite')} />}
                        outline
                        avatarGroup={maxAvatarVisible > 0 ? false : true}
                    >
                        Invite
                    </Button>
                    <AvatarGroup
                        avatarGroups={avatars}
                        maxAvatarVisible={maxAvatarVisible}
                        hidePosition={maxAvatarVisible > 0 ? false : true}
                    />
                </div>
            </div>
        </>
    );
}

export default BoardBar;
