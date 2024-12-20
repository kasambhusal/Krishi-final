'use client';
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    //   const [themeColor, setThemeColor] = useState("#089e19"); // Set default color
    const themeColor = "#12801e";
    const bgColor = "#E8F5E9";
    return (
        <ThemeContext.Provider value={{ themeColor, bgColor }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    return useContext(ThemeContext);
};
