import { useEffect } from 'react';

function useClickOutSide(ref, callBack, hide = false) {
  
    useEffect(() => {
        if(!hide) return 
        function clickOutSide(event) {

            if (ref.current && !ref.current.contains(event.target)) {
                callBack();
            }
        }
        document.addEventListener('mousedown', clickOutSide);
        return () => {
            document.removeEventListener('mousedown', clickOutSide);
        };
    }, [ref, callBack, hide]);
}

export default useClickOutSide;

// 🔧 useClickOutside hoạt động như sau:
// Nhận 2 đối số:
//      ref: Thẻ DOM mà bạn muốn theo dõi.
//      onClickOutside: Hàm callback sẽ được gọi nếu user click bên ngoài ref.
// Trong useEffect:
//      Tạo hàm handleClick() để kiểm tra xem click có nằm ngoài ref.current không.
//      Nếu đúng là ngoài: gọi onClickOutside().
//      Thêm sự kiện mousedown cho document mỗi khi component được render (hoặc ref / onClickOutside thay đổi).
//      Đảm bảo theo dõi toàn bộ trang để phát hiện click ngoài.
//      Dùng useEffect để quản lý lifecycle hợp lý.
//      Dọn dẹp (cleanup) khi component bị hủy hoặc ref/onClickOutside thay đổi:
//      Gỡ sự kiện cũ bằng removeEventListener.
