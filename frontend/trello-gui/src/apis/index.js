import axios from 'axios';
import { API_ROOT } from '~/utils/constants';

// boards
export const fetchBoardDetailsAPI = async (boardId) => {
    const response = await axios.get(`${API_ROOT}/board/getBoardAndColumnByIdBoard/${boardId}`);
    return response.data;
};

// columns
export const createNewColumnApi = async (newColumnData) => {
    const response = await axios.post(`${API_ROOT}/column/addColumn`, newColumnData);
    return response.data;
};

// columns
export const createNewCardApi = async (newCardData) => {
    const response = await axios.post(`${API_ROOT}/card/addCard`, newCardData);
    return response.data;
};

// update columnOrderIds
export const updateColumnOrderIds = async (boardId, columnOrderIds) => {
    const response = await axios.put(`${API_ROOT}/board/updateBoardByColumnIds/${boardId}`, { columnOrderIds });
    return response.data;
};

// update columnOrderIds
export const updateCardOrderIdsInSameColumn = async (columnId, cardOrderIds) => {
    const response = await axios.put(`${API_ROOT}/column/updateColumnByCardOrderIdsInTheSameColumn/${columnId}`, {
        cardOrderIds,
    });
    return response.data;
};

// update columnOrderIds
export const updateCardOrderIdsInTwoColumn = async (
    cardId,
    prevColumnId,
    prevCardOrderIds,
    nextColumnId,
    nextCardOrderIds    ,
) => {
    const response = await axios.put(`${API_ROOT}/column/updateCardOrderIdsInTwoColumn`, {
        cardId,
        prevColumnId,
        prevCardOrderIds,
        nextColumnId,
        nextCardOrderIds    ,
    });
    return response.data;
};

// update columnOrderIds
export const deleteColumnInBoard = async (boardId, columnId) => {
    const response = await axios.delete(`${API_ROOT}/board/deleteColumn/${boardId}/column/${columnId}`);
    return response.data;
};