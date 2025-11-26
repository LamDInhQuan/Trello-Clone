import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

import logo from './logo.svg';
import Boards from '~/pages/Boards';
import NotFound from './pages/404';
import Auth from './pages/Auth';
import AccountVerification from './pages/Auth/AccountVerification';
import { selectCurrentUser } from '~/redux/user/userSlice';
import Settings from './pages/Settings';
import Board from './pages/Boards/_id';
import { useEffect } from 'react';

// Giải pháp clean code trong việc xác định route nào cần được truy cập khi đã đăng nhập tài khoản
// thành công - Sử dụng <Outlet /> để hiển thị các child route
const ProtectedRoute = ({ user }) => {
    if (!user) return <Navigate to={'/login'} replace={true} />;
    return <Outlet />;
};

function App() {
    // Khi component mount → effect chạy lần đầu → cleanup chưa chạy.
    // Khi dependency thay đổi → effect chạy lại: React trước hết chạy cleanup cũ, sau đó chạy effect mới.
    // Khi component unmount → effect không chạy nữa: React chạy cleanup 1 lần cuối.
    useEffect(() => {
        const handleF5 = () => {
            // performance.getEntriesByType('navigation') sẽ trả về mảng các “navigation entries”,
            // tức các bản ghi về cách trang web được load hoặc chuyển hướng.
            const navigationEntries = performance.getEntriesByType('navigation');
            if (navigationEntries[0]?.type === 'reload') {
                console.log('F5 detected!');
                localStorage.removeItem('allBoardAndColor');
            }
        };

        window.addEventListener('load', handleF5);

        return () => {
            window.removeEventListener('load', handleF5);
        };
    }, []);
    const currentUser = useSelector(selectCurrentUser);
    return (
        <Routes>
            {/* Redirect Route */}

            <Route
                path="/"
                element={
                    // Ở đây cần replace giá trị true để nó thay thế route / , có thể hiểu là route / sẽ
                    // không còn nằm trong history của Browser
                    // Thực hành dễ hiểu hơn bằng cách nhấn Go home từ trang 404 xong thử quay lại bằng nút
                    // back của trình duyệt giữa 2 trường hợp có replace hoặc không có
                    <Navigate to="/boards" replace={true} />
                }
            />
            {/* ProtectedRoute hiểu đơn giản là trong dự án của chúng ta sẽ có những route chỉ 
             được truy cập khi user đã login  */}
            <Route element={<ProtectedRoute user={currentUser} />}>
                {/* <Outlet /> của React-router-dom sẽ chạy vào các child route trong này */}
                {/* Board Details  */}
                <Route path="/boards" element={<Boards />} />
                <Route path="/boards/:boardId" element={<Board />} />
                {/* User Settings   */}
                <Route path="/settings/account" element={<Settings />}></Route>
                <Route path="/settings/security" element={<Settings />}></Route>
            </Route>
            {/* Authentication  */}
            <Route path="/login" element={<Auth />} />
            <Route path="/register" element={<Auth />} />
            <Route path="/auth/verify" element={<AccountVerification />} />
            {/* 404 not found page */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default App;
