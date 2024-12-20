'use client';
import { createContext, useState, useEffect, useContext } from "react";
import { Get } from "../Redux/API"
const AuthorContext = createContext();

export const AuthorProvider = ({ children }) => {
    const [authors, setAuthors] = useState([]);
    const [count, setCount] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAuthors = async () => {
            setLoading(true);
            try {
                const response = await Get({ url: "/public/author/get-authors" });
                setAuthors(response);
            } catch (error) {
                console.error("Error fetching authors:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAuthors();
    }, []); // Run this effect once on mount

    return (
        <AuthorContext.Provider value={{ authors, loading }}>
            {children}
        </AuthorContext.Provider>
    );
};

export const useAuthors = () => useContext(AuthorContext);
