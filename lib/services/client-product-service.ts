import { getSupabaseClient } from "@/lib/supabase/client"
import type { Product } from "@/lib/supabase/database.types"

// Initialize IndexedDB
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

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const supabase = getSupabaseClient()

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", category)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching products by category:", error)
      return []
    }

    // Store products for offline use
    if (data && data.length > 0) {
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
  const supabase = getSupabaseClient()

  try {
    const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching product by ID:", error)
      return null
    }

    // Store product for offline use
    if (data) {
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
          resolve(getRequest.result || null)
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
  const supabase = getSupabaseClient()

  try {
    const { data, error } = await supabase.from("categories").select("id, name").order("name")

    if (error) {
      console.error("Error fetching categories:", error)
      return []
    }

    // Store categories for offline use
    if (data && data.length > 0) {
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

// Function to store products in IndexedDB for offline use
export async function storeProductsOffline(products: Product[]): Promise<void> {
  if (!products || products.length === 0) return

  try {
    const db = await initializeDB()
    const transaction = db.transaction("products", "readwrite")
    const store = transaction.objectStore("products")

    return new Promise((resolve, reject) => {
      products.forEach((product) => {
        store.put(product)
      })

      transaction.oncomplete = () => {
        console.log("Products stored in IndexedDB for offline use")
        resolve()
      }

      transaction.onerror = () => {
        console.error("Error storing products in IndexedDB")
        reject(new Error("Failed to store products"))
      }
    })
  } catch (error) {
    console.error("Error storing products offline:", error)
    throw error
  }
}

// Function to store categories in IndexedDB for offline use
export async function storeCategoriesOffline(categories: any[]): Promise<void> {
  if (!categories || categories.length === 0) return

  try {
    const db = await initializeDB()
    const transaction = db.transaction("categories", "readwrite")
    const store = transaction.objectStore("categories")

    return new Promise((resolve, reject) => {
      categories.forEach((category) => {
        store.put(category)
      })

      transaction.oncomplete = () => {
        console.log("Categories stored in IndexedDB for offline use")
        resolve()
      }

      transaction.onerror = () => {
        console.error("Error storing categories in IndexedDB")
        reject(new Error("Failed to store categories"))
      }
    })
  } catch (error) {
    console.error("Error storing categories offline:", error)
    throw error
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching all products:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getAllProducts:", error)
    return []
  }
}
