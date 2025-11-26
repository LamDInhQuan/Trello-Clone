//thuư viện ngoài
import styles from './Notification.module.scss';

// src
import classNames from 'classnames/bind';
import ButtonDropDownMenu from '../ButtonDropDownMenu/ButtonDropDownMenu';
import AddGroupIcon from '../Icons/AddGroupIcon';
import { useEffect, useState } from 'react';
import NotificationIcon from '../Icons/NotificationIcon';
import Button from '../Button';
import moment from 'moment';
import TickIcon from '../Icons/TickIcon';
import RejectIcon from '../Icons/RejectIcon';
import { useDispatch, useSelector } from 'react-redux';
import {
    addNewNotification,
    fetchNotificationsAPIRedux,
    selectCurrentNotifications,
    updateNotificationIsInvitationAPIRedux,
} from '~/redux/notifications/notificationsSlice';
import { socketIoInstance } from '~/index';
import { socketStompClient } from '~/utils/socketSTOMPClient';
import useClickOutSide from '~/hooks/useClickOutSide';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);
const STATUS = { PENDING: 'PENDING', SUCCESS: 'SUCCESSED', REJECT: 'REJECTED' };
const NotificationForm = ({ notifications, handleUpdateStatus }) => {
    return (
        <div className={cx('notificationForm')}>
            {notifications?.length === 0 && (
                <div className={cx('noneNotifications')}>
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTO0ATU2XAWp0IrOGPyhmhamgnvgn8m7B7NA&s" />
                    <p>You do not have any new notifications.</p>
                </div>
            )}
            {notifications?.map((item, index) => {
                return (
                    <div
                        className={cx('notificationItem', { borderBottom: index !== notifications?.length - 1 })}
                        key={item._id}
                    >
                        <div className={cx('notificationTitle')}>
                            {/* <AddGroupIcon className={cx('icon-invite')} /> */}
                            <img src={item.inviter.avatar} className={cx('avatar')} />
                            <p>
                                <strong>{item.inviter.displayName}</strong> had invited you to join the board{' '}
                                <strong>{item.board?.title}</strong>
                            </p>
                        </div>
                        {item.boardInvitations.status === STATUS.PENDING && (
                            <div className={cx('buttons')}>
                                <Button
                                    className={cx('button-accept')}
                                    onClick={() => handleUpdateStatus(item._id, STATUS.SUCCESS)}
                                >
                                    Accept
                                </Button>
                                <Button
                                    className={cx('button-reject')}
                                    onClick={() => handleUpdateStatus(item._id, STATUS.REJECT)}
                                >
                                    Reject
                                </Button>
                            </div>
                        )}

                        {item.boardInvitations.status !== STATUS.PENDING && (
                            <div className={cx('buttons2')}>
                                {item.boardInvitations.status === STATUS.SUCCESS && (
                                    <Button
                                        leftIcon={<TickIcon className={cx('icon-Button')} />}
                                        className={cx('button-accept2')}
                                    >
                                        Accepted
                                    </Button>
                                )}
                                {item.boardInvitations.status === STATUS.REJECT && (
                                    <Button
                                        leftIcon={<RejectIcon className={cx('icon-Button')} />}
                                        className={cx('button-reject2')}
                                    >
                                        Rejected
                                    </Button>
                                )}
                            </div>
                        )}

                        <p>{moment(item.createdAt).format('llll')}</p>
                    </div>
                );
            })}
        </div>
    );
};
function Notification() {
    const dispatch = useDispatch();
    const invitations = useSelector(selectCurrentNotifications);
    const navigate = useNavigate();

    // console.log("render");
    const [hideMenu, setHideMenu] = useState(false);

    // xử lí hiển thị chuông real-time
    const [newNotification, setNewNotification] = useState(false);
    // console.log(hideMenu);
    // const handelHideMenu = () => {
    //     setHideMenu(true);
    // };
    const handleClickMenu = (isOpen) => {
        if (isOpen) {
            // Khi dropdown mở → gọi API
        }
        setNewNotification(false);
    };
    useEffect(() => {
        // gọi API lấy all notifications của User
        dispatch(fetchNotificationsAPIRedux());
        // lấy data từ socket server
        socketStompClient.onConnect = () => {
            socketStompClient.subscribe('/user/queue/invitation', (message) => {
                console.log('Body:', JSON.parse(message.body));
                if (message) {
                    const notification = JSON.parse(message.body);
                    notification._id = notification?.invitationId;
                    delete notification.invitationId;
                    dispatch(addNewNotification(notification));
                    setNewNotification(true);
                }
            });
        };
        socketStompClient.activate();
        if (hideMenu) {
            // reset lại sau khi ép ẩn
            setHideMenu(false);
            if (newNotification) {
                setNewNotification(false);
            }
        }
        return () => socketStompClient.deactivate();
    }, [hideMenu, dispatch]);

    const handleUpdateStatus = (invitationId, status) => {
        dispatch(updateNotificationIsInvitationAPIRedux({ invitationId: invitationId, status: status })).then((res) => {
            if (!res.error && res.payload.result.boardInvitations.status === STATUS.SUCCESS) {
                navigate(`/boards/${res.payload.result.boardInvitations.boardId}`);
                toast.success(`Bạn đã tham gia vào board ${res.payload.result.board.title} thành công!`);
            }
        });
        setNewNotification(false);
    };
    return (
        <div className={cx('wrapper')}>
            <ButtonDropDownMenu
                buttonClassName={cx('button', { notification: newNotification })}
                leftIcon={<NotificationIcon className={cx('faBell-icon')} />}
                calcPosition
                magin={125}
                translateY={40}
                className={cx('button_menu')}
                hideFromParent={hideMenu}
                onClickMenu={handleClickMenu} // 👈 thêm dòng này
                dropDownChildrenCustom={
                    <NotificationForm notifications={invitations} handleUpdateStatus={handleUpdateStatus} />
                }
            ></ButtonDropDownMenu>
        </div>
    );
}

export default Notification;
