/**
 * Utility functions for working with the Cache API
 */

// Cache API responses for offline use
export async function cacheApiResponse(url: string, response: Response): Promise<void> {
  if ("caches" in window) {
    try {
      const cache = await caches.open("nexcart-api-cache")
      await cache.put(url, response.clone())
    } catch (error) {
      console.error("Failed to cache API response:", error)
    }
  }
}

// Get cached API response
export async function getCachedApiResponse(url: string): Promise<Response | null> {
  if ("caches" in window) {
    try {
      const cache = await caches.open("nexcart-api-cache")
      return await cache.match(url)
    } catch (error) {
      console.error("Failed to get cached API response:", error)
      return null
    }
  }
  return null
}

// Fetch with cache fallback
export async function fetchWithOfflineSupport<T>(
  url: string,
  options?: RequestInit,
): Promise<{ data: T | null; error: Error | null; isFromCache: boolean }> {
  try {
    // Try network first
    if (navigator.onLine) {
      try {
        const response = await fetch(url, options)

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`)
        }

        // Clone and cache the response
        await cacheApiResponse(url, response.clone())

        const data = await response.json()
        return { data, error: null, isFromCache: false }
      } catch (networkError) {
        console.warn("Network fetch failed, trying cache:", networkError)
        // Network fetch failed, try cache
      }
    }

    // Try to get from cache
    const cachedResponse = await getCachedApiResponse(url)

    if (cachedResponse) {
      const data = await cachedResponse.json()
      return { data, error: null, isFromCache: true }
    }

    // Both network and cache failed
    return {
      data: null,
      error: new Error("Failed to fetch data and no cached version available"),
      isFromCache: false,
    }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error("Unknown error occurred"),
      isFromCache: false,
    }
  }
}
