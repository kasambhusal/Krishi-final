/**
 * Enhanced News Cache Utility with custom TTL support
 */

const DEFAULT_CACHE_DURATION = 3 * 60 * 1000 // 3 minutes for news

/**
 * Generate cache key with better serialization
 */
export const getCacheKey = (prefix, params) => {
  if (!params || Object.keys(params).length === 0) {
    return prefix
  }

  const paramString = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b)) // Sort for consistency
    .map(([key, value]) => `${key}_${value}`)
    .join("_")

  return `${prefix}_${paramString}`
}

/**
 * Get cached data
 */
export const getCache = (key) => {
  try {
    const cached = sessionStorage.getItem(key)
    return cached ? JSON.parse(cached) : null
  } catch {
    return null
  }
}

/**
 * Set cache data with custom TTL support
 */
export const setCache = (key, data, customTTL = null) => {
  try {
    sessionStorage.setItem(
      key,
      JSON.stringify({
        data,
        timestamp: Date.now(),
        ttl: customTTL || DEFAULT_CACHE_DURATION,
        topNewsId: Array.isArray(data) && data.length > 0 ? data[0].id : data?.id,
      }),
    )
  } catch (error) {
    console.error("Cache save error:", error)
  }
}

/**
 * Check if cache is still fresh with custom TTL
 */
export const isCacheFresh = (cached, customTTL = null) => {
  if (!cached?.timestamp) return false
  const ttl = customTTL || cached.ttl || DEFAULT_CACHE_DURATION
  return Date.now() - cached.timestamp < ttl
}

/**
 * Check if news has changed (optimized comparison)
 */
export const hasNewNews = (cachedData, freshData) => {
  if (!cachedData?.data || !freshData) return true

  const cachedTopId = Array.isArray(cachedData.data) ? cachedData.data[0]?.id : cachedData.data?.id
  const freshTopId = Array.isArray(freshData) ? freshData[0]?.id : freshData?.id

  return cachedTopId !== freshTopId
}

/**
 * Enhanced notification manager with better state tracking
 */
class NotificationManager {
  constructor() {
    this.hasGlobalUpdate = false
    this.lastNotificationTime = 0
    this.notificationCooldown = 5 * 60 * 1000 // 5 minutes cooldown
    this.notifiedComponents = new Set()
  }

  shouldShowNotification(componentType) {
    const now = Date.now()

    // Only show for important components
    const importantComponents = ["hero", "breaking", "main"]
    if (!importantComponents.includes(componentType)) {
      return false
    }

    // Cooldown period
    if (now - this.lastNotificationTime < this.notificationCooldown) {
      return false
    }

    // Don't show if already notified for this component
    if (this.notifiedComponents.has(componentType)) {
      return false
    }

    return this.hasGlobalUpdate
  }

  setGlobalUpdate(hasUpdate) {
    this.hasGlobalUpdate = hasUpdate
    if (hasUpdate) {
      this.lastNotificationTime = Date.now()
      this.notifiedComponents.clear() // Reset notified components
    }
  }

  clearGlobalUpdate() {
    this.hasGlobalUpdate = false
    this.notifiedComponents.clear()
  }

  markComponentNotified(componentType) {
    this.notifiedComponents.add(componentType)
  }
}

export const notificationManager = new NotificationManager()

/**
 * Clear cache by prefix
 */
export const clearCache = (prefix = "") => {
  try {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.includes(prefix)) {
        sessionStorage.removeItem(key)
      }
    })
  } catch (error) {
    console.error("Cache clear error:", error)
  }
}
    