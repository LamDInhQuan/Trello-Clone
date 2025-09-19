import { configureStore } from '@reduxjs/toolkit';
import { activeBoardReducer } from './activeBoard/activeBoardSlice';

export const store = configureStore({
    reducer: {
      activeBoard : activeBoardReducer
    },
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