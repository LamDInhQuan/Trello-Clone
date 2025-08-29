 import axios from "axios";
import { API_ROOT } from "~/utils/constants";

// boards
 export const fetchBoardDetailsAPI = async (boardId) =>{
        const response = await axios.get(`${API_ROOT}/board/getBoardAndColumnByIdBoard/${boardId}`)
        return response.data
 }

 // columns
 export const createNewColumnApi = async (newColumnData) => {
       const response = await axios.post(`${API_ROOT}/column/addColumn`,newColumnData)
       return response.data
 }

  // columns
 export const createNewCardApi = async (newCardData) => {
       const response = await axios.post(`${API_ROOT}/card/addCard`,newCardData)
       return response.data
 }