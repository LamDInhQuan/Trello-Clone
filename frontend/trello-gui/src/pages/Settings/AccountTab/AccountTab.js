//thuư viện ngoài
import classNames from 'classnames/bind';

// src
import styles from './AccountTab.module.scss';
import Button from '~/components/Button';
import CloseIcon from '~/components/Icons/CloseIcon';
import CloudIcon from '~/components/Icons/CloudIcon';
import InputSearch from '~/components/InputSearch';
import images from '~/assets/images';
import UserIcon from '~/components/Icons/UserIcon';
import CloudUploadIcon from '~/components/Icons/CloudUploadIcon';
import ContactUserIcon from '~/components/Icons/ContactUserIcon';
import ContactUserIcon2 from '~/components/Icons/ContactUserIcon2';
import MailIcon from '~/components/Icons/MailIcon';
import { useForm } from 'react-hook-form';
import { FIELD_REQUIRED_MESSAGE } from '~/utils/validators';
import { selectCurrentUser, updateInfoUserAPIRedux } from '~/redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import FieldErrorAlert from '~/components/FieldErrorAlert';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

function AccountTab() {
    // useForm Nó là một custom hook của thư viện react-hook-form.
    // Nó trả về các phương thức và state giúp bạn dễ dàng đăng ký input, validate dữ liệu,
    // submit form, và reset form.
    // Nhờ useForm, bạn không cần useState cho từng ô input nữa → code ngắn gọn, performance cao.
    const dispatch = useDispatch();
    const user = useSelector(selectCurrentUser);
    console.log(user);
    const initialGeneralForm = {
        displayName: user?.displayName || user?.user?.displayName,
        username: user?.username || user?.user?.username,
        email: user?.email || user?.user?.email,
    };
    // console.log(initialGeneralForm);
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm({
        defaultValues: initialGeneralForm,
    }); // dùng các props của useForm thay cho useState
    const displayName = watch('displayName'); // sẽ update liên tục khi gõ
    const submitUpdateUsername = (data) => {
        const { displayName } = data;
        const trimmedName = displayName.trim(); // ✅ Cắt khoảng trắng đầu/cuối
        // console.log(trimmedName);

        if (trimmedName !== '' && trimmedName !== initialGeneralForm.displayName) {
            toast
                .promise(dispatch(updateInfoUserAPIRedux({ displayName: trimmedName })), {
                    pending: 'Updating...',
                    success: 'Update user successfully',
                })
                .then((res) => {
                    // kiểm tra đăng nhập không có lỗi điều hướng về route ("/")
                    // console.log(res);
                })
                .catch();
        }
    };
    return (
        <form onSubmit={handleSubmit(submitUpdateUsername)}>
            <div className={cx('wrapper')}>
                <div className={cx('account')}>
                    <div className={cx('set-avatar')}>
                        <div className={cx('avatar-user')}>
                            <span>
                                <UserIcon className={cx('user-icon')} />
                            </span>
                            <div className={cx('user-name')}>
                                <p>{initialGeneralForm.displayName}</p>
                                <p>@{initialGeneralForm.username}</p>
                            </div>
                        </div>
                        <Button
                            inputFile={true}
                            leftIcon={<CloudUploadIcon className={cx('icon-upload')} />}
                            className={cx('button-upload')}
                        >
                            Upload
                        </Button>
                    </div>
                    <div className={cx('hide-info')}>
                        <p>Your Email</p>
                        <div className={cx('hide-info-content')}>
                            <MailIcon className={cx('hide-info-icon')} />
                            <p>{initialGeneralForm.email}</p>
                        </div>
                    </div>
                    <div className={cx('hide-info')}>
                        <p>Your Username</p>
                        <div className={cx('hide-info-content')}>
                            <ContactUserIcon2 className={cx('hide-info-icon')} />
                            <p>{initialGeneralForm.username}</p>
                        </div>
                    </div>

                    <InputSearch
                        leftIcon={<ContactUserIcon className={cx('hide-info-icon')} />}
                        title={'Your Display Name'}
                        valueInput={displayName}
                        searchInput_className={cx('input-username')}
                        label_search_className={cx('label-input-username')}
                        autoFocus={true}
                        {...register('displayName', {
                            required: FIELD_REQUIRED_MESSAGE,
                        })}
                    />
                    <FieldErrorAlert errors={errors} fieldName={'displayName'} />

                    <Button className={cx('button-update')}>Update</Button>
                </div>
            </div>
        </form>
    );
}

export default AccountTab;
