"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X, Loader2 } from "lucide-react"
import { getProductRecommendations } from "@/app/actions/ai-actions"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import type { ProductRecommendation } from "@/lib/types"

export function AISearch() {
  const [query, setQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [recommendations, setRecommendations] = useState<ProductRecommendation[]>([])
  const [error, setError] = useState<string | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()
  const router = useRouter()

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Focus input when search is opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!query.trim() || isSearching) return

    setIsSearching(true)
    setError(null)

    try {
      const { recommendations: results, error } = await getProductRecommendations(query, user?.id)

      if (error) {
        setError(error)
        setRecommendations([])
      } else {
        setRecommendations(results)
      }
    } catch (err) {
      console.error("Search error:", err)
      setError("An unexpected error occurred. Please try again.")
      setRecommendations([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false)
    }
  }

  const clearSearch = () => {
    setQuery("")
    setRecommendations([])
    setError(null)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleProductClick = (productId: number) => {
    setIsOpen(false)
    router.push(`/products/${productId}`)
  }

  return (
    <div className="relative" ref={searchRef}>
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)} className="relative" aria-label="Search">
        <Search className="h-5 w-5" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 top-full mt-2 w-screen max-w-md bg-white rounded-lg shadow-lg border z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4">
              <form onSubmit={handleSearch} className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    ref={inputRef}
                    placeholder="Search for products with AI..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="pl-10 pr-10"
                  />
                  {query && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={clearSearch}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 hover:bg-gray-100 rounded-full"
                    >
                      <X className="h-4 w-4 text-gray-400" />
                    </Button>
                  )}
                </div>
                <Button type="submit" disabled={isSearching || !query.trim()}>
                  {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
                </Button>
              </form>

              {isSearching && (
                <div className="py-8 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
                  <p className="mt-2 text-sm text-gray-600">Searching with AI...</p>
                </div>
              )}

              {error && (
                <div className="py-4 text-center text-red-500">
                  <p>{error}</p>
                </div>
              )}

              {!isSearching && recommendations.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">AI Recommendations</h3>
                  <div className="space-y-3">
                    {recommendations.map((rec) => (
                      <motion.div
                        key={rec.id}
                        className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleProductClick(rec.id)}
                        whileHover={{ backgroundColor: "#f9fafb" }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {rec.product?.image_url && (
                          <div className="relative h-12 w-12 rounded overflow-hidden mr-3 flex-shrink-0">
                            <Image
                              src={rec.product.image_url || "/placeholder.svg"}
                              alt={rec.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{rec.product?.name}</p>
                          <p className="text-xs text-gray-500 truncate">{rec.reason}</p>
                        </div>
                        <div className="ml-2">
                          <p className="text-sm font-semibold text-blue-600">${rec.product?.price}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {!isSearching && query && recommendations.length === 0 && !error && (
                <div className="py-6 text-center text-gray-500">
                  <p>No products found. Try a different search term.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
