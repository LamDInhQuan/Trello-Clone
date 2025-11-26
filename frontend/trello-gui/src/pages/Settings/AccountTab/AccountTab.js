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
import { FIELD_REQUIRED_MESSAGE, singleFileValidator } from '~/utils/validators';
import { selectCurrentUser, updateInfoUserAPIRedux, uploadAvatarUserAPIRedux } from '~/redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import FieldErrorAlert from '~/components/FieldErrorAlert';
import { toast } from 'react-toastify';
import { faL } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function AccountTab() {
    // useForm Nó là một custom hook của thư viện react-hook-form.
    // Nó trả về các phương thức và state giúp bạn dễ dàng đăng ký input, validate dữ liệu,
    // submit form, và reset form.
    // Nhờ useForm, bạn không cần useState cho từng ô input nữa → code ngắn gọn, performance cao.
    const dispatch = useDispatch();
    const user = useSelector(selectCurrentUser);
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
                })
                .then((res) => {
                    // kiểm tra đăng nhập không có lỗi điều hướng về route ("/")
                    // console.log(res);
                    if (!res.error) {
                        toast.success('Update user successfully');
                    }
                })
                .catch();
        }
    };
    const uploadAvatar = (e) => {
        console.log(e.target.files[0]);
        const error = singleFileValidator(e.target.files[0]);
        if (error) {
            toast.error(error);
            return;
        }
        // sử dụng FormData để xử lý dữ liệu liên quan tới file khi gọi API
        // FormData là đối tượng có sẵn trong JavaScript (built-in API của trình duyệt), dùng để
        //  tạo ra một “form ảo” chứa các cặp key–value tương tự như form HTML gửi lên server.
        let reqData = new FormData();
        reqData.append('avatar', e.target.files[0]);
        // Cách để log được dữ liệu thông qua FormData
        console.log('reqData', reqData); // ko log dc luôn
        for (const value of reqData.values()) {
            console.log('reqData Value ', value);
        }

        // gọi API
        toast
            .promise(
                dispatch(uploadAvatarUserAPIRedux(reqData)).finally(() => {
                    console.log('delete file avatar');
                    // console.log(e.target.value);
                    e.target.value = ''
                }),
                {
                    pending: 'Updating...',
                },
            )
            .then((res) => {
                // kiểm tra đăng nhập không có lỗi điều hướng về route ("/")
                // console.log(res);

                // Lưu ý dù có lỗi hoặc thành công thì cũng phải clear giá trị của file input , nếu không
                // thì sẽ không thể chọn cùng một file liên tiếp được
                if (!res.error) {
                    toast.success('Update user successfully');
                }
                e.target.value = '';
            })
            .catch();
    };
    return (
        <form onSubmit={handleSubmit(submitUpdateUsername)}>
            <div className={cx('wrapper')}>
                <div className={cx('account')}>
                    <div className={cx('set-avatar')}>
                        <div className={cx('avatar-user')}>
                            {user?.avatar || user?.user?.avatar ? (
                                <img src={user?.avatar || user?.user?.avatar} className={cx('user-icon2')} />
                            ) : (
                                <span>
                                    <UserIcon className={cx('user-icon')} />
                                </span>
                            )}
                            <div className={cx('user-name')}>
                                <p>{initialGeneralForm.displayName}</p>
                                <p>@{initialGeneralForm.username}</p>
                            </div>
                        </div>
                        <Button
                            inputFile={true}
                            leftIcon={<CloudUploadIcon className={cx('icon-upload')} />}
                            className={cx('button-upload')}
                            onChangeFile={uploadAvatar}
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
                        leftIcon={<ContactUserIcon className={cx('hide-info-icon','iconInput')} />}
                        title={'Your Display Name'}
                        valueInput={displayName}
                        searchInput_className={cx('input-username')}
                        label_search_className={cx('label-input-username')}
                        autoFocus={true}
                        normalInput={true}
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
