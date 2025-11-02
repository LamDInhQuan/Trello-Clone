import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { clear } from '@testing-library/user-event/dist/clear';
import { toast } from 'react-toastify';
import authorizedAxiosInstance from '~/utils/authorizeAxios'; // custom axios
import { API_ROOT } from '~/utils/constants';

// khởi tạo giá tri state của 1 slice trong redux
const initialState = {
    // ✅ phải đúng tên
    currentNotifications: null,
};

// các hành động gọi api ( bất đồng bộ ) và cập nhật dữ liệu vào Redux , dùng Middleware createAsyncThunk
// đi kèm với extraReducers
export const fetchNotificationsAPIRedux = createAsyncThunk('activeNotifications/getNotifications', async () => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/invitation/getNotifications`);
    return response.data;
});

export const updateNotificationIsInvitationAPIRedux = createAsyncThunk(
    'activeNotifications/updateInvitation',
    async (data) => {
        const response = await authorizedAxiosInstance.put(`${API_ROOT}/invitation/updateInvitation`, data);
        return response.data;
    },
);
// khởi tạo một cái slice trong kho lưu trữ - redux store
export const notificationsSlice = createSlice({
    name: 'notifications',
    initialState, // ✅ phải đúng tên
    // Reducers : nơi xử lý dữ liệu đồng bộ
    reducers: {
        clearCurrentNotifications: (state) => {
            state.currentNotifications = null;
        },
        updateCurrentNotifications: (state, action) => {
            const notifications = action.payload;
            state.currentNotifications = notifications;
        },
        addNewNotification: (state, action) => {
            const invitation = action.payload
            console.log(invitation);
            if (invitation) {
                console.log(invitation);
                const notifications = state.currentNotifications;
                notifications.unshift(invitation);
            }
        },
    },
    // ExtraReducers : nơi xử lý dữ liệu bất đồng bộ
    extraReducers: (builder) => {
        builder.addCase(fetchNotificationsAPIRedux.fulfilled, (state, action) => {
            const notifications = action.payload.result;
            state.currentNotifications = notifications.reverse();
        });
        builder.addCase(updateNotificationIsInvitationAPIRedux.fulfilled, (state, action) => {
            const invitation = action.payload.result;
            const notifications = state.currentNotifications;
            const invitationFinded = notifications.find((nof) => nof._id === invitation.invitationId);
            console.log(notifications);
            invitationFinded.boardInvitations.status = invitation.boardInvitations.status;
        });
    },
});

// Actions : là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật
// lại dữ liêu thông qua reducer ( chạy đồng bộ )
// Để ý ở trên thì không thấy properties actions đâu cả  , bởi vì những actions này đơn giản là được redux
// tạo tự động theo tên của reducer nhé
// export const { updateCurrentActiveBoard } = activeBoardSlice.actions;
export const { clearCurrentNotifications, updateCurrentNotifications, addNewNotification } = notificationsSlice.actions;

// Selectors : là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liêu từ trong kho
// redux store ra sử dụng

export const selectCurrentNotifications = (state) => {
    return state.notifications.currentNotifications;
};

// file dưới là activeBoardSlice nhưng chúng ta sẽ export 1 thứ tên là Reducer
// export default .reducer
export const notificationsReducer = notificationsSlice.reducer;
