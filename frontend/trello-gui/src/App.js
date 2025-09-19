import { Routes, Route, Navigate } from 'react-router-dom';

import logo from './logo.svg';
import Board from '~/pages/Boards';
import NotFound from './pages/404';
import Auth from './pages/Auth';

function App() {
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
            {/* Board Details  */}
            <Route path="/boards/:boardId" element={<Board />} />
            {/* Authentication  */}
            <Route path='/login'element={<Auth/>}/>
             <Route path='/register'element={<Auth/>}/>
            {/* 404 not found page */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default App;
