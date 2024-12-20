'use client';
import { createContext, useState, useEffect, useContext } from "react";
import { Get } from "../Redux/API";
const CountContext = createContext();

export const CountProvider = ({ children }) => {
    const [count, setCount] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCount = async () => {
            setLoading(true);
            try {
                const response = await Get({ url: "/count/posts/" });
                setCount(response);
            } catch (error) {
                console.error("Error fetching authors:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCount();
    }, []); // Run this effect once on mount

    return (
        <CountContext.Provider value={{ loading, count }}>
            {children}
        </CountContext.Provider>
    );
};

export const useCount = () => useContext(CountContext);
