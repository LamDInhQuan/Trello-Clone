import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import GlobalAppStyle from './components/GlobalAppStyle';

// cấu hình react toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// cấu hình MUI dialog
import { ConfirmProvider } from 'material-ui-confirm';

// cấu hình Redux Store
import { Provider } from 'react-redux';
import { store } from './redux/store';

// cấu hình react-router-dom với BrowserRouter
import { BrowserRouter } from 'react-router-dom';

// cấu hình Redux-persist
import { PersistGate } from 'redux-persist/integration/react';
// Đối tượng persistor được tạo ra từ persistStore.
// Tham số: store → Redux store của bạn (do configureStore hoặc createStore tạo ra).
// Chức năng:
//   - Theo dõi store: Khi state thay đổi, tự động lưu các slice được whitelist vào
//      storage (localStorage, sessionStorage, v.v.).
//   - Khôi phục dữ liệu (rehydrate): Khi app reload, persistor đọc dữ liệu từ storage và
//      đưa vào store.
//   - Cho phép thao tác thủ công: bạn có thể gọi persistor.flush() để ép lưu state ngay,
//      hoặc persistor.purge() để xóa dữ liệu persist.
// Lưu ý: persistStore phải nhận store đã được wrap bằng persistReducer nếu bạn muốn slice
// được persist.
import { persistStore } from 'redux-persist';

// Kỹ thuật Inject Store : là kỹ thuật khi cần sử dụng biến redux store ở các file ngoài phạm vị
// component
import { injectStore } from './utils/authorizeAxios';
injectStore(store);

const persistor = persistStore(store);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter basename="/">
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <GlobalAppStyle>
                    <ConfirmProvider
                        defaultOptions={{
                            dialogProps: {
                                maxWidth: 'xs',
                                disableEnforceFocus: true, // 🔥 tắt ép focus
                                disableAutoFocus: true, // 🔥 tắt tự động focus
                                disableRestoreFocus: true,
                            },
                            confirmationButtonProps: { color: 'secondary', variant: 'outlined' },
                            allowClose: false,
                        }}
                    >
                        <App />
                        <ToastContainer position="bottom-left" theme="colored" />
                    </ConfirmProvider>
                </GlobalAppStyle>
            </PersistGate>
        </Provider>
    </BrowserRouter>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
