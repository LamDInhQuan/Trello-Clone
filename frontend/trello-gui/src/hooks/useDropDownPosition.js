import { faY } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useLayoutEffect, useState } from 'react';

function useDropDownPosition(triggerRef, dropdownRef, hide, magin = 0) {
    // trigger là nút nhấn để hiện dropdown
    const [position, setPosition] = useState({ left: 0, top: 30 });

    // đổi position khi menu tràn ra ngoài
    useEffect(() => {
        // đo tọa độ
        if (!triggerRef.current || !dropdownRef.current) return;
        const triggerPosition = triggerRef.current.getBoundingClientRect(); // vị trí nút bấm xổ menu
        const dropdownPosition = dropdownRef.current.getBoundingClientRect(); // vị trí menu dropdown
        const vwInner = window.innerWidth; // chiều rộng trang web
        const vhInner = window.innerHeight; // chiều dài trang web
        let x = triggerPosition.x; // toạ độ x menu
        let y = triggerPosition.y + 30; // toạ độ y menu cach nút bấm 30px
        // Tràn phải
        if (x + dropdownRef.current.offsetWidth > vwInner) {
            x = vwInner - dropdownRef.current.offsetWidth + magin - vwInner;
            //  chiều rộng left phải âm > 100 để nằm cuối màn hình right
            setPosition({ left: x, top: position.y });
        }
        // Tràn trái
        if (x < 30 && x > 0) {
            x = 45;

            setPosition({ left: x, top: position.y });
        }
        // Tràn dưới
        if (y + dropdownRef.current.offsetHeight > vhInner) {
            y = vhInner - magin - dropdownRef.offsetHeight;
            setPosition((prev) => ({ left: prev.left, top: y }));
        }
    }, [triggerRef, dropdownRef, hide]);

    return position;
}

export default useDropDownPosition;
