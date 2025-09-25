import classNames from 'classnames';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';

import styles from './AccountVerification.module.scss';
import Loading from '~/components/Loading';

const cx = classNames.bind(styles);
function AccountVerification() {
    // lấy giá trị email và token từ Url
    let [searchParams] = useSearchParams();
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    // Tạo một biến state để biết đã verify tài khoản thành công hay chưa
    const [verified, setVerified] = useState(false);

    // Gọi Api để verify tài khoản

    // Nếu Url có vấn đề , không tồn tại 1 trong 2 giá trị email hoặc token thì đá ra trang 404

    // Nếu chưa verify xong thì hiện loading
    if (!verified) {
        return <Loading title={'Verifying your account...'} verified={true} />;
    }
    // Cuối cùng nếu không gặp vấn đề gì + verify thành công thì điều hướng về trang Login cùng
    // giá trị verify email
    if (!email || !token) {
        return <Navigate to={'/404'} />;
    }

    return <Navigate to={`/login?verifiedEmail=${email}`} />;
}

export default AccountVerification;
