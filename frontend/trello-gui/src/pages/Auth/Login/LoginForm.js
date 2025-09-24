//thuư viện ngoài
import styles from './Login.module.scss';
import stylesInterceptorLoading from '~/components/GlobalAppStyle/interceptorLoading.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

// src
import { Icons } from 'react-toastify';
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

const cx = classNames.bind(styles);
const cx2 = classNames.bind(stylesInterceptorLoading);

function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm(); // dùng các props của useForm thay cho useState
    const inputEmail = watch('email'); // sẽ update liên tục khi gõ
    const inputPassword = watch('password');

    const submitLogin = (data) => {
        console.log('data', data);
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
                    <InputSearch
                        inputError={!!errors['email']}
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
