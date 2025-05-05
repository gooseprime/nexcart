"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/product-card"
import { Loader2 } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase/client"
import { motion } from "framer-motion"
import { DataErrorFallback } from "@/components/ui/data-error-fallback"
import type { Product } from "@/lib/supabase/database.types"

interface AIProductRecommendationsProps {
  currentProductId?: number
  category?: string
  title?: string
}

export function AIProductRecommendations({
  currentProductId,
  category,
  title = "Recommended Products",
}: AIProductRecommendationsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchRecommendations = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = getSupabaseClient()
      let query = supabase.from("products").select("*")

      // If we have a category, filter by it
      if (category) {
        query = query.eq("category", category)
      }

      // Get products
      const { data, error } = await query.limit(6)

      if (error) {
        throw new Error(`Error fetching recommendations: ${error.message}`)
      }

      // Filter out current product if needed and limit to 3
      let recommendations = data || []
      if (currentProductId) {
        recommendations = recommendations.filter((product) => product.id !== currentProductId)
      }

      setProducts(recommendations.slice(0, 3))
    } catch (err) {
      console.error("Error fetching recommendations:", err)
      setError(err instanceof Error ? err : new Error("Failed to fetch recommendations"))
      setProducts([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRecommendations()
  }, [currentProductId, category])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <DataErrorFallback
        title="Couldn't load recommendations"
        message="We're having trouble loading product recommendations right now."
        onRetry={fetchRecommendations}
      />
    )
  }

  if (products.length === 0) {
    return <div className="text-center py-4 text-gray-500">No recommendations available</div>
  }

  return (
    <div>
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
