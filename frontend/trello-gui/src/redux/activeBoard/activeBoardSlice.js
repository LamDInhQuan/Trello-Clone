import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';
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
        updateCardInBoard: (state, action) => {
            // current() chỉ dùng để xem state thực — chứ không nên dùng để sửa state, vì object
            // trả ra bởi current() là bản copy tĩnh, không còn liên kết với Redux state nữa.
            const currentCard = action.payload;
            // console.log('currentCard:', currentCard); // xem trạng thái state
            // console.log('current(state.currentActiveBoard):', current(state.currentActiveBoard)); // xem trạng thái state
            const currentBoard = state.currentActiveBoard;
            const column = currentBoard.columns.find((col) => col._id === currentCard.columnId);
            if (column) {
                // console.log('column:', current(column));
                const cardFinded = column.cards.find(
                    (card) => card._id === currentCard._id || card._id === currentCard.cardId,
                );
                if (cardFinded) {
                    // console.log('cardFinded:', currentCard); // xem trạng thái state

                    cardFinded.title = currentCard.title;
                    cardFinded.description = currentCard.description;
                    cardFinded.cardCover = currentCard?.cardCover;
                }
            }
        },
    },
    // ExtraReducers : nơi xử lý dữ liệu bất đồng bộ
    extraReducers: (builder) => {
        builder.addCase(fetchBoardDetailAPIRedux.fulfilled, (state, action) => {
            // action.payload ở đây chính là response.data trả về ở trên
            let board = action.payload.result;
            board.FeUsersFromBoard = board.owners.concat(board.members)
            // console.log(board);
            // xử lý dữ liệu nếu cần thiết ....
            // sắp xếp luôn các columns trước khi đưa xuống các component con
            if (board) {
                board.columns = mapOrder(board?.columns, board?.columnOrderIds, '_id');

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
            } else {
                // Nếu board undefined → tránh crash
                state.currentActiveBoard = null;
            }
        });
    },
});

// Actions : là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật
// lại dữ liêu thông qua reducer ( chạy đồng bộ )
// Để ý ở trên thì không thấy properties actions đâu cả  , bởi vì những actions này đơn giản là được redux
// tạo tự động theo tên của reducer nhé
export const { updateCurrentActiveBoard, updateCardInBoard } = activeBoardSlice.actions;

// Selectors : là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liêu từ trong kho
// redux store ra sử dụng
export const selectCurrentActiveBoard = (state) => {
    return state.activeBoard?.currentActiveBoard;
};

// file dưới là activeBoardSlice nhưng chúng ta sẽ export 1 thứ tên là Reducer
// export default activeBoardSlice.reducer
export const activeBoardReducer = activeBoardSlice.reducer;
