"use client"

import { useState, useEffect, useCallback } from "react"
import { generateCacheKey, getCachedData, setCachedData, isCacheValid, removeCachedData } from "../utils/sessionCache"

/**
 * Custom hook for session storage caching with API calls
 * @param {string} cachePrefix - Prefix for cache key
 * @param {Object} cacheParams - Parameters for cache key generation
 * @param {Function} fetchFunction - Function to fetch data when cache miss
 * @param {Object} options - Additional options
 * @returns {Object} Hook state and functions
 */
export const useSessionCache = (cachePrefix, cacheParams = {}, fetchFunction, options = {}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { cacheDuration = null, enableLogging = false, dependencies = [] } = options

  const cacheKey = generateCacheKey(cachePrefix, cacheParams)

  const log = useCallback(
    (message, ...args) => {
      if (enableLogging) {
        console.log(`[useSessionCache:${cachePrefix}] ${message}`, ...args)
      }
    },
    [cachePrefix, enableLogging],
  )

  const fetchData = useCallback(
    async (forceRefresh = false) => {
      try {
        setLoading(true)
        setError(null)

        // Check cache first (unless force refresh)
        if (!forceRefresh) {
          const cachedData = getCachedData(cacheKey)

          if (cachedData && isCacheValid(cachedData)) {
            log("Using cached data")
            setData(cachedData.data)
            setLoading(false)
            return cachedData.data
          }
        }

        // Fetch fresh data
        log("Fetching fresh data")
        const freshData = await fetchFunction()

        // Cache the data
        setCachedData(cacheKey, freshData, cacheDuration)
        setData(freshData)
        setLoading(false)

        return freshData
      } catch (err) {
        console.error("Error in useSessionCache:", err)
        setError(err)
        setData(null)
        setLoading(false)
        throw err
      }
    },
    [cacheKey, fetchFunction, cacheDuration, log],
  )

  const refreshData = useCallback(() => {
    return fetchData(true)
  }, [fetchData])

  const clearCache = useCallback(() => {
    removeCachedData(cacheKey)
    log("Cache cleared")
  }, [cacheKey, log])

  useEffect(() => {
    fetchData()
  }, [fetchData, ...dependencies])

  return {
    data,
    loading,
    error,
    refreshData,
    clearCache,
    cacheKey,
  }
}
