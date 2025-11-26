import { useEffect, useState } from 'react';

function useDebounceCustom(value, delay) {
    // console.log("goi ham useDebounceCustom");

    // useState(initialValue) chỉ khởi tạo giá trị lần đầu khi component (hoặc hook) mount.
    const [debounceValue, setDebounceValue] = useState();
    // console.log("debounceValue",debounceValue);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounceValue(value);
        }, delay);
        return () => clearTimeout(handler);
    }, [value]);
    return debounceValue;
}

export default useDebounceCustom;
