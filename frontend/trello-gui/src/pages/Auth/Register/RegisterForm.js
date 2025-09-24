//thuư viện ngoài
import styles from './Register.module.scss';
import stylesInterceptorLoading from '~/components/GlobalAppStyle/interceptorLoading.module.scss';
import classNames from 'classnames/bind';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

// src
import { Icons } from 'react-toastify';
import Button from '~/components/Button';
import FieldErrorAlert from '~/components/FieldErrorAlert';
import LockIcon from '~/components/Icons/LockIcon';
import TrelloIcon from '~/components/Icons/TrelloIcon';
import InputSearch from '~/components/InputSearch';
import {
    EMAIL_RULE,
    EMAIL_RULE_MESSAGE,
    FIELD_REQUIRED_MESSAGE,
    PASSWORD_RULE,
    PASSWORD_RULE_MESSAGE,
} from '~/utils/validators';

const cx = classNames.bind(styles);
const cx2 = classNames.bind(stylesInterceptorLoading);

function RegisterForm() {
    // useForm Nó là một custom hook của thư viện react-hook-form.
    // Nó trả về các phương thức và state giúp bạn dễ dàng đăng ký input, validate dữ liệu,
    // submit form, và reset form.
    // Nhờ useForm, bạn không cần useState cho từng ô input nữa → code ngắn gọn, performance cao.
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm(); // dùng các props của useForm thay cho useState

    const inputEmail = watch('email'); // sẽ update liên tục khi gõ
    const inputPassword = watch('password');
    const inputConfirmPassword = watch('confirmPassword');

    const submitLogin = (data) => {
        console.log('data', data);
    };

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
                    <InputSearch
                        title={'Enter Password Confirmation...'}
                        label_search_className={
                            !!errors['confirmPassword'] ? cx('labelSearchError') : cx('labelSearch')
                        }
                        searchInput_className={errors['confirmPassword'] && cx('searchInputError')}
                        valueInput={inputConfirmPassword}
                        {...register('confirmPassword', {
                            required: FIELD_REQUIRED_MESSAGE,
                            validate: (value) => {
                                if (value === inputPassword) {
                                    return true;
                                } else {
                                    return 'Password Confirmation does not match!';
                                }
                            },
                        })}
                        typeInput="password"
                    />
                    <FieldErrorAlert errors={errors} fieldName="confirmPassword" />

                    <Button className={`${cx('btnLogin')} ${cx2('interceptor-loading')}`}>Register</Button>
                    <p>Already have an account?</p>
                    <Link to="/login" className={cx('register-link')}>
                        Log in?
                    </Link>
                </div>
            </div>
        </form>
    );
}

export default RegisterForm;
