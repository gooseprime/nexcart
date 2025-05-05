// Service Worker for Nexcart E-commerce
const CACHE_NAME = "nexcart-cache-v1"

// Assets to cache on install
const STATIC_ASSETS = ["/", "/offline", "/manifest.json", "/favicon.ico"]

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service Worker: Caching static assets")
      return cache.addAll(STATIC_ASSETS)
    }),
  )
  // Activate the new service worker immediately
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => {
            console.log("Service Worker: Clearing old cache", cacheName)
            return caches.delete(cacheName)
          }),
      )
    }),
  )
  // Claim clients immediately
  self.clients.claim()
})

// Fetch event - network-first strategy with fallback to cache
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") return

  // Skip browser-extension requests and non-HTTP(S) requests
  const url = new URL(event.request.url)
  if (!url.protocol.startsWith("http")) return

  // Handle API requests differently (network-only with timeout)
  if (url.pathname.startsWith("/api/")) {
    return handleApiRequest(event)
  }

  // For navigation requests, use network-first with offline fallback
  if (event.request.mode === "navigate") {
    return handleNavigationRequest(event)
  }

  // For image requests, use cache-first strategy
  if (event.request.destination === "image") {
    return handleImageRequest(event)
  }

  // For other assets (CSS, JS, etc.), use stale-while-revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          // Cache the updated resource
          if (networkResponse && networkResponse.ok) {
            const responseToCache = networkResponse.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache)
            })
          }
          return networkResponse
        })
        .catch((error) => {
          console.error("Service Worker: Fetch failed", error)
          // No network and no cache - return nothing
          return null
        })

      // Return cached response immediately, then update cache in background
      return cachedResponse || fetchPromise
    }),
  )
})

// Handle API requests - network with timeout, no caching
function handleApiRequest(event) {
  const TIMEOUT_MS = 5000 // 5 second timeout for API requests

  event.respondWith(
    Promise.race([
      fetch(event.request).catch((error) => {
        console.error("Service Worker: API fetch failed", error)
        return new Response(JSON.stringify({ error: "You are offline. Please check your connection." }), {
          status: 503,
          headers: { "Content-Type": "application/json" },
        })
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Network timeout")), TIMEOUT_MS)).catch(() => {
        return new Response(JSON.stringify({ error: "Request timed out. Please try again." }), {
          status: 408,
          headers: { "Content-Type": "application/json" },
        })
      }),
    ]),
  )
}

// Handle navigation requests - network-first with offline fallback
function handleNavigationRequest(event) {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then((cachedResponse) => {
        // Return cached page if available
        if (cachedResponse) {
          return cachedResponse
        }
        // Otherwise return the offline page
        return caches.match("/offline")
      })
    }),
  )
}

// Handle image requests - cache-first strategy
function handleImageRequest(event) {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Update cache in background
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.ok) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse.clone())
              })
            }
          })
          .catch(() => {
            // Silently fail - we already have a cached version
          })
        return cachedResponse
      }

      // Not in cache, try network
      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || !networkResponse.ok) {
            throw new Error("Network fetch failed")
          }

          // Cache the fetched resource
          const responseToCache = networkResponse.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })

          return networkResponse
        })
        .catch(() => {
          // If both cache and network fail, return a placeholder image
          return new Response(
            '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#eee"/><text x="50%" y="50%" font-family="Arial" font-size="20" text-anchor="middle" fill="#888">Image Unavailable</text></svg>',
            {
              headers: { "Content-Type": "image/svg+xml" },
            },
          )
        })
    }),
  )
}

// Listen for messages from the client
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
})
