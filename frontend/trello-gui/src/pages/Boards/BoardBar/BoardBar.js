//thuư viện ngoài
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// src
import Icons from '~/components/Icons';
import AvatarGroup from '~/components/AvatarGroup';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice';
import Button from '~/components/Button';
import styles from './BoardBar.module.scss';
import InviteBoardUser from './InviteBoardUser';

const cx = classNames.bind(styles);
const avatars = Array.from({ length: 16 }, () => ({
    src: 'https://randomuser.me/api/portraits/men/32.jpg',
    title: 'nguyen van a',
}));
const BoardIcon = <Icons.BoardIcon className={cx('icon')} />;
const PublicIcon = <Icons.PublicIcon className={cx('icon')} />;
const DriveIcon = <Icons.DriveIcon className={cx('icon')} />;
const AutomationIcon = <Icons.AutomationIcon className={cx('icon')} />;
const FilterIcon = <Icons.FilterIcon className={cx('icon')} />;
const maxAvatarVisible = 4;
function BoardBar() {
    const dispatch = useDispatch();
    // Không dùng state của component nữa mà dùng state của Redux
    // const [board, setBoard] = useState();
    const board = useSelector(selectCurrentActiveBoard);
    const title = board?.title;
    const scope = board?.scope;
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
                    <InviteBoardUser boardId={board._id}/>
                    <AvatarGroup
                        avatarGroups={board.FeUsersFromBoard}
                        maxAvatarVisible={maxAvatarVisible}
                        hidePosition={maxAvatarVisible > 0 ? false : true}
                    />
                </div>
            </div>
        </>
    );
}

export default BoardBar;
