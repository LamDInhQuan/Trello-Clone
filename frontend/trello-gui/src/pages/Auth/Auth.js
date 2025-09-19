//thuư viện ngoài
// import styles from './MenuDropDownCustomItem.module.scss';
import classNames from 'classnames/bind';
import LoginForm from './Login';
import { useLocation } from 'react-router-dom';
import RegisterForm from './Register';

// src

// const cx = classNames.bind(styles);

function Auth() {
    // Đây là hook của React Router (v6).
    // Nó trả về một object location mô tả thông tin hiện tại của URL.
    // Thông tin này bao gồm:
    // pathname: đường dẫn (ví dụ /board/123)
    // search: query string (ví dụ ?sort=desc&page=2)
    // hash: đoạn hash trong URL (ví dụ #section1)
    // state: dữ liệu bạn truyền khi điều hướng bằng navigate hoặc Link
    const location = useLocation();
    console.log(location);
    const isLogin = location.pathname === '/login';
    const isRegister = location.pathname === '/register';
    return (
        <div>
            {isLogin && <LoginForm />}
            {isRegister && <RegisterForm />}
        </div>
    );
}

export default Auth;
