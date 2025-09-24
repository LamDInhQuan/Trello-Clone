import axios from 'axios';
import { toast } from 'react-toastify';
import { interceptorLoadingElements } from './formatters';

// Khởi tạo một đối tượng Axios ( authorizedAxiosInstance ) mục đích để custom và cấu hình chung cho
// dự án .
let authorizedAxiosInstance = axios.create();

// Thời gian chờ tối đa của 1 request : 10 phút
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10;

// withCredentials : sẽ cho phép axios tự động gửi cookie trong mỗi request lên BE ( phục vụ việc
// chúng ta sẽ lưu JWT tokens ( refresh & access ) vào trong httpOnly Cookie của trình duyệt )
authorizedAxiosInstance.defaults.withCredentials = true;

// cấu hình interceptors ( bộ đánh chặn vào giữa mọi request & response)

// add a request interceptor
// Interceptor request : can thiệp vào giữa những request API
authorizedAxiosInstance.interceptors.request.use(
    (config) => {
        // Kĩ thuật chặn spam click ( file formatters chứa function interceptorLoadingElements)
        interceptorLoadingElements(true)
 
        // do something before request is sent
        return config;
    },
    (error) => {
        // do something with request error
        return Promise.reject(error);
    }
);

// add a response interceptor
// Interceptor request : can thiệp vào giữa những response nhận về
authorizedAxiosInstance.interceptors.response.use(
    (response) => {
        // Kĩ thuật chặn spam click ( file formatters chứa function interceptorLoadingElements)
        interceptorLoadingElements(false)

        // any status code that lie within the range of 2xx cause this function to trigger
        // do something with response data
        return response;
    },
    (error) => {
        // Kĩ thuật chặn spam click ( file formatters chứa function interceptorLoadingElements)
        interceptorLoadingElements(false)
        
        // any status code that lie within the range of 2xx cause this function to trigger
        // do something with response error
        // * Mọi mã http status code nằm ngoài khoảng 200 - 299 sẽ là error và rơi vào đây 
    
        // Xử lí tập trung phần hiển thị thông báo trả về từ mọi API ở đây ( viết code một lần : 
        // Clean code ))
        let errorMessage = error?.message // mặc định lỗi 400
        if(error.response?.data?.message) {
            errorMessage = error.response?.data?.message
        }
        // hiển thị react toastify cho mọi lỗi 
        if(error.response?.status !== 410){
            toast.error(errorMessage)
        }
        return Promise.reject(error);
    }
);

export default authorizedAxiosInstance;

// Interceptor trong web (đặc biệt trong các framework backend/frontend) có thể hiểu nôm na là:
// 👉 “một lớp trung gian chặn (intercept) request/response trước khi chúng đi đến logic chính hoặc trước khi trả về cho client”.
// 🎯 Cách hoạt động
// Khi người dùng gửi request đến server:
// Client → Request
// Interceptor (trung gian xử lý)
// Có thể chặn request.
// Có thể thêm header/token.
// Có thể ghi log / kiểm tra quyền truy cập.
// Controller/Route → Logic chính
// Interceptor trên Response (nếu có)
// Có thể format dữ liệu.
// Có thể xử lý lỗi chung.
// Trả về Client
