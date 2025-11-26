import { configureStore } from '@reduxjs/toolkit';
import { activeBoardReducer } from './activeBoard/activeBoardSlice';
import { userReducer } from './user/userSlice';

// Redux Persist là một thư viện mở rộng của Redux dùng để tự động lưu trữ trạng thái của store vào
// bộ nhớ trình duyệt (localStorage, sessionStorage hoặc AsyncStorage trên React Native) và tự động
// khôi phục khi reload trang.
// Mục đích chính:
// - Giữ lại dữ liệu người dùng giữa các lần F5 trang web (ví dụ: user login, theme, cart…).
// - Giảm việc phải fetch lại dữ liệu từ server khi reload.

// cấu hình redux persist
import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // default là localstorage
import { activeCardReducer } from './activeCard/activeCardSlice';
import { notificationsReducer } from './notifications/notificationsSlice';

// Cấu hình persist
const rootPersistConfig = {
    key: 'root', // key của cái persist do ta chỉ định , cứ để mặc định là root
    storage: storage, // Biến storage ở trên - lưu vào localstorage
    whitelist: ['user'], // định nghĩa các slice được phép duy trì qua mỗi lần f5 trình duyệt
    // blackist : ['user'] // định nghĩa các slice ko được phép duy trì qua mỗi lần f5 trình duyệt
};

// Combine các reducers trong dự án của chúng ta ở đây
// Hàm Redux bình thường để gộp nhiều slice reducer thành 1 reducer tổng.
const reducers = combineReducers({
    activeBoard: activeBoardReducer,
    user: userReducer,
    activeCard: activeCardReducer,
    notifications: notificationsReducer,
});

// Thực hiện persist Reducer
// Mục đích: Biến một reducer thông thường thành reducer “có khả năng persist”.
// Tham số:
//  - config → cấu hình persist (ví dụ: lưu ở đâu, slice nào được lưu, slice nào bị bỏ qua…)
//  - reducer → reducer gốc của bạn.
//  - Trả về: Một reducer mới “đã được persist” để đưa vào configureStore.
const persistedReducers = persistReducer(rootPersistConfig, reducers);

export const store = configureStore({
    reducer: persistedReducers,
    // fix warning error khi implement redux-persist
    middleware: (getDefaltMiddleware) => getDefaltMiddleware({ serializableCheck: false }),
});

// 🧩 Tóm tắt Redux
// 1. Reducer
//    - Là hàm thuần khiết (state, action) => newState.
//    - Chỉ được dùng state hiện tại và action truyền vào.
//    - Không được: gọi API, setTimeout, dùng biến bên ngoài.
//    - Kết quả luôn có thể đoán được → dễ debug, dễ test.
//    - 👉 Reducer giống như “ông kế toán”: chỉ ghi chép dựa trên chứng từ đưa vào.

// 2. Dispatch
//    - Hàm để gửi action vào Redux store.
//    - dispatch({ type, payload }) → action đi qua middleware → reducer.
//    - Dispatch chỉ là “ống dẫn”, bản thân nó không thay đổi state.
//    - 👉 Giống như “hành động nộp chứng từ” cho kế toán.

// 3. Middleware
//    - Lớp trung gian giữa dispatch và reducer.
//    - Có thể: log action, sửa action, chặn action, chạy bất đồng bộ.
//    - Dùng để biến bất đồng bộ thành đồng bộ trước khi đến reducer.
//    - 👉 Giống như “thư ký” kiểm tra giấy tờ, gọi điện hỏi thêm thông tin, rồi mới đưa cho kế toán.

// 4. Xử lý bất đồng bộ
//    - Reducer không xử lý async → mọi async phải qua middleware.
//    - Cách phổ biến:
//      + redux-thunk: cho phép dispatch function → chờ API rồi dispatch action sync.
//      + createAsyncThunk (Redux Toolkit): tiện hơn, tự sinh pending/fulfilled/rejected.
//      + redux-saga: dùng generator, mạnh khi flow phức tạp (cancel, retry, chain API).
//      + redux-observable: dùng RxJS cho stream dữ liệu.
//    - 👉 Mấu chốt: async được middleware “bẻ gãy” thành nhiều action sync (loading, success, error).

// 5. Nguyên tắc vàng
//    - Reducer: thuần khiết, sync, predictable.
//    - Dispatch: gửi action (object) để thay đổi state.
//    - Middleware: xử lý logic bên ngoài (async, log, validate, …).
//    - State Redux: trung tâm, mọi component đều có thể lấy qua useSelector.
