import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { clear } from '@testing-library/user-event/dist/clear';
import { toast } from 'react-toastify';
import authorizedAxiosInstance from '~/utils/authorizeAxios'; // custom axios
import { API_ROOT } from '~/utils/constants';

// khởi tạo giá tri state của 1 slice trong redux
const initialState = {
    // ✅ phải đúng tên
    currentActiveCard: null,
};

// các hành động gọi api ( bất đồng bộ ) và cập nhật dữ liệu vào Redux , dùng Middleware createAsyncThunk
// đi kèm với extraReducers

// khởi tạo một cái slice trong kho lưu trữ - redux store
export const activeCardSlice = createSlice({
    name: 'activeCard',
    initialState, // ✅ phải đúng tên
    // Reducers : nơi xử lý dữ liệu đồng bộ
    reducers: {
        clearCurrentActiveCard: (state) => {
            state.currentActiveCard = null;
        },
        updateCurrentActiveCard: (state, action) => {
            const fullCard = action.payload;
            state.currentActiveCard = fullCard;
        },
    },
    // ExtraReducers : nơi xử lý dữ liệu bất đồng bộ
    extraReducers: (builder) => {},
});

// Actions : là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật
// lại dữ liêu thông qua reducer ( chạy đồng bộ )
// Để ý ở trên thì không thấy properties actions đâu cả  , bởi vì những actions này đơn giản là được redux
// tạo tự động theo tên của reducer nhé
// export const { updateCurrentActiveBoard } = activeBoardSlice.actions;
export const { clearCurrentActiveCard, updateCurrentActiveCard } = activeCardSlice.actions;

// Selectors : là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liêu từ trong kho
// redux store ra sử dụng

export const selectCurrentActiveCard = (state) => {
    return state.activeCard.currentActiveCard;
};

// file dưới là activeBoardSlice nhưng chúng ta sẽ export 1 thứ tên là Reducer
// export default .reducer
export const activeCardReducer = activeCardSlice.reducer;
