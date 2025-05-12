"use client"

import { useState, useEffect } from "react"
import type { ProductRecommendation } from "@/lib/types"

// Client-side function to get product recommendations
export function useProductRecommendations(title = "Recommended Products") {
  const [recommendations, setRecommendations] = useState<ProductRecommendation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setIsLoading(true)

        // Fetch from localStorage first if available
        const cachedRecommendations = localStorage.getItem("cachedRecommendations")
        if (cachedRecommendations) {
          const parsed = JSON.parse(cachedRecommendations)
          const cacheTime = parsed.timestamp

          // Use cache if it's less than 1 hour old
          if (cacheTime && Date.now() - cacheTime < 60 * 60 * 1000) {
            setRecommendations(parsed.data || [])
            setIsLoading(false)
            return
          }
        }

        // Fetch from API
        const response = await fetch("/api/recommendations")

        if (!response.ok) {
          throw new Error("Failed to fetch recommendations")
        }

        const data = await response.json()

        // Cache the results
        localStorage.setItem(
          "cachedRecommendations",
          JSON.stringify({
            data: data.recommendations,
            timestamp: Date.now(),
          }),
        )

        setRecommendations(data.recommendations || [])
      } catch (err) {
        console.error("Error fetching recommendations:", err)
        setError(err instanceof Error ? err.message : "Unknown error")

        // Use fallback data
        setRecommendations([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecommendations()
  }, [])

  return { recommendations, isLoading, error, title }
}
