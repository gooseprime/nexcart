"use client"

import { useEffect, useState } from "react"
import { CartIcon } from "./cart-icon"

export function CartIconWrapper() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Only render the CartIcon on the client side after the component is mounted
  // This ensures the CartProvider is available
  if (!mounted) {
    // Return a placeholder with the same dimensions to prevent layout shift
    return <div className="w-10 h-10 flex items-center justify-center">{/* Empty placeholder */}</div>
  }

  // Wrap in try/catch to handle the case where CartProvider is not available
  try {
    return <CartIcon />
  } catch (error) {
    console.error("Error rendering CartIcon:", error)
    // Return empty div as fallback
    return <div className="w-10 h-10"></div>
  }
}
