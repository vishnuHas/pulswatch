/**
 * localStorage cache utility for PulseWatch
 * Implements 5-minute cache expiration
 */

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Set data in cache with timestamp
 */
export function setCacheData(key, data) {
  if (typeof window === 'undefined') return;
  
  try {
    const cacheObject = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(cacheObject));
  } catch (error) {
    console.error('Cache set error:', error);
  }
}

/**
 * Get data from cache if not expired
 * Returns null if expired or not found
 */
export function getCacheData(key) {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    const cacheObject = JSON.parse(cached);
    const age = Date.now() - cacheObject.timestamp;
    
    // Check if cache is expired
    if (age > CACHE_DURATION) {
      localStorage.removeItem(key);
      return null;
    }
    
    return cacheObject.data;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
}

/**
 * Clear specific cache key
 */
export function clearCache(key) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Cache clear error:', error);
  }
}

/**
 * Clear all PulseWatch caches
 */
export function clearAllCaches() {
  if (typeof window === 'undefined') return;
  
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('pulsewatch_')) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Cache clear all error:', error);
  }
}

/**
 * Check if cache exists and is valid
 */
export function isCacheValid(key) {
  if (typeof window === 'undefined') return false;
  
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return false;
    
    const cacheObject = JSON.parse(cached);
    const age = Date.now() - cacheObject.timestamp;
    
    return age <= CACHE_DURATION;
  } catch (error) {
    return false;
  }
}

/**
 * Get cache age in seconds
 */
export function getCacheAge(key) {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    const cacheObject = JSON.parse(cached);
    const age = Date.now() - cacheObject.timestamp;
    
    return Math.floor(age / 1000);
  } catch (error) {
    return null;
  }
}

// Cache key generators
export const CACHE_KEYS = {
  mentions: (brand) => `pulsewatch_mentions_${brand}`,
  sentiment: (brand) => `pulsewatch_sentiment_${brand}`,
  clusters: (brand) => `pulsewatch_clusters_${brand}`,
  timeline: (brand) => `pulsewatch_timeline_${brand}`,
  insights: (brand) => `pulsewatch_insights_${brand}`,
  keywords: (brand) => `pulsewatch_keywords_${brand}`,
  spikes: (brand) => `pulsewatch_spikes_${brand}`,
};
