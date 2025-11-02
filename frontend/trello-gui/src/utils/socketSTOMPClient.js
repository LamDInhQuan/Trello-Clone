// Spring Boot không sử dụng Socket.IO, mà dùng WebSocket chuẩn (chuẩn STOMP).
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { API_ROOT } from './constants';

//  với STOMP/WebSocket + Spring, quy trình chuẩn là: 
//  Frontend: gửi JSON string
//      Không gửi object JS trực tiếp.
//      Luôn JSON.stringify() trước khi gửi qua STOMP:
export const socketStompClient = new Client({
    webSocketFactory: () => new SockJS(`${API_ROOT}/ws`),
    reconnectDelay: 5000, // tự reconnect sau 5s
    onConnect: () => {
        console.log('✅ STOMP connected');
    },
    onDisconnect: () => {
        console.log('❌ STOMP disconnected');
    },  
});
// Hàm khởi tạo socket
export const connectStomp = () => {
  if (!socketStompClient.active) socketStompClient.activate();
};

// Hàm ngắt kết nối
export const disconnectStomp = () => {
  if (socketStompClient.active) socketStompClient.deactivate();
};