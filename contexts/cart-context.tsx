"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/supabase/database.types"

export type CartItem = {
  product: Product
  quantity: number
}

type CartContextType = {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  itemCount: number
  subtotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = "nexcart-shopping-cart"

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

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const { toast } = useToast()

  // Load cart from localStorage and IndexedDB on initial render
  useEffect(() => {
    const loadCart = async () => {
      try {
        // First try localStorage for faster initial load
        const savedCart = localStorage.getItem(CART_STORAGE_KEY)
        if (savedCart) {
          setItems(JSON.parse(savedCart))
        }

        // Then try IndexedDB for more reliable storage
        try {
          const db = await initializeDB()
          const transaction = db.transaction("cart", "readonly")
          const store = transaction.objectStore("cart")
          const getRequest = store.get("current")

          getRequest.onsuccess = () => {
            if (getRequest.result && getRequest.result.items) {
              setItems(getRequest.result.items)
            }
          }
        } catch (dbError) {
          console.error("Failed to load cart from IndexedDB:", dbError)
        }
      } catch (error) {
        console.error("Failed to load cart:", error)
      }
    }

    loadCart()
  }, [])

  // Save cart to localStorage and IndexedDB whenever it changes
  useEffect(() => {
    const saveCart = async () => {
      try {
        // Save to localStorage for quick access
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))

        // Save to IndexedDB for more reliable offline storage
        try {
          const db = await initializeDB()
          const transaction = db.transaction("cart", "readwrite")
          const store = transaction.objectStore("cart")

          // Store cart as a single object with ID 'current'
          store.put({ id: "current", items })
        } catch (dbError) {
          console.error("Failed to save cart to IndexedDB:", dbError)
        }
      } catch (error) {
        console.error("Failed to save cart:", error)
      }
    }

    if (items.length > 0) {
      saveCart()
    }
  }, [items])

  const addItem = (product: Product, quantity = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id)

      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        )
      } else {
        // Add new item
        return [...prevItems, { product, quantity }]
      }
    })

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const removeItem = (productId: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }

    setItems((prevItems) => prevItems.map((item) => (item.product.id === productId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])

    // Also clear from storage
    localStorage.removeItem(CART_STORAGE_KEY)

    // Clear from IndexedDB
    initializeDB()
      .then((db) => {
        const transaction = db.transaction("cart", "readwrite")
        const store = transaction.objectStore("cart")
        store.delete("current")
      })
      .catch((error) => console.error("Failed to clear cart from IndexedDB:", error))
  }

  // Calculate total number of items in cart
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  // Calculate subtotal
  const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
