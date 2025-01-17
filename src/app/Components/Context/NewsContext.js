"use client";
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { Get } from "../Redux/API";
import Toast, { showToast } from "../JS/Toast";
import { useNavigation } from "./NavigationContext";
// Create the context with default values (these will be replaced in the provider)
const NewsContext = createContext(null);

// Create a Provider component
export const NewsProvider = ({ children }) => {
  const [wholeNews, setWholeNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { lge } = useNavigation();
  // Memoize the fetchNews function with useCallback
  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const response = await Get({ url: "/public/news/get-news" });
      const filteredResponse = response
        .filter((item) => item.active === true && item.language === lge)
        .sort((a, b) => {
          // First, sort by self_date in descending order (latest date first)
          if (b.self_date !== a.self_date) {
            return new Date(b.self_date) - new Date(a.self_date); // Date comparison
          }
          // If self_dates are the same, then sort by id in descending order
          return b.id - a.id; // ID comparison in descending order
        });
      setWholeNews(filteredResponse);
    } catch (error) {
      showToast("Error on news fetching", "error");
      setWholeNews([]); // Reset news in case of error
    } finally {
      setLoading(false);
    }
  }, [lge]); // Dependency array only includes `lge`

  // Fetch news on language change or component mount
  useEffect(() => {
    fetchNews(); // Fetch news when the language changes or on mount
  }, []); // `fetchNews` is stable now due to `useCallback`

  return (
    <NewsContext.Provider value={{ wholeNews, loading, setWholeNews }}>
      <Toast />
      {children}
    </NewsContext.Provider>
  );
};

// Custom hook for using the context
export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error("useNews must be used within a NewsProvider");
  }
  return context;
};
