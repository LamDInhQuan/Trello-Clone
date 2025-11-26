import classNames from 'classnames/bind';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import styles from './AccountVerification.module.scss';
import Loading from '~/components/Loading';
import { verifyUserAPI } from '~/apis';
import { toast } from 'react-toastify';
import Button from '~/components/Button';

const cx = classNames.bind(styles);
function AccountVerification() {
    // lấy giá trị email và token từ Url
    let [searchParams] = useSearchParams();
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    // Tạo một biến state để biết đã verify tài khoản thành công hay chưa
    const [verified, setVerified] = useState(false);

    // Gọi Api để verify tài khoản
    const verifyAccount = () => {
        if (email && token) {
            verifyUserAPI({ email, token })
                .then(() => {
                    toast.success('Xác thực tài khoản thành công !');
                    setVerified(true);
                })
                .catch(() => {
                    return;
                });
        }
    };
    // Nếu Url có vấn đề , không tồn tại 1 trong 2 giá trị email hoặc token thì đá ra trang 404

    // Nếu chưa verify xong thì hiện loading
    if (!verified) {
        return (
            <div className={cx('wrapper')}>
                <div className={cx('verify-card')}>
                    <div className={cx('app-logo')}>📝</div>
                    <h2>Xác thực tài khoản</h2>
                    <p>
                        Hoàn tất bước cuối cùng để truy cập <b>Trello Advance MERN Stack</b>.<br />
                        <div className={cx('email-box')}>
                            <strong> {email}</strong>
                        </div>
                        Nhấn nút bên dưới để xác thực email của bạn.
                    </p>

                    <Button className={cx('verify-btn')} onClick={verifyAccount}>
                        Xác thực ngay
                    </Button>
                </div>
            </div>
        );
    }

    // Cuối cùng nếu không gặp vấn đề gì + verify thành công thì điều hướng về trang Login cùng
    // giá trị verify email
    if (!email || !token) {
        return <Navigate to={'/404'} />;
    }

    return <Navigate to={`/login?verifiedEmail=${email}`} />;
}

export default AccountVerification;
