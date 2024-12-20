'use client';
import { createContext, useState, useContext } from "react";
// Create a Context
const NavigationContext = createContext();

// Create a Provider component
export const NavigationProvider = ({ children }) => {
    const [lge, setLge] = useState("np");

    const setLanguage = (value) => setLge(value);

    return (
        <NavigationContext.Provider value={{ lge, setLge }}>
            {children}
        </NavigationContext.Provider>
    );
};

// Custom hook for using the context
export const useNavigation = () => useContext(NavigationContext);
