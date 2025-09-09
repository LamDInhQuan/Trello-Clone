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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
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
    </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
