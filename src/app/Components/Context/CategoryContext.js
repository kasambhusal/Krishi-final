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
import { useNavigation } from "./NavigationContext";

// Create the context
const CategoryContext = createContext(null);

// Cache key for localStorage
const ADS_CACHE_KEY_PREFIX = "category_cache_";
// Refresh interval in milliseconds (5 minutes)
const ADS_REFRESH_INTERVAL = 5 * 60 * 1000;

// CategoryProvider component
export const CategoryProvider = ({ children }) => {
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const { lge } = useNavigation();
  const [lastUpdated, setLastUpdated] = useState(null);

  // Ref for refresh interval
  const refreshIntervalRef = useRef(null);

  // Function to get cached ads - no expiration check
  const getCachedAds = useCallback(() => {
    try {
      const cachedData = localStorage.getItem(`${ADS_CACHE_KEY_PREFIX}${lge}`);
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        if (data && data.length > 0) {
          return { data, timestamp };
        }
      }
    } catch (error) {
      console.error("Error reading from ads cache:", error);
    }
    return null;
  }, [lge]);

  // Function to cache ads
  const cacheAds = useCallback(
    (adsData) => {
      try {
        const timestamp = Date.now();
        const cacheData = {
          data: adsData,
          timestamp,
        };
        localStorage.setItem(
          `${ADS_CACHE_KEY_PREFIX}${lge}`,
          JSON.stringify(cacheData)
        );
        return timestamp;
      } catch (error) {
        console.error("Error writing to category cache:", error);
        return Date.now();
      }
    },
    [lge]
  );

  // Process ads data
  const processAdsData = useCallback((data) => {
    return data
      .filter(
        (item) =>
          item.active === true && item.language === lge && item.active === true
      )
      .sort((a, b) => a.display_order - b.display_order);
  }, []);

  // Load cached ads first
  const loadCachedAds = useCallback(() => {
    const cachedResult = getCachedAds();
    if (cachedResult) {
      const { data, timestamp } = cachedResult;
      setCategory(data);
      setLoading(false);
      setLastUpdated(timestamp);
      return true;
    }
    return false;
  }, [getCachedAds]);

  // Fetch fresh ads
  const fetchFreshAds = useCallback(async () => {
    // Don't show loading state if we already have data
    if (category.length === 0) {
      setLoading(true);
    } else {
      setIsFetching(true);
    }

    try {
      const response = await Get({
        url: `/public/category/get-category?language=${lge}`,
      });
      const processedData = response || response.results;

      // Only update the state and cache if we got valid data
      if (processedData && processedData.length > 0) {
        // Sort the categories by display_order in ascending order
        const sortedData = processedData.sort(
          (a, b) => a.display_order - b.display_order
        );

        setCategory(sortedData);
        const timestamp = cacheAds(sortedData);
        setLastUpdated(timestamp);
      }
    } catch (error) {
      console.error("Error in category fetch:", error);
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  }, [category.length, processAdsData, cacheAds]);

  // Main fetch function that orchestrates the loading strategy
  const fetchAds = useCallback(async () => {
    // First try to load from cache
    const hasCachedData = loadCachedAds();

    // Then fetch fresh data
    await fetchFreshAds();

    // If no cached data was found, we need to ensure loading is set to false
    if (!hasCachedData) {
      setLoading(false);
    }
  }, [loadCachedAds, fetchFreshAds]);

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
        fetchFreshAds();
      }
    }, ADS_REFRESH_INTERVAL);

    // Clean up on unmount
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [fetchFreshAds, isFetching]);

  // Fetch ads when language changes or component mounts
  useEffect(() => {
    fetchAds();

    // Clean up function
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [lge, fetchAds]);

  // Function to manually refresh ads
  const refreshAds = useCallback(() => {
    if (!isFetching) {
      fetchFreshAds();
    }
  }, [fetchFreshAds, isFetching]);

  return (
    <CategoryContext.Provider
      value={{
        category,
        loading,
        isFetching,
        setCategory,
        lastUpdated,
        refreshAds, // Expose refresh function
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

// Custom hook to use the context
export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategory must be used within a CategoryProvider");
  }
  return context;
};
