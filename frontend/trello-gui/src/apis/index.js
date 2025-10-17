import { toast } from 'react-toastify';
import authorizedAxiosInstance from '~/utils/authorizeAxios'; // custom axios
import { API_ROOT } from '~/utils/constants';

// boards
export const fetchBoardDetailsAPI = async (boardId) => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/board/getBoardAndColumnByIdBoard/${boardId}`);
    return response.data;
};

// columns
export const createNewColumnApi = async (newColumnData) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/column/addColumn`, newColumnData);
    return response.data;
};

// columns
export const createNewCardApi = async (newCardData) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/card/addCard`, newCardData);
    return response.data;
};

// update columnOrderIds
export const updateColumnOrderIds = async (boardId, columnOrderIds) => {
    const response = await authorizedAxiosInstance.put(`${API_ROOT}/board/updateBoardByColumnIds/${boardId}`, {
        columnOrderIds,
    });
    return response.data;
};

// update columnOrderIds
export const updateCardOrderIdsInSameColumn = async (columnId, cardOrderIds) => {
    const response = await authorizedAxiosInstance.put(
        `${API_ROOT}/column/updateColumnByCardOrderIdsInTheSameColumn/${columnId}`,
        {
            cardOrderIds,
        },
    );
    return response?.data;
};

// update columnOrderIds
export const updateCardOrderIdsInTwoColumn = async (
    cardId,
    prevColumnId,
    prevCardOrderIds,
    nextColumnId,
    nextCardOrderIds,
) => {
    const response = await authorizedAxiosInstance.put(`${API_ROOT}/column/updateCardOrderIdsInTwoColumn`, {
        cardId,
        prevColumnId,
        prevCardOrderIds,
        nextColumnId,
        nextCardOrderIds,
    });
    return response.data;
};

// update columnOrderIds
export const deleteColumnInBoard = async (boardId, columnId) => {
    const response = await authorizedAxiosInstance.delete(
        `${API_ROOT}/board/deleteColumn/${boardId}/column/${columnId}`,
    );
    return response.data;
};

// User
export const registerUserAPI = async (data) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/user/register`, data);
    toast.success(
        'Tài khoản đã tạo thành công ! Vui lòng kiểm tra email và xác thực tài khoản của bạn trước khi đăng nhập !',
    );
    return response.data;
};

// User
export const loginUserAPI = async (data) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/user/login`, data);
    return response.data;
};

// User
export const verifyUserAPI = async (data) => {
    const response = await authorizedAxiosInstance.post(
        `${API_ROOT}/user/verify?email=${data.email}&token=${data.token}`,
    );
    return response.data;
};

export const logOutAPI = async () => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/user/logout`);
    return response.data;
};
export const refreshTokenAPI = async () => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/user/refresh`);
    return response.data;
};

// get list boards
export const getListBoardsAPI = async (currentPage) => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/board/getListBoards`, {
        params: { page: currentPage },
    });
    return response.data;
};
