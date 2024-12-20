import { createContext, useContext, useState, useEffect } from "react";

// Tạo context
const DarkModeContext = createContext();

// eslint-disable-next-line react/prop-types
export function DarkModeProvider({ children }) {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Lấy trạng thái từ localStorage
        return localStorage.getItem("darkMode") === "true";
    });

    useEffect(() => {
        // Đồng bộ trạng thái với thẻ <html>
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        // Lưu trạng thái vào localStorage
        localStorage.setItem("darkMode", isDarkMode);
    }, [isDarkMode]);

    const toggleDarkMode = () => setIsDarkMode((prevMode) => !prevMode);

    return (
        <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
}

// Hook để sử dụng DarkMode
// eslint-disable-next-line react-refresh/only-export-components
export const useDarkMode = () => useContext(DarkModeContext);
