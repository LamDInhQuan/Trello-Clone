import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authorizedAxiosInstance from '~/utils/authorizeAxios'; // custom axios   
import { API_ROOT } from '~/utils/constants';
import { generatePlaceHolderCard } from '~/utils/formatters';
import { mapOrder } from '~/utils/sorts';

// khởi tạo giá tri state của 1 slice trong redux
const initialState = {
    // ✅ phải đúng tên
    currentActiveBoard: null,
};

// các hành động gọi api ( bất đồng bộ ) và cập nhật dữ liệu vào Redux , dùng Middleware createAsyncThunk
// đi kèm với extraReducers
export const fetchBoardDetailAPIRedux = createAsyncThunk('activeBoard/fetchBoardDetailAPI', async (boardId) => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/board/getBoardAndColumnByIdBoard/${boardId}`);
    return response.data;
});

// khởi tạo một cái slice trong kho lưu trữ - redux store
export const activeBoardSlice = createSlice({
    name: 'activeBoard',
    initialState, // ✅ phải đúng tên
    // Reducers : nơi xử lý dữ liệu đồng bộ
    reducers: {
        // lưu ý ở đây là luôn luôn cần 1 cặp ngoặc nhọn cho function trong reducer cho dù code bên trong chỉ
        // có 1 dòng , vì đây là rule của Redux
        updateCurrentActiveBoard: (state, action) => {
            // action.payload là chuẩn đặt tên nhận dữ liệu vào reducer , ở đây chúng ta gắn cho nó ra một biến
            // có nghĩa hơn
            const board = action.payload;
            // xử lý dữ liệu nếu cần thiết ....
            // ...

            // update lại dữ liệu của currentActiveBoard
            state.currentActiveBoard = board;
        },
    },
    // ExtraReducers : nơi xử lý dữ liệu bất đồng bộ
    extraReducers: (builder) => {
        builder.addCase(fetchBoardDetailAPIRedux.fulfilled, (state, action) => {
            // action.payload ở đây chính là response.data trả về ở trên
            let board = action.payload.result;
            // xử lý dữ liệu nếu cần thiết ....
            // sắp xếp luôn các columns trước khi đưa xuống các component con
            board.columns = mapOrder(board.columns, board.columnOrderIds, '_id');

            // thêm thẻ ảo cho column mới tạo
            const newColumns = board.columns.map((col) => {
                if (!col.cards || col.cards.length === 0) {
                    const placeholder = generatePlaceHolderCard(col);
                    return {
                        ...col,
                        cards: [placeholder],
                        cardOrderIds: [placeholder._id],
                    };
                } else {
                    // sắp xếp luôn các cards trước khi đưa xuống các component con
                    col.cards = mapOrder(col.cards, col.cardOrderIds, '_id');
                }
                return col; // giữ nguyên nếu đã có cards
            });
            const newBoard = {
                ...board,
                columns: newColumns,
            };
            // update lại dữ liệu của currentActiveBoard
            state.currentActiveBoard = newBoard;
        });
    },
});

// Actions : là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật
// lại dữ liêu thông qua reducer ( chạy đồng bộ )
// Để ý ở trên thì không thấy properties actions đâu cả  , bởi vì những actions này đơn giản là được redux
// tạo tự động theo tên của reducer nhé
export const { updateCurrentActiveBoard } = activeBoardSlice.actions;

// Selectors : là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liêu từ trong kho
// redux store ra sử dụng
export const selectCurrentActiveBoard = (state) => {
    return state.activeBoard.currentActiveBoard;
};

// file dưới là activeBoardSlice nhưng chúng ta sẽ export 1 thứ tên là Reducer
// export default activeBoardSlice.reducer
export const activeBoardReducer = activeBoardSlice.reducer;
