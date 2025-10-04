//thuư viện ngoài
import styles from './Login.module.scss';
import stylesInterceptorLoading from '~/components/GlobalAppStyle/interceptorLoading.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

// src
import { Icons, toast } from 'react-toastify';
import Button from '~/components/Button';
import LockIcon from '~/components/Icons/LockIcon';
import TrelloIcon from '~/components/Icons/TrelloIcon';
import InputSearch from '~/components/InputSearch';
import {
    EMAIL_RULE,
    PASSWORD_RULE,
    FIELD_REQUIRED_MESSAGE,
    PASSWORD_RULE_MESSAGE,
    EMAIL_RULE_MESSAGE,
} from '~/utils/validators';
import FieldErrorAlert from '~/components/FieldErrorAlert';
import TickOutlineIcon from '~/components/Icons/TickOutlineIcon';
import InfoOutlineIcon from '~/components/Icons/InfoOutlineIcon';
import { useDispatch } from 'react-redux';
import { loginUserAPIRedux } from '~/redux/user/userSlice';

const cx = classNames.bind(styles);
const cx2 = classNames.bind(stylesInterceptorLoading);

function LoginForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm(); // dùng các props của useForm thay cho useState
    const inputEmail = watch('email'); // sẽ update liên tục khi gõ
    const inputPassword = watch('password');

    let [searchParams] = useSearchParams();
    const registerEmail = searchParams.get('registerEmail');
    const verifiedEmail = searchParams.get('verifiedEmail');
    const submitLogin = (data) => {
        console.log('data', data);
        const { email, password } = data;
        toast
            .promise(dispatch(loginUserAPIRedux({ email, password })), { pending: 'Logging in...' })
            .then((res) => {
                // kiểm tra đăng nhập không có lỗi điều hướng về route ("/")
                // console.log(res);
                if (!res.error) {
                    toast.success('Đăng nhập thành công!')
                    navigate('/');
                }
            })
            .catch();
    };

    // useForm Nó là một custom hook của thư viện react-hook-form.
    // Nó trả về các phương thức và state giúp bạn dễ dàng đăng ký input, validate dữ liệu,
    // submit form, và reset form.
    // Nhờ useForm, bạn không cần useState cho từng ô input nữa → code ngắn gọn, performance cao.
    return (
        <form onSubmit={handleSubmit(submitLogin)}>
            <div className={cx('wrapper')}>
                <div className={cx('formLogin')}>
                    <div className={cx('icons')}>
                        <LockIcon className={cx('icon')} />
                        <TrelloIcon className={cx('icon')} />
                    </div>
                    <p>Author: Coladeptrai</p>
                    {verifiedEmail && (
                        <div className={cx('verified-email-notice')}>
                            <TickOutlineIcon className={cx('icon-verified-email')} />
                            <p>
                                Your email <b>{verifiedEmail}</b> has been verified.
                                <br />
                                Now you can login to enjoy our services!
                                <br />
                                Have a good day!
                            </p>
                        </div>
                    )}
                    {registerEmail && (
                        <div className={cx('register-email-notice')}>
                            <InfoOutlineIcon className={cx('icon-register-email')} />
                            <p>
                                An email has been send to <b>{registerEmail}</b>
                                <br />
                                Please check and verify your account before logging in!
                            </p>
                        </div>
                    )}
                    <InputSearch
                        // inputError={!!errors['email']}
                        title={'Enter Email...'}
                        label_search_className={!!errors['email'] ? cx('labelSearchError') : cx('labelSearch')}
                        searchInput_className={errors['email'] && cx('searchInputError')}
                        autoFocus={true}
                        valueInput={inputEmail}
                        {...register('email', {
                            required: FIELD_REQUIRED_MESSAGE,
                            pattern: {
                                value: EMAIL_RULE,
                                message: EMAIL_RULE_MESSAGE,
                            },
                        })}
                    />
                    <FieldErrorAlert errors={errors} fieldName="email" />
                    <InputSearch
                        title={'Enter Password...'}
                        label_search_className={!!errors['password'] ? cx('labelSearchError') : cx('labelSearch')}
                        searchInput_className={errors['password'] && cx('searchInputError')}
                        valueInput={inputPassword}
                        {...register('password', {
                            required: FIELD_REQUIRED_MESSAGE,
                            pattern: {
                                value: PASSWORD_RULE,
                                message: PASSWORD_RULE_MESSAGE,
                            },
                        })}
                        typeInput="password"
                    />
                    <FieldErrorAlert errors={errors} fieldName="password" />
                    <Button className={`${cx('btnLogin')} ${cx2('interceptor-loading')}`}>Login</Button>
                    <p>New to Trello MERN Stack Advanced?</p>
                    <Link to="/register" className={cx('register-link')}>
                        Create account?
                    </Link>
                </div>
            </div>
        </form>
    );
}

export default LoginForm;
