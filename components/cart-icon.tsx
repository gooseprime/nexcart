"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import Link from "next/link"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function CartIcon() {
  const { itemCount } = useCart()
  const [mounted, setMounted] = useState(false)
  const [hasItemsAdded, setHasItemsAdded] = useState(false)

  // Fix hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Track when items are added to animate the badge
  useEffect(() => {
    if (mounted && itemCount > 0) {
      setHasItemsAdded(true)
      const timer = setTimeout(() => setHasItemsAdded(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [itemCount, mounted])

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
