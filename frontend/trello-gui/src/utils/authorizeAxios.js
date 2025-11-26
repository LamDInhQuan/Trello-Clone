import axios from 'axios';
import { toast } from 'react-toastify';
import { interceptorLoadingElements } from './formatters';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUserAPIRedux, selectCurrentUser } from '~/redux/user/userSlice';
import { refreshTokenAPI } from '~/apis';

// Không thể import { store } from '~/redux/store'; theo cách thông thường được
// Giải pháp : Inject store : là kỹ thuật khi cần sử dụng biến redux store ở các file ngoài phạm
//  vi component như file authorizeAxios hiện tại
// Hiểu đơn giản : khi ứng dụng chạy lên , code chạy vào index.js đầu tiên , từ đó chúng ta gọi hàm
//  injectStore ngay lập tức để gán biến mainStore vào biến axiosReduxStore cục bộ trong file này
// Nói cách khác, JS modules load theo thứ tự, nếu file store.js tạo store nhưng phải import
//  Axios instance, và Axios instance lại import store, lúc module chạy đến import { store }
//  thì store chưa được tạo ra → lỗi hoặc undefined.
let axiosReduxStore;
export const injectStore = (mainStore) => {
    axiosReduxStore = mainStore;
};
const user = axiosReduxStore;
console.log(user);

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
        interceptorLoadingElements(true);

        // do something before request is sent
        return config;
    },
    (error) => {
        // do something with request error
        return Promise.reject(error);
    },
);

// Khởi tạo một Promise cho việc gọi Api refresh-token
// Mục đích tạo Promise này để khi nào gọi api  refresh token  xong xuôi thì mới retry lại
// nhiều api bị lỗi trước đó
let refreshTokenPromise = null;

// add a response interceptor
// Interceptor request : can thiệp vào giữa những response nhận về
authorizedAxiosInstance.interceptors.response.use(
    (response) => {
        // Kĩ thuật chặn spam click ( file formatters chứa function interceptorLoadingElements)
        interceptorLoadingElements(false);

        // any status code that lie within the range of 2xx cause this function to trigger
        // do something with response data
        return response;
    },
    (error) => {
        // any status code that lie within the range of 2xx cause this function to trigger
        // do something with response error
        // * Mọi mã http status code nằm ngoài khoảng 200 - 299 sẽ là error và rơi vào đây

        // Kĩ thuật chặn spam click ( file formatters chứa function interceptorLoadingElements)
        interceptorLoadingElements(false);

        // Trường hợp 2 : Nếu như nhận mã 410 từ BE , thì sẽ gọi APi Refresh Token
        // Đầu tiên lấy được các Request API đang bị lỗi thông qua error.config
        const originalRequests = error.config;
        if (error.response?.status === 410 && originalRequests) {
            console.log('originalRequests', originalRequests);
            // Kiểm tra xem nếu chưa có refresh token thì thực hiện gán việc gọi Api Refresh_token
            // đồng thời gán vào cho cái refreshTokenPromise
            if (!refreshTokenPromise) {
                // Lần đầu gặp lỗi 410 → thấy refreshTokenPromise === null → gọi refreshTokenAPI()
                // → gán vào refreshTokenPromise.
                // Các request khác cũng gặp 410 cùng lúc → thấy refreshTokenPromise !== null →
                //  không gọi API refresh nữa mà chỉ .then đợi kết quả từ promise kia.
                // Khi API refresh xong (hoặc lỗi) → .finally đặt lại refreshTokenPromise = null.
                refreshTokenPromise = refreshTokenAPI()
                    .then((data) => {
                        return data.result;
                    })
                    .catch((_error) => {
                        // axiosReduxStore.dispatch(logoutUserAPIRedux(false));
                        // Nếu nhận bất kì lỗi gì từ api refresh token thì logout luôn ( ko cần )
                        return Promise.reject(_error);
                    })
                    .finally(() => {
                        // dù Api có thành công hay lỗi thì vẫn luôn gán lại refreshTokenPromise
                        // về null như ban đầu
                        refreshTokenPromise = null;
                    });
            }

            // cần return trường hợp refreshTokenPromise chạy thành công và thêm xử lí ở đây :
            return refreshTokenPromise
                .then((accessToken) => {
                    // đối với trường hợp nếu dự án cần lưu accessToken vào localstorage hoặc đâu đó
                    // thì viết code xử lí ở đây
                    // ko cần hiện tại vì ta đưa token vào cookie

                    // bước 2 : quan trọng : return lại axios instance của chúng ta kết hợp với các
                    // originalRequest để gọi lại những API ban đâu bị lỗi
                    return authorizedAxiosInstance(originalRequests);
                })
                .catch((err) => {
                    toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
                });
        }

        // Quan trọng : Xử lí Refresh Token tự động
        // Trường hợp 1 : Nếu như nhận mã 401 từ BE , thì gọi APi đăng xuất luôn
        // nghĩa là refresh token hết hạn
        if (error.response?.status === 401) {
            // ko xác thực được token => đăng xuất luôn
            console.log('call api');
            axiosReduxStore.dispatch(logoutUserAPIRedux(false));
        }
        // Xử lí tập trung phần hiển thị thông báo trả về từ mọi API ở đây ( viết code một lần :
        // Clean code ))
        let errorMessage = error?.message; // mặc định lỗi 400
        if (error.response?.data?.message) {
            errorMessage = error.response?.data?.message;
        }
        // xử lí ko hiện log 
        // console.log(error.config);
        const silent = error.config?.headers?.['x-silent'];
        // console.log(silent);
        // hiển thị react toastify cho mọi lỗi
        if (error.response?.status !== 410 && refreshTokenPromise === null && !silent) {
            toast.error(errorMessage);
        }
        return Promise.reject(error);
    },
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
