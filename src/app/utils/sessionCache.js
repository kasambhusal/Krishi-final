/**
 * Session Storage Cache Utility
 * Provides functions for caching API responses in session storage
 */

// Default cache duration (30 minutes)
const DEFAULT_CACHE_DURATION = 30 * 60 * 1000

/**
 * Generate a cache key based on parameters
 * @param {string} prefix - Cache key prefix (e.g., 'hero_news', 'card1_news')
 * @param {Object} params - Parameters to include in cache key
 * @returns {string} Generated cache key
 */
export const generateCacheKey = (prefix, params = {}) => {
  const paramString = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b)) // Sort for consistency
    .map(([key, value]) => `${key}_${value}`)
    .join("_")

  return paramString ? `${prefix}_${paramString}` : prefix
}

/**
 * Get cached data from session storage
 * @param {string} cacheKey - The cache key
 * @returns {Object|null} Cached data or null if not found/invalid
 */
export const getCachedData = (cacheKey) => {
  try {
    const cached = sessionStorage.getItem(cacheKey)
    return cached ? JSON.parse(cached) : null
  } catch (error) {
    console.error("Error reading from session storage:", error)
    return null
  }
}

/**
 * Save data to session storage with timestamp
 * @param {string} cacheKey - The cache key
 * @param {any} data - Data to cache
 * @param {number} customDuration - Custom cache duration in milliseconds (optional)
 */
export const setCachedData = (cacheKey, data, customDuration = null) => {
  try {
    const cacheObject = {
      data: data,
      timestamp: Date.now(),
      duration: customDuration || DEFAULT_CACHE_DURATION,
    }

    sessionStorage.setItem(cacheKey, JSON.stringify(cacheObject))
  } catch (error) {
    console.error("Error saving to session storage:", error)
  }
}

/**
 * Check if cached data is still valid
 * @param {Object} cachedData - Cached data object
 * @returns {boolean} True if cache is valid, false otherwise
 */
export const isCacheValid = (cachedData) => {
  if (!cachedData || !cachedData.timestamp) return false

  const duration = cachedData.duration || DEFAULT_CACHE_DURATION
  const isExpired = Date.now() - cachedData.timestamp > duration

  return !isExpired
}

/**
 * Remove specific cache entry
 * @param {string} cacheKey - The cache key to remove
 */
export const removeCachedData = (cacheKey) => {
  try {
    sessionStorage.removeItem(cacheKey)
  } catch (error) {
    console.error("Error removing from session storage:", error)
  }
}

/**
 * Clear all cache entries with a specific prefix
 * @param {string} prefix - Cache key prefix to clear
 */
export const clearCacheByPrefix = (prefix) => {
  try {
    const keys = Object.keys(sessionStorage)
    keys.forEach((key) => {
      if (key.startsWith(prefix)) {
        sessionStorage.removeItem(key)
      }
    })
  } catch (error) {
    console.error("Error clearing cache by prefix:", error)
  }
}

/**
 * Get cache info (for debugging)
 * @param {string} cacheKey - The cache key
 * @returns {Object} Cache information
 */
export const getCacheInfo = (cacheKey) => {
  const cached = getCachedData(cacheKey)
  if (!cached) return { exists: false }

  const age = Date.now() - cached.timestamp
  const duration = cached.duration || DEFAULT_CACHE_DURATION
  const remainingTime = duration - age

  return {
    exists: true,
    age: age,
    remainingTime: Math.max(0, remainingTime),
    isValid: isCacheValid(cached),
    timestamp: new Date(cached.timestamp).toISOString(),
  }
}
