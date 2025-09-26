import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authorizedAxiosInstance from '~/utils/authorizeAxios'; // custom axios
import { API_ROOT } from '~/utils/constants';
import { generatePlaceHolderCard } from '~/utils/formatters';
import { mapOrder } from '~/utils/sorts';

// khởi tạo giá tri state của 1 slice trong redux
const initialState = {
    // ✅ phải đúng tên
    currentUser: null,
};

// các hành động gọi api ( bất đồng bộ ) và cập nhật dữ liệu vào Redux , dùng Middleware createAsyncThunk
// đi kèm với extraReducers
export const loginUserAPIRedux = createAsyncThunk('user/loginUserAPI', async (data) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/user/login`, data);
    return response.data;
});

// khởi tạo một cái slice trong kho lưu trữ - redux store
export const userSlice = createSlice({
    name: 'user',
    initialState, // ✅ phải đúng tên
    // Reducers : nơi xử lý dữ liệu đồng bộ
    reducers: {},
    // ExtraReducers : nơi xử lý dữ liệu bất đồng bộ
    extraReducers: (builder) => {
        builder.addCase(loginUserAPIRedux.fulfilled, (state, action) => {
            // action.payload ở đây chính là response.data trả về ở trên
            const user = action.payload.result;
            // xử lý dữ liệu nếu cần thiết ....
            // update lại dữ liệu của currentActiveBoard
            state.currentUser = user;
        });
    },
});

// Actions : là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật
// lại dữ liêu thông qua reducer ( chạy đồng bộ )
// Để ý ở trên thì không thấy properties actions đâu cả  , bởi vì những actions này đơn giản là được redux
// tạo tự động theo tên của reducer nhé
// export const { updateCurrentActiveBoard } = activeBoardSlice.actions;

// Selectors : là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liêu từ trong kho
// redux store ra sử dụng
export const selectCurrentUser = (state) => {
    return state.user.currentUser;
};

// file dưới là activeBoardSlice nhưng chúng ta sẽ export 1 thứ tên là Reducer
// export default activeBoardSlice.reducer
export const userReducer = userSlice.reducer;
