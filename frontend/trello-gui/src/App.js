import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

import logo from './logo.svg';
import Board from '~/pages/Boards';
import NotFound from './pages/404';
import Auth from './pages/Auth';
import AccountVerification from './pages/Auth/AccountVerification';
import { selectCurrentUser } from '~/redux/user/userSlice';

// Giải pháp clean code trong việc xác định route nào cần được truy cập khi đã đăng nhập tài khoản 
// thành công - Sử dụng <Outlet /> để hiển thị các child route 
const ProtectedRoute = ({ user }) => {
    if (!user) return <Navigate to={'/login'} replace={true} />;
    return <Outlet />;
};

function App() {
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
                    <Navigate to="/boards/68af4b814b6913bb70d835bb" replace={true} />
                }
            />
             {/* ProtectedRoute hiểu đơn giản là trong dự án của chúng ta sẽ có những route chỉ 
             được truy cập khi user đã login  */}
            <Route element={<ProtectedRoute user={currentUser}/>}>
            {/* <Outlet /> của React-router-dom sẽ chạy vào các child route trong này */}
                {/* Board Details  */}
                <Route path="/boards/:boardId" element={<Board />} />
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
