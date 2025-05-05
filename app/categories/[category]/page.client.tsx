"use client"

import { Navbar } from "@/components/navbar"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Filter, SlidersHorizontal, PackageOpen } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import type { Product } from "@/lib/supabase/database.types"

// Get gradient colors based on category
const getCategoryGradient = (category: string) => {
  const gradients = {
    electronics: "from-vibrant-blue/80 to-vibrant-purple/80",
    gadgets: "from-vibrant-purple/80 to-vibrant-pink/80",
    tools: "from-vibrant-green/80 to-vibrant-blue/80",
    tool: "from-vibrant-green/80 to-vibrant-blue/80",
    accessories: "from-vibrant-pink/80 to-vibrant-orange/80",
  }
  return gradients[category.toLowerCase() as keyof typeof gradients] || "from-vibrant-blue/80 to-vibrant-purple/80"
}

interface CategoryPageClientProps {
  products: Product[]
  bannerImage: string
  displayName: string
  category: string
}

export default function CategoryPageClient({ products, bannerImage, displayName, category }: CategoryPageClientProps) {
  // Get the gradient for this category
  const gradient = getCategoryGradient(category)

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Category Banner */}
      <div className="relative h-[300px] w-full">
        <Image
          src={bannerImage || "/placeholder.svg"}
          alt={`${displayName} category`}
          fill
          className="object-cover"
          priority
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${gradient} flex items-center`}>
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{displayName}</h1>
            <p className="text-gray-200 text-lg max-w-2xl">
              Explore our collection of premium {displayName.toLowerCase()} with AI-powered price negotiation.
            </p>
          </div>
        </div>
      </div>

      <ErrorBoundary>
        <div className="container mx-auto px-4 py-12">
          {/* Filters and Sorting */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 border-vibrant-purple text-vibrant-purple"
              >
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 border-vibrant-purple text-vibrant-purple"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Sort</span>
              </Button>
            </div>
            <p className="text-gray-600">{products.length} products found</p>
          </div>

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gradient-to-r from-vibrant-purple/5 to-vibrant-blue/5 rounded-2xl">
              <PackageOpen className="h-16 w-16 mx-auto text-vibrant-purple mb-4" />
              <h2 className="text-2xl font-semibold mb-2 text-gradient">No products found</h2>
              <p className="text-gray-600 mb-8">We couldn't find any products in this category.</p>
              <Link href="/">
                <Button variant="gradient">Browse all products</Button>
              </Link>
            </div>
          )}
        </div>
      </ErrorBoundary>
    </div>
  )
}
