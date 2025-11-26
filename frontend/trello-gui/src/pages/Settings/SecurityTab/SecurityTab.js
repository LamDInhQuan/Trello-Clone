//thuư viện ngoài
import classNames from 'classnames/bind';

// src
import styles from './SecurityTab.module.scss';
import InputSearch from '~/components/InputSearch';
import FieldErrorAlert from '~/components/FieldErrorAlert';
import Button from '~/components/Button';
import {
    EMAIL_RULE,
    EMAIL_RULE_MESSAGE,
    FIELD_REQUIRED_MESSAGE,
    PASSWORD_RULE,
    PASSWORD_RULE_MESSAGE,
} from '~/utils/validators';
import PasswordIcon from '~/components/Icons/PasswordIcon';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import LockIcon from '~/components/Icons/LockIcon';
import LockResetIcon from '~/components/Icons/LockResetIcon';
import { useConfirm } from 'material-ui-confirm';
import LogoutIcon from '~/components/Icons/LogoutIcon';
import { toast } from 'react-toastify';
import { logoutUserAPIRedux, updatePasswordUserAPIRedux } from '~/redux/user/userSlice';

const cx = classNames.bind(styles);

function AccountTab() {
    // useForm Nó là một custom hook của thư viện react-hook-form.
    // Nó trả về các phương thức và state giúp bạn dễ dàng đăng ký input, validate dữ liệu,
    // submit form, và reset form.
    // Nhờ useForm, bạn không cần useState cho từng ô input nữa → code ngắn gọn, performance cao.
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm(); // dùng các props của useForm thay cho useState
    const inputCurrentPassword = watch('currentPassword'); // sẽ update liên tục khi gõ
    const inputNewPassword = watch('newPassword');
    const inputConfirmPassword = watch('newPasswordConfirm');

    const toastUpdatePassword = (data) => {
        const { currentPassword, newPassword } = data;

        toast
            .promise(
                dispatch(
                    updatePasswordUserAPIRedux({ currentPassword: currentPassword, newPassword: newPassword }),
                ).unwrap(),
                {
                    pending: 'Updating...',
                    success: 'Update password successfully! Please login again!',
                },
            )
            .then((res) => {
                // kiểm tra đăng nhập không có lỗi điều hướng về route ("/")
                // console.log(res);
                dispatch(logoutUserAPIRedux(false));
            })
            .catch(() => {});
    };
    const confirmUpdatePassword = useConfirm();
    const submitUpdatePassword = (data) => {
        console.log(data);
        // gọi confirm sau 1 tick để root kịp update

        confirmUpdatePassword({
            title: (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <LogoutIcon className={cx('icon-logout')} />
                    <span>Change Password?</span>
                </div>
            ),
            description: 'You have to login after successfully changing your password. Continue?',
        })
            .then(() => {
                toastUpdatePassword(data);
            })
            .catch(() => {});
    };

    return (
        <form onSubmit={handleSubmit(submitUpdatePassword)}>
            <div className={cx('wrapper')}>
                <div className={cx('account')}>
                    <h1>Security Dashboard</h1>
                    <InputSearch
                        type={'password'}
                        leftIcon={<PasswordIcon className={cx('hide-info-icon')} />}
                        title={'Current Password'}
                        valueInput={inputCurrentPassword}
                        searchInput_className={cx('input-username')}
                        label_search_className={cx('label-input-username')}
                        autoFocus={true}
                        normalInput={true}
                        {...register('currentPassword', {
                            required: FIELD_REQUIRED_MESSAGE,
                            pattern: {
                                value: PASSWORD_RULE,
                                message: PASSWORD_RULE_MESSAGE,
                            },
                        })}
                    />
                    <FieldErrorAlert errors={errors} fieldName={'currentPassword'} />

                    <InputSearch
                        type={'password'}
                        leftIcon={<LockIcon className={cx('hide-info-icon')} />}
                        title={'New Password'}
                        valueInput={inputNewPassword}
                        searchInput_className={cx('input-username')}
                        label_search_className={cx('label-input-username')}
                        normalInput={true}
                        {...register('newPassword', {
                            required: FIELD_REQUIRED_MESSAGE,
                            pattern: {
                                value: PASSWORD_RULE,
                                message: PASSWORD_RULE_MESSAGE,
                            },
                        })}
                    />
                    <FieldErrorAlert errors={errors} fieldName={'newPassword'} />

                    <InputSearch
                        type={'password'}
                        leftIcon={<LockResetIcon className={cx('hide-info-icon')} />}
                        title={'New Password Confirmation'}
                        valueInput={inputConfirmPassword}
                        searchInput_className={cx('input-username')}
                        label_search_className={cx('label-input-username')}
                        normalInput={true}
                        {...register('newPasswordConfirm', {
                            required: FIELD_REQUIRED_MESSAGE,
                            validate: (value) => {
                                if (value === inputNewPassword) {
                                    return true;
                                } else {
                                    return 'Password Confirmation does not match!';
                                }
                            },
                        })}
                    />
                    <FieldErrorAlert errors={errors} fieldName={'newPasswordConfirm'} />
                    <Button className={cx('button-update')}>Change</Button>
                </div>
            </div>
        </form>
    );
}

export default AccountTab;
