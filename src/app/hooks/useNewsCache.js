"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  getCacheKey,
  getCache,
  setCache,
  isCacheFresh,
  hasNewNews,
  notificationManager,
} from "../utils/newsCache";

/**
 * Smart hook for news caching with selective notifications
 */
export const useNewsCache = (
  cachePrefix,
  cacheParams,
  fetchFunction,
  options = {}
) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasUpdates, setHasUpdates] = useState(false);

  const checkIntervalRef = useRef(null);
  const cacheKey = getCacheKey(cachePrefix, cacheParams);

  const {
    dependencies = [],
    showNotifications = false, // Only show notifications if explicitly enabled
    isImportant = false, // Mark important components (hero, breaking news)
  } = options;

  const fetchData = useCallback(
    async (forceRefresh = false) => {
      try {
        setLoading(true);

        // Check cache first (unless force refresh)
        if (!forceRefresh) {
          const cached = getCache(cacheKey);
          if (cached && isCacheFresh(cached)) {
            console.log(`✅ Using cached data for ${cachePrefix}`);
            setData(cached.data);
            setLoading(false);
            return cached.data;
          }
        }

        // Fetch fresh data
        console.log(`🔄 Fetching fresh data for ${cachePrefix}`);
        const freshData = await fetchFunction();

        // Check if we have cached data to compare
        const cached = getCache(cacheKey);

        if (cached && hasNewNews(cached, freshData)) {
          console.log(`🆕 New news detected for ${cachePrefix}`);

          // Only set local updates if notifications are enabled for this component
          if (
            showNotifications &&
            notificationManager.shouldShowNotification(cachePrefix)
          ) {
            setHasUpdates(true);
          }

          // Set global update flag for important components
          if (isImportant) {
            notificationManager.setGlobalUpdate(true);
          }
        }

        // Update cache and state
        setCache(cacheKey, freshData);
        setData(freshData);
        setLoading(false);

        return freshData;
      } catch (error) {
        console.error(`Error fetching ${cachePrefix}:`, error);
        setLoading(false);
        throw error;
      }
    },
    [, fetchFunction, cachePrefix, showNotifications, isImportant]
  );

  // Background check for new news (only for important components)
  const checkForUpdates = useCallback(async () => {
    if (!isImportant) return; // Only check important components in background

    try {
      const cached = getCache(cacheKey);
      if (!cached?.data) return;

      const freshData = await fetchFunction();

      if (hasNewNews(cached, freshData)) {
        console.log(`🔔 New updates available for ${cachePrefix}`);

        if (
          showNotifications &&
          notificationManager.shouldShowNotification(cachePrefix)
        ) {
          setHasUpdates(true);
        }

        notificationManager.setGlobalUpdate(true);
      }
    } catch (error) {
      console.log(`Background check failed for ${cachePrefix}:`, error);
    }
  }, [cacheKey, fetchFunction, cachePrefix, showNotifications, isImportant]);

  // Refresh data and clear update notification
  const refreshData = useCallback(() => {
    setHasUpdates(false);
    notificationManager.clearGlobalUpdate();
    return fetchData(true);
  }, [fetchData]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  // Set up background checking (only for important components)
  useEffect(() => {
    if (isImportant) {
      checkIntervalRef.current = setInterval(checkForUpdates, 2 * 60 * 1000);
    }

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [checkForUpdates, isImportant]);

  return {
    data,
    loading,
    hasUpdates: showNotifications ? hasUpdates : false, // Only return hasUpdates if notifications enabled
    refreshData,
  };
};
