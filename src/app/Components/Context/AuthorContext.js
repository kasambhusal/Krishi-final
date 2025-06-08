"use client";
import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import { Get } from "../Redux/API";

// Create the context
const AuthorContext = createContext(null);

// Cache key for localStorage
const AUTHOR_CACHE_KEY = "author_cache";
// Refresh interval in milliseconds (5 minutes - authors change less frequently)
const REFRESH_INTERVAL = 5 * 60 * 1000;

export const AuthorProvider = ({ children }) => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Ref for refresh interval
  const refreshIntervalRef = useRef(null);

  // Function to get cached authors - no expiration check
  const getCachedAuthors = useCallback(() => {
    try {
      const cachedData = localStorage.getItem(AUTHOR_CACHE_KEY);
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        if (data && data.length > 0) {
          return { data, timestamp };
        }
      }
    } catch (error) {
      console.error("Error reading from author cache:", error);
    }
    return null;
  }, []);

  // Function to cache authors
  const cacheAuthors = useCallback((authorData) => {
    try {
      const timestamp = Date.now();
      const cacheData = {
        data: authorData,
        timestamp,
      };
      localStorage.setItem(AUTHOR_CACHE_KEY, JSON.stringify(cacheData));
      return timestamp;
    } catch (error) {
      console.error("Error writing to author cache:", error);
      return Date.now();
    }
  }, []);

  // Process authors data if needed
  const processAuthorsData = useCallback((data) => {
    // You can add any processing logic here if needed
    // For example, sorting or filtering
    return data;
  }, []);

  // Load cached authors first
  const loadCachedAuthors = useCallback(() => {
    const cachedResult = getCachedAuthors();
    if (cachedResult) {
      const { data, timestamp } = cachedResult;
      setAuthors(data);
      setLoading(false);
      setLastUpdated(timestamp);
      return true;
    }
    return false;
  }, [getCachedAuthors]);

  // Fetch fresh authors
  const fetchFreshAuthors = useCallback(async () => {
    // Don't show loading state if we already have data
    if (authors.length === 0) {
      setLoading(true);
    } else {
      setIsFetching(true);
    }

    try {
      const response = await Get({ url: "/public/author/get-authors" });
      const processedData = processAuthorsData(response);

      // Only update the state and cache if we got valid data
      if (processedData && processedData.length > 0) {
        setAuthors(processedData);
        const timestamp = cacheAuthors(processedData);
        setLastUpdated(timestamp);
      }
    } catch (error) {
      console.error("Error fetching authors:", error);
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  }, [authors.length, processAuthorsData, cacheAuthors]);

  // Main fetch function that orchestrates the loading strategy
  const fetchAuthors = useCallback(async () => {
    // First try to load from cache
    const hasCachedData = loadCachedAuthors();

    // Then fetch fresh data
    await fetchFreshAuthors();

    // If no cached data was found, we need to ensure loading is set to false
    if (!hasCachedData) {
      setLoading(false);
    }
  }, [loadCachedAuthors, fetchFreshAuthors]);

  // Set up periodic refresh
  useEffect(() => {
    // Clear any existing interval
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }

    // Set up new interval for background refresh
    refreshIntervalRef.current = setInterval(() => {
      // Only fetch if we're not already fetching
      if (!isFetching) {
        fetchFreshAuthors();
      }
    }, REFRESH_INTERVAL);

    // Clean up on unmount
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [fetchFreshAuthors, isFetching]);

  // Fetch authors on mount
  useEffect(() => {
    fetchAuthors();

    // Clean up function
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [fetchAuthors]);

  // Function to manually refresh authors
  const refreshAuthors = useCallback(() => {
    if (!isFetching) {
      fetchFreshAuthors();
    }
  }, [fetchFreshAuthors, isFetching]);

  return (
    <AuthorContext.Provider
      value={{
        authors,
        loading,
        isFetching,
        lastUpdated,
        refreshAuthors, // Expose refresh function
      }}
    >
      {children}
    </AuthorContext.Provider>
  );
};

// Custom hook for using the context
export const useAuthors = () => {
  const context = useContext(AuthorContext);
  if (!context) {
    throw new Error("useAuthors must be used within an AuthorProvider");
  }
  return context;
};
