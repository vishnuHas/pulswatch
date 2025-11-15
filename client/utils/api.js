import axios from 'axios';
import { getCacheData, setCacheData, CACHE_KEYS } from './cache';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Fetch all mentions for a brand
 */
export async function fetchAllMentions(brand, useCache = true) {
  const cacheKey = CACHE_KEYS.mentions(brand);
  
  // Try cache first
  if (useCache) {
    const cached = getCacheData(cacheKey);
    if (cached) {
      console.log('Using cached mentions');
      return { ...cached, fromCache: true };
    }
  }
  
  // Fetch from API
  const response = await axios.get(`${API_BASE_URL}/api/fetchAll`, {
    params: { brand }
  });
  
  const data = response.data;
  
  // Cache the result
  setCacheData(cacheKey, data);
  
  return { ...data, fromCache: false };
}

/**
 * Analyze sentiment for mentions
 */
export async function analyzeSentiment(brand, mentions, useCache = true) {
  const cacheKey = CACHE_KEYS.sentiment(brand);
  
  // Try cache first
  if (useCache) {
    const cached = getCacheData(cacheKey);
    if (cached) {
      console.log('Using cached sentiment');
      return { ...cached, fromCache: true };
    }
  }
  
  // Fetch from API
  const response = await axios.post(`${API_BASE_URL}/api/sentiment`, {
    brand,
    mentions
  });
  
  const data = response.data;
  
  // Cache the result
  setCacheData(cacheKey, data);
  
  return { ...data, fromCache: false };
}

/**
 * Get topic clusters
 */
export async function getClusters(brand, mentions, useCache = true) {
  const cacheKey = CACHE_KEYS.clusters(brand);
  
  // Try cache first
  if (useCache) {
    const cached = getCacheData(cacheKey);
    if (cached) {
      console.log('Using cached clusters');
      return { ...cached, fromCache: true };
    }
  }
  
  // Fetch from API
  const response = await axios.post(`${API_BASE_URL}/api/clusters`, {
    brand,
    mentions
  });
  
  const data = response.data;
  
  // Cache the result
  setCacheData(cacheKey, data);
  
  return { ...data, fromCache: false };
}

/**
 * Get timeline data
 */
export async function getTimeline(brand, mentions, useCache = true) {
  const cacheKey = CACHE_KEYS.timeline(brand);
  
  // Try cache first
  if (useCache) {
    const cached = getCacheData(cacheKey);
    if (cached) {
      console.log('Using cached timeline');
      return { ...cached, fromCache: true };
    }
  }
  
  // Fetch from API
  const response = await axios.post(`${API_BASE_URL}/api/timeline`, {
    brand,
    mentions
  });
  
  const data = response.data;
  
  // Cache the result
  setCacheData(cacheKey, data);
  
  return { ...data, fromCache: false };
}

/**
 * Detect spikes
 */
export async function detectSpikes(brand, mentions) {
  const response = await axios.post(`${API_BASE_URL}/api/spikes`, {
    brand,
    mentions
  });
  
  return response.data;
}

/**
 * Get AI insights
 */
export async function getInsights(brand, mentions, useCache = true) {
  const cacheKey = CACHE_KEYS.insights(brand);
  
  // Try cache first
  if (useCache) {
    const cached = getCacheData(cacheKey);
    if (cached) {
      console.log('Using cached insights');
      return { ...cached, fromCache: true };
    }
  }
  
  // Fetch from API
  const response = await axios.post(`${API_BASE_URL}/api/insights`, {
    brand,
    mentions
  });
  
  const data = response.data;
  
  // Cache the result
  setCacheData(cacheKey, data);
  
  return { ...data, fromCache: false };
}

/**
 * Get keywords
 */
export async function getKeywords(brand, mentions, useCache = true) {
  const cacheKey = CACHE_KEYS.keywords(brand);
  
  // Try cache first
  if (useCache) {
    const cached = getCacheData(cacheKey);
    if (cached) {
      console.log('Using cached keywords');
      return { ...cached, fromCache: true };
    }
  }
  
  // Fetch from API
  const response = await axios.post(`${API_BASE_URL}/api/keywords`, {
    brand,
    mentions
  });
  
  const data = response.data;
  
  // Cache the result
  setCacheData(cacheKey, data);
  
  return { ...data, fromCache: false };
}

/**
 * Compare two brands
 */
export async function compareBrands(brandA, brandB) {
  const response = await axios.get(`${API_BASE_URL}/api/compare`, {
    params: { brandA, brandB }
  });
  
  return response.data;
}

/**
 * Create WebSocket connection
 */
export function createWebSocket(onMessage) {
  const ws = new WebSocket(API_BASE_URL.replace('http', 'ws'));
  
  ws.onopen = () => {
    console.log('WebSocket connected');
  };
  
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  };
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
  
  ws.onclose = () => {
    console.log('WebSocket disconnected');
  };
  
  return ws;
}
