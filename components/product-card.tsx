"use client"

import type React from "react"

import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, Star, ShoppingCart, Heart } from "lucide-react"
import { NegotiateModal } from "@/components/negotiate-modal"
import type { Product } from "@/lib/supabase/database.types"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { motion } from "framer-motion"
import { useState } from "react"

// Define default images by category
const DEFAULT_IMAGES = {
  Electronics: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1301&auto=format&fit=crop",
  Gadgets: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop",
  Tools: "https://images.unsplash.com/photo-1581166397057-235af2b3c6dd?q=80&w=2070&auto=format&fit=crop",
  Tool: "https://images.unsplash.com/photo-1581166397057-235af2b3c6dd?q=80&w=2070&auto=format&fit=crop",
  Accessories: "https://images.unsplash.com/photo-1625929675093-a85aab94bffa?q=80&w=2071&auto=format&fit=crop",
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [isHovered, setIsHovered] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  // Ensure product has an image
  const productImage =
    product.image_url ||
    DEFAULT_IMAGES[product.category as keyof typeof DEFAULT_IMAGES] ||
    "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1301&auto=format&fit=crop"

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation when clicking the button
    e.stopPropagation() // Stop event propagation
    addItem(product)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
  }

  // Get a vibrant color based on the category
  const getCategoryColor = (category: string) => {
    const colors = {
      Electronics: {
        bg: "bg-vibrant-blue",
        text: "text-vibrant-blue",
        border: "border-vibrant-blue",
        gradient: "from-vibrant-blue to-vibrant-purple",
      },
      Gadgets: {
        bg: "bg-vibrant-purple",
        text: "text-vibrant-purple",
        border: "border-vibrant-purple",
        gradient: "from-vibrant-purple to-vibrant-pink",
      },
      Tools: {
        bg: "bg-vibrant-green",
        text: "text-vibrant-green",
        border: "border-vibrant-green",
        gradient: "from-vibrant-green to-vibrant-blue",
      },
      Tool: {
        bg: "bg-vibrant-green",
        text: "text-vibrant-green",
        border: "border-vibrant-green",
        gradient: "from-vibrant-green to-vibrant-blue",
      },
      Accessories: {
        bg: "bg-vibrant-pink",
        text: "text-vibrant-pink",
        border: "border-vibrant-pink",
        gradient: "from-vibrant-pink to-vibrant-orange",
      },
    }
    return colors[category as keyof typeof colors] || colors.Electronics
  }

  const colors = getCategoryColor(product.category)

  return (
    <Link href={`/products/${product.id}`}>
      <motion.div
        whileHover={{
          y: -12,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
        transition={{ duration: 0.3 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Card className="overflow-hidden transition-all duration-300 rounded-2xl h-full border-0 shadow-lg">
          <div className="p-1 bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)]">
            <div className="relative h-64 bg-white rounded-t-xl overflow-hidden">
              <Image
                src={productImage || "/placeholder.svg"}
                alt={product.name}
                fill
                className={`object-cover transition-all duration-500 ${isHovered ? "scale-110" : "scale-100"}`}
              />
              {product.discount && (
                <motion.div initial={{ x: 100 }} animate={{ x: 0 }} transition={{ type: "spring", stiffness: 100 }}>
                  <Badge className={`absolute top-3 left-3 ${colors.bg} text-white font-bold shadow-md`}>
                    {product.discount}% OFF
                  </Badge>
                </motion.div>
              )}

              {/* Wishlist button */}
              <motion.button
                className={`absolute top-3 right-3 h-8 w-8 rounded-full flex items-center justify-center ${
                  isWishlisted ? "bg-vibrant-red text-white" : "bg-white/80 backdrop-blur-sm text-gray-600"
                } shadow-md hover:scale-110 transition-all duration-300 z-10`}
                onClick={handleWishlist}
                whileTap={{ scale: 0.9 }}
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? "fill-white" : ""}`} />
              </motion.button>
            </div>
          </div>

          <CardContent className="p-6 bg-gradient-to-br from-white to-gray-50">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-xl text-gray-900 line-clamp-2">{product.name}</h3>
              <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full ml-2 shrink-0">
                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                <span className="text-xs ml-1 font-medium">{product.rating}</span>
              </div>
            </div>
            <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{product.description}</p>
            <div className="flex justify-between items-center">
              <div>
                <span className={`text-2xl font-bold text-gradient bg-gradient-to-r ${colors.gradient}`}>
                  ${product.price}
                </span>
                {product.original_price && (
                  <span className="text-sm text-gray-500 line-through ml-2">${product.original_price}</span>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-6 pt-0 bg-gradient-to-br from-white to-gray-50">
            <div className="flex gap-3 w-full">
              <motion.div className="w-1/2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  className={`w-full bg-gradient-to-r ${colors.gradient} text-white hover:opacity-90 shadow-md`}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </motion.div>
              <NegotiateModal
                product={product}
                trigger={
                  <motion.div className="w-1/2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      className={`w-full ${colors.border} ${colors.text} hover:bg-gray-50`}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Negotiate
                    </Button>
                  </motion.div>
                }
              />
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </Link>
  )
}
