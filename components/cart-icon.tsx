"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function CartIcon() {
  const [itemCount, setItemCount] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [hasItemsAdded, setHasItemsAdded] = useState(false)

  // Fix hydration issues and load cart data from localStorage
  useEffect(() => {
    setMounted(true)

    // Function to update cart count from localStorage
    const updateCartCount = () => {
      try {
        const cartData = localStorage.getItem("nexcart-shopping-cart")
        if (cartData) {
          const parsedCart = JSON.parse(cartData)
          const count = parsedCart.reduce((total: number, item: any) => total + (item.quantity || 0), 0)
          setItemCount(count)
          setHasItemsAdded(true)
          setTimeout(() => setHasItemsAdded(false), 1000)
        } else {
          setItemCount(0)
        }
      } catch (error) {
        console.error("Failed to load cart data:", error)
      }
    }

    // Initial load
    updateCartCount()

    // Listen for custom cart update events
    const handleCartUpdate = () => {
      updateCartCount()
    }

    // Listen for storage events to update cart count when it changes in another tab
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "nexcart-shopping-cart" || e.key === "nexcart-shopping-cart-timestamp") {
        updateCartCount()
      }
    }

    window.addEventListener("cart-updated", handleCartUpdate)
    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("cart-updated", handleCartUpdate)
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  return (
    <Link href="/cart">
      <Button variant="ghost" size="icon" className="relative">
        <ShoppingCart className="h-5 w-5" />
        <AnimatePresence>
          {mounted && itemCount > 0 && (
            <motion.span
              className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{
                scale: hasItemsAdded ? [1, 1.5, 1] : 1,
              }}
              exit={{ scale: 0 }}
              transition={{
                duration: hasItemsAdded ? 0.5 : 0.2,
                type: "spring",
                stiffness: 200,
              }}
            >
              {itemCount}
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    </Link>
  )
}
