import { getSupabaseClient } from "@/lib/supabase/client"
import type { Product } from "@/lib/supabase/database.types"

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000

// Memory cache for products
const productCache = new Map<string, { data: any; timestamp: number }>()

// Initialize IndexedDB with improved error handling
const initializeDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("IndexedDB not supported"))
      return
    }

    const dbName = "nexcart-offline-db"
    const version = 1
    const request = indexedDB.open(dbName, version)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains("products")) {
        db.createObjectStore("products", { keyPath: "id" })
      }

      if (!db.objectStoreNames.contains("categories")) {
        db.createObjectStore("categories", { keyPath: "id" })
      }

      if (!db.objectStoreNames.contains("cart")) {
        db.createObjectStore("cart", { keyPath: "id" })
      }
    }

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      resolve(db)
    }

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error)
    }
  })
}

// Check if data is in memory cache and not expired
function getFromCache(key: string): any | null {
  const cached = productCache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  return null
}

// Store data in memory cache
function setInCache(key: string, data: any): void {
  productCache.set(key, { data, timestamp: Date.now() })
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  // Try memory cache first
  const cacheKey = `category:${category}`
  const cachedData = getFromCache(cacheKey)
  if (cachedData) {
    return cachedData
  }

  const supabase = getSupabaseClient()

  try {
    const { data, error } = await supabase
      .from("products")
      .select("id, name, description, price, original_price, rating, discount, category, image_url")
      .eq("category", category)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching products by category:", error)
      return []
    }

    // Store in memory cache
    if (data && data.length > 0) {
      setInCache(cacheKey, data)
      // Store for offline use
      storeProductsOffline(data).catch((err) => console.error("Failed to store products offline:", err))
    }

    return data || []
  } catch (error) {
    console.error("Error in getProductsByCategory:", error)

    // Try to get from IndexedDB if available
    try {
      const db = await initializeDB()
      return new Promise((resolve) => {
        const transaction = db.transaction("products", "readonly")
        const store = transaction.objectStore("products")
        const getAllRequest = store.getAll()

        getAllRequest.onsuccess = () => {
          const products = getAllRequest.result || []
          // Filter by category
          const filteredProducts = products.filter((p) => p.category === category)
          // Store in memory cache
          setInCache(cacheKey, filteredProducts)
          resolve(filteredProducts)
        }

        getAllRequest.onerror = () => {
          console.error("Error getting products from IndexedDB")
          resolve([])
        }
      })
    } catch (dbError) {
      console.error("IndexedDB error:", dbError)
      return []
    }
  }
}

export async function getProductById(id: number): Promise<Product | null> {
  // Try memory cache first
  const cacheKey = `product:${id}`
  const cachedData = getFromCache(cacheKey)
  if (cachedData) {
    return cachedData
  }

  const supabase = getSupabaseClient()

  try {
    const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching product by ID:", error)
      return null
    }

    // Store in memory cache
    if (data) {
      setInCache(cacheKey, data)
      // Store product for offline use
      storeProductsOffline([data]).catch((err) => console.error("Failed to store product offline:", err))
    }

    return data
  } catch (error) {
    console.error("Error in getProductById:", error)

    // Try to get from IndexedDB if available
    try {
      const db = await initializeDB()
      return new Promise((resolve) => {
        const transaction = db.transaction("products", "readonly")
        const store = transaction.objectStore("products")
        const getRequest = store.get(id)

        getRequest.onsuccess = () => {
          const product = getRequest.result || null
          if (product) {
            setInCache(cacheKey, product)
          }
          resolve(product)
        }

        getRequest.onerror = () => {
          console.error("Error getting product from IndexedDB")
          resolve(null)
        }
      })
    } catch (dbError) {
      console.error("IndexedDB error:", dbError)
      return null
    }
  }
}

export async function getCategories(): Promise<{ id: number; name: string }[]> {
  // Try memory cache first
  const cacheKey = "categories"
  const cachedData = getFromCache(cacheKey)
  if (cachedData) {
    return cachedData
  }

  const supabase = getSupabaseClient()

  try {
    const { data, error } = await supabase.from("categories").select("id, name").order("name")

    if (error) {
      console.error("Error fetching categories:", error)
      return []
    }

    // Store in memory cache
    if (data && data.length > 0) {
      setInCache(cacheKey, data)
      // Store categories for offline use
      storeCategoriesOffline(data).catch((err) => console.error("Failed to store categories offline:", err))
    }

    return data || []
  } catch (error) {
    console.error("Error in getCategories:", error)

    // Try to get from IndexedDB if available
    try {
      const db = await initializeDB()
      return new Promise((resolve) => {
        const transaction = db.transaction("categories", "readonly")
        const store = transaction.objectStore("categories")
        const getAllRequest = store.getAll()

        getAllRequest.onsuccess = () => {
          const categories = getAllRequest.result || []
          setInCache(cacheKey, categories)
          resolve(categories.map((c) => ({ id: c.id, name: c.name })))
        }

        getAllRequest.onerror = () => {
          console.error("Error getting categories from IndexedDB")
          resolve([])
        }
      })
    } catch (dbError) {
      console.error("IndexedDB error:", dbError)
      return []
    }
  }
}

// Function to store products in IndexedDB for offline use - optimized with bulk operations
export async function storeProductsOffline(products: Product[]): Promise<void> {
  if (!products || products.length === 0) return

  try {
    const db = await initializeDB()
    const transaction = db.transaction("products", "readwrite")
    const store = transaction.objectStore("products")

    return new Promise((resolve, reject) => {
      // Use a counter to track completed operations
      let completed = 0
      const total = products.length

      products.forEach((product) => {
        const request = store.put(product)
        request.onsuccess = () => {
          completed++
          if (completed === total) {
            resolve()
          }
        }
        request.onerror = () => {
          reject(new Error("Failed to store product"))
        }
      })

      transaction.oncomplete = () => {
        resolve()
      }

      transaction.onerror = () => {
        reject(new Error("Failed to store products"))
      }
    })
  } catch (error) {
    console.error("Error storing products offline:", error)
    throw error
  }
}

// Function to store categories in IndexedDB for offline use - optimized
export async function storeCategoriesOffline(categories: any[]): Promise<void> {
  if (!categories || categories.length === 0) return

  try {
    const db = await initializeDB()
    const transaction = db.transaction("categories", "readwrite")
    const store = transaction.objectStore("categories")

    return new Promise((resolve, reject) => {
      // Use a counter to track completed operations
      let completed = 0
      const total = categories.length

      categories.forEach((category) => {
        const request = store.put(category)
        request.onsuccess = () => {
          completed++
          if (completed === total) {
            resolve()
          }
        }
        request.onerror = () => {
          reject(new Error("Failed to store category"))
        }
      })

      transaction.oncomplete = () => {
        resolve()
      }

      transaction.onerror = () => {
        reject(new Error("Failed to store categories"))
      }
    })
  } catch (error) {
    console.error("Error storing categories offline:", error)
    throw error
  }
}

export async function getAllProducts(limit = 12, page = 0): Promise<Product[]> {
  // Try memory cache first
  const cacheKey = `allProducts:${limit}:${page}`
  const cachedData = getFromCache(cacheKey)
  if (cachedData) {
    return cachedData
  }

  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from("products")
      .select("id, name, description, price, original_price, rating, discount, category, image_url")
      .order("created_at", { ascending: false })
      .range(page * limit, (page + 1) * limit - 1)

    if (error) {
      console.error("Error fetching all products:", error)
      return []
    }

    // Store in memory cache
    if (data && data.length > 0) {
      setInCache(cacheKey, data)
    }

    return data || []
  } catch (error) {
    console.error("Error in getAllProducts:", error)
    return []
  }
}
