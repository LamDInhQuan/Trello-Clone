 import axios from "axios";
import { API_ROOT } from "~/utils/constants";

 export const fetchBoardDetailsAPI = async (boardId) =>{
        const response = await axios.get(`${API_ROOT}/board/getBoardAndColumnByIdBoard/${boardId}`)
        return response.data
 }