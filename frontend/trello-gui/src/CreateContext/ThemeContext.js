import { createContext, useEffect, useState } from 'react';

export const ThemeContext = createContext();

export default function ThemeProvider({ children }) {
    // useState(() => {}) : Nó chỉ chạy callback khi khởi tạo state , Không chạy lại khi component re-render
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light';
    });
    // console.log(theme);
    // Khi theme thay đổi → update vào HTML và localStorage
    useEffect(() => {
        // set atrr vào thẻ <html> -> thẻ to nhất
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = (newTheme) => {
        setTheme(newTheme);
    };
    return (
        // <ThemeContext.Provider> là component đặc biệt của React do createContext() tạo ra.
        //  Nhiệm vụ của nó:
        // Cung cấp giá trị context (value={{ theme, toggleTheme }}) cho tất cả component con.
        // Cho phép component con dùng useContext(ThemeContext) để đọc/đổi giá trị.
        <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
    )
}
