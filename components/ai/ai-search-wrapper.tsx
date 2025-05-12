"use client"

import { useEffect, useState } from "react"
import { AISearch } from "./ai-search"

export function AISearchWrapper() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Only render AISearch on the client side after mount
  if (!mounted) {
    return (
      <div className="relative">
        {/* Placeholder for the search button */}
        <button className="p-2 rounded-full" aria-label="Search">
          <span className="sr-only">Search</span>
        </button>
      </div>
    )
  }

  return <AISearch />
}
