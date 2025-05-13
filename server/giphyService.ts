import axios from "axios";
import { SearchGifsParams, TrendingGifsParams, GiphyResponse } from "@/lib/types";

// Use the GIPHY API key from environment variables
const GIPHY_API_KEY = process.env.GIPHY_API_KEY || process.env.VITE_GIPHY_API_KEY || "hYSr8BFMFGEj2M2K3IiWa1UQnhFN6GWM"; // Using free public beta key as fallback

// Base URL for GIPHY API
const GIPHY_API_BASE_URL = "https://api.giphy.com/v1/gifs";

// Simple in-memory cache
const cache: Record<string, { data: GiphyResponse; timestamp: number }> = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Search for GIFs using the GIPHY API
 */
export async function searchGifs({ query, limit = 25, offset = 0 }: SearchGifsParams): Promise<GiphyResponse> {
  const cacheKey = `search:${query}:${limit}:${offset}`;
  
  // Check cache first
  const cachedData = cache[cacheKey];
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
    return cachedData.data;
  }
  
  try {
    const response = await axios.get(`${GIPHY_API_BASE_URL}/search`, {
      params: {
        api_key: GIPHY_API_KEY,
        q: query,
        limit,
        offset,
        rating: "g",
        lang: "en",
      },
    });
    
    // Cache the result
    cache[cacheKey] = {
      data: response.data,
      timestamp: Date.now(),
    };
    
    return response.data;
  } catch (error) {
    console.error("Error searching gifs:", error);
    throw new Error("Failed to search for GIFs");
  }
}

/**
 * Get trending GIFs from the GIPHY API
 */
export async function trendingGifs({ limit = 25, offset = 0 }: TrendingGifsParams): Promise<GiphyResponse> {
  const cacheKey = `trending:${limit}:${offset}`;
  
  // Check cache first
  const cachedData = cache[cacheKey];
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
    return cachedData.data;
  }
  
  try {
    const response = await axios.get(`${GIPHY_API_BASE_URL}/trending`, {
      params: {
        api_key: GIPHY_API_KEY,
        limit,
        offset,
        rating: "g",
      },
    });
    
    // Cache the result
    cache[cacheKey] = {
      data: response.data,
      timestamp: Date.now(),
    };
    
    return response.data;
  } catch (error) {
    console.error("Error fetching trending gifs:", error);
    throw new Error("Failed to fetch trending GIFs");
  }
}
