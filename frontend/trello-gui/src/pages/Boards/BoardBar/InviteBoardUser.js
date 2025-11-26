//thuư viện ngoài
import classNames from 'classnames/bind';

// src
import styles from './InviteBoardUser.module.scss';
import Button from '~/components/Button';
import AddGroupIcon from '~/components/Icons/AddGroupIcon';
import ButtonDropDownMenu from '~/components/ButtonDropDownMenu/ButtonDropDownMenu';
import { useEffect, useState } from 'react';
import { Icons, toast } from 'react-toastify';
import InputSearch from '~/components/InputSearch';
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, FIELD_REQUIRED_MESSAGE } from '~/utils/validators';
import FieldErrorAlert from '~/components/FieldErrorAlert';
import { useForm } from 'react-hook-form';
import { addNewInvitationAPI } from '~/apis';
import { socketIoInstance } from '~/index';
import { socketStompClient } from '~/utils/socketSTOMPClient';

const cx = classNames.bind(styles);

const InviteForm = ({ boardId, handelHideMenu }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        reset,
    } = useForm(); // dùng các props của useForm thay cho useState
    const email = watch('email'); // sẽ update liên tục khi gõ
    const submitInviteUser = (data) => {
        console.log({ boardId: boardId, inviteeEmail: data.email });
        handelHideMenu();
        // gọi API thêm lời mời
        toast.promise(
            addNewInvitationAPI({ boardId: boardId, inviteeEmail: data.email })
                .then((res) => {
                    if (!res.error) {
                        toast.success(`Gửi lời mời vào board cho User ${data.email} thành công!`);
                        reset(); // ✅ reset toàn bộ input về rỗng
                    }
                    // mời người dùng thành công thì gửi sự kiện socket lên server ( tính năng real-time )
                    if (socketStompClient.connected) {
                        socketStompClient.publish({
                            destination: '/app/notifications', // trỏ đến @MessageMapping trong Spring Boot'
                            body: JSON.stringify(res.result),
                        });
                        // console.log(res.result);
                    } else {
                        console.warn('⚠️ STOMP chưa kết nối');
                    }
                })
                .catch(() => {}),
            {
                pending: 'Sending',
            },
        );
    };
    return (
        <form onSubmit={handleSubmit(submitInviteUser)}>
            <div className={cx('inviteForm')}>
                <p>Invite User To This Board!</p>
                <InputSearch
                    title={'Enter email to invite...'}
                    valueInput={email}
                    searchInput_className={cx('input-username')}
                    label_search_className={cx('label-input-username')}
                    autoFocus={true}
                    {...register('email', {
                        required: FIELD_REQUIRED_MESSAGE,
                        pattern: {
                            value: EMAIL_RULE,
                            message: EMAIL_RULE_MESSAGE,
                        },
                    })}
                    hasValue={true}
                    noValueInPlaceHolder={true}
                />
                <FieldErrorAlert
                    errors={errors}
                    fieldName={'email'}
                    className={cx('fieldErrorAlert')}
                    messageClassName={cx('messageFieldErrorAlert')}
                    iconClassName={cx('iconFieldErrorAlert')}
                />
                <Button className={cx('button-update')}>Invite</Button>
            </div>
        </form>
    );
};
function InviteBoardUser({ boardId }) {
    // console.log("render");
    const [hideMenu, setHideMenu] = useState(false);
    // console.log(hideMenu);
    const handelHideMenu = () => {
        setHideMenu(true);
    };
    useEffect(() => {
        if (hideMenu) {
            // reset lại sau khi ép ẩn
            setHideMenu(false);
        }
    }, [hideMenu]);
    return (
        <>
            <div className={cx('wrapper')}>
                <ButtonDropDownMenu
                    buttonClassName={cx('button')}
                    leftIcon={<AddGroupIcon className={cx('icon-invite')} />}
                    translateY={40}
                    className={cx('button_menu')}
                    dropDownChildrenCustom={<InviteForm boardId={boardId} handelHideMenu={handelHideMenu} />}
                    hideFromParent={hideMenu}
                    menuDropDownCustomClassname={cx('menuDropDownCustomClassname')}
                >
                    Invite
                </ButtonDropDownMenu>
            </div>
        </>
    );
}

export default InviteBoardUser;
