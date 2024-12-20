'use client';
import { createContext, useState, useContext } from "react";
// Create a Context
const searchNewsContext = createContext();

// Create a Provider component
export const NewsSearchProvider = ({ children }) => {
    const [searchValue, setSearchValue] = useState("");

    return (
        <searchNewsContext.Provider value={{ searchValue, setSearchValue }}>
            {children}
        </searchNewsContext.Provider>
    );
};

// Custom hook for using the context
export const useNewsSearch = () => useContext(searchNewsContext);
