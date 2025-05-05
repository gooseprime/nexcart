"use client"

import { Navbar } from "@/components/navbar"
import Image from "next/image"
import { Star, Truck, ShieldCheck, ArrowLeft, ShoppingCart, Minus, Plus, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { useCart } from "@/contexts/cart-context"
import { motion } from "framer-motion"
import { AINegotiateModal } from "@/components/ai/ai-negotiate-modal"
import { AIProductRecommendations } from "@/components/ai/ai-product-recommendations"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { DataErrorFallback } from "@/components/ui/data-error-fallback"
import type { Product } from "@/lib/supabase/database.types"

// Define default images by category
const DEFAULT_IMAGES = {
  Electronics: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1301&auto=format&fit=crop",
  Gadgets: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop",
  Tools: "https://images.unsplash.com/photo-1581166397057-235af2b3c6dd?q=80&w=2070&auto=format&fit=crop",
  Tool: "https://images.unsplash.com/photo-1581166397057-235af2b3c6dd?q=80&w=2070&auto=format&fit=crop",
  Accessories: "https://images.unsplash.com/photo-1625929675093-a85aab94bffa?q=80&w=2071&auto=format&fit=crop",
}

// Get vibrant colors based on category
const getCategoryColors = (category: string) => {
  const colors = {
    Electronics: {
      primary: "vibrant-blue",
      secondary: "vibrant-purple",
      gradient: "from-vibrant-blue to-vibrant-purple",
      light: "blue-100",
      accent: "vibrant-pink",
    },
    Gadgets: {
      primary: "vibrant-purple",
      secondary: "vibrant-pink",
      gradient: "from-vibrant-purple to-vibrant-pink",
      light: "purple-100",
      accent: "vibrant-blue",
    },
    Tools: {
      primary: "vibrant-green",
      secondary: "vibrant-blue",
      gradient: "from-vibrant-green to-vibrant-blue",
      light: "green-100",
      accent: "vibrant-yellow",
    },
    Tool: {
      primary: "vibrant-green",
      secondary: "vibrant-blue",
      gradient: "from-vibrant-green to-vibrant-blue",
      light: "green-100",
      accent: "vibrant-yellow",
    },
    Accessories: {
      primary: "vibrant-pink",
      secondary: "vibrant-orange",
      gradient: "from-vibrant-pink to-vibrant-orange",
      light: "pink-100",
      accent: "vibrant-purple",
    },
  }
  return colors[category as keyof typeof colors] || colors.Electronics
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { addItem } = useCart()
  const colors = getCategoryColors(product.category)

  // Ensure product has an image
  const productImage =
    product.image_url ||
    DEFAULT_IMAGES[product.category as keyof typeof DEFAULT_IMAGES] ||
    "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1301&auto=format&fit=crop"

  const handleAddToCart = () => {
    addItem(product, quantity)
  }

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      {/* Colorful top accent bar */}
      <div className={`h-2 w-full bg-gradient-to-r ${colors.gradient}`}></div>

      <motion.div
        className="container mx-auto px-4 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Breadcrumb */}
        <div className="flex items-center mb-6 text-sm">
          <Link href="/" className={`text-${colors.primary} hover:text-${colors.secondary}`}>
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link
            href={`/categories/${product.category.toLowerCase()}`}
            className={`text-${colors.primary} hover:text-${colors.secondary}`}
          >
            {product.category}
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>

        {/* Back button */}
        <Link
          href={`/categories/${product.category.toLowerCase()}`}
          className={`inline-flex items-center mb-6 text-${colors.primary} hover:text-${colors.secondary} transition-colors`}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to {product.category}
        </Link>

        <ErrorBoundary>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Product Image with colorful border */}
            <motion.div
              className="relative rounded-2xl overflow-hidden bg-white shadow-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className={`absolute inset-0 p-1 bg-gradient-to-br ${colors.gradient} rounded-2xl`}>
                <div className="absolute inset-0 bg-white rounded-xl overflow-hidden">
                  <Image
                    src={productImage || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    priority
                  />
                </div>
              </div>
              <div className="pt-[100%]"></div> {/* Aspect ratio placeholder */}
              {product.discount && (
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className="absolute top-4 left-4 z-10"
                >
                  <Badge className={`bg-${colors.primary} text-white px-3 py-1 text-sm font-bold shadow-lg`}>
                    {product.discount}% OFF
                  </Badge>
                </motion.div>
              )}
              {/* Wishlist button */}
              <motion.button
                className={`absolute top-4 right-4 z-10 h-10 w-10 rounded-full flex items-center justify-center ${
                  isWishlisted ? `bg-vibrant-red text-white` : "bg-white/80 backdrop-blur-sm text-gray-600"
                } shadow-lg hover:scale-110 transition-all duration-300`}
                onClick={toggleWishlist}
                whileTap={{ scale: 0.9 }}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? "fill-white" : ""}`} />
              </motion.button>
            </motion.div>

            {/* Product Info */}
            <motion.div
              className="flex flex-col bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className={`text-3xl font-bold text-gradient bg-gradient-to-r ${colors.gradient} mb-2`}>
                {product.name}
              </h1>

              <div className="flex items-center mb-4">
                <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <span className="ml-1 font-medium">{product.rating}</span>
                </div>
                <span className="mx-2 text-gray-300">|</span>
                <span
                  className={`text-${colors.primary} bg-${colors.light} px-3 py-1 rounded-full text-sm font-medium`}
                >
                  In Stock: {product.stock}
                </span>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-4xl font-bold text-gradient bg-gradient-to-r ${colors.gradient}`}>
                    ${product.price}
                  </span>
                  {product.original_price && (
                    <span className="text-lg text-gray-500 line-through">${product.original_price}</span>
                  )}
                  {product.discount && (
                    <Badge
                      variant="outline"
                      className="text-vibrant-green border-vibrant-green bg-vibrant-green/10 ml-2 px-3 py-1"
                    >
                      Save ${(product.original_price || 0) - product.price}
                    </Badge>
                  )}
                </div>
              </div>

              <p className="text-gray-700 mb-6 bg-gray-50 p-4 rounded-lg border-l-4 border-l-vibrant-purple italic">
                {product.description}
              </p>

              <div className="space-y-4 mb-8">
                <motion.div
                  className={`flex items-center text-gray-700 bg-${colors.light} p-3 rounded-lg`}
                  whileHover={{ x: 5 }}
                >
                  <Truck className={`h-5 w-5 mr-3 text-${colors.primary}`} />
                  <span>Free shipping on orders over $100</span>
                </motion.div>
                <motion.div
                  className="flex items-center text-gray-700 bg-green-50 p-3 rounded-lg"
                  whileHover={{ x: 5 }}
                >
                  <ShieldCheck className="h-5 w-5 mr-3 text-vibrant-green" />
                  <span>1 year warranty included</span>
                </motion.div>
              </div>

              {/* Quantity selector with vibrant colors */}
              <div className="flex items-center mb-6">
                <span className="mr-4 text-gray-700 font-medium">Quantity:</span>
                <div className={`flex items-center border-2 border-${colors.primary} rounded-full overflow-hidden`}>
                  <motion.div
                    whileHover={{ backgroundColor: `rgba(var(--${colors.primary}), 0.1)` }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className={`h-10 w-10 rounded-none text-${colors.primary}`}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </motion.div>
                  <span className="w-12 text-center font-bold">{quantity}</span>
                  <motion.div
                    whileHover={{ backgroundColor: `rgba(var(--${colors.primary}), 0.1)` }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={incrementQuantity}
                      disabled={product.stock <= quantity}
                      className={`h-10 w-10 rounded-none text-${colors.primary}`}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
                <span className="ml-4 text-sm text-gray-500">{product.stock} available</span>
              </div>

              <div className="flex gap-4 mt-auto">
                <motion.div className="flex-1" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    className={`w-full bg-gradient-to-r ${colors.gradient} hover:opacity-90 text-white font-bold py-6 rounded-xl shadow-lg`}
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>
                </motion.div>
                <AINegotiateModal
                  product={product}
                  trigger={
                    <motion.div className="flex-1" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Button
                        variant="outline"
                        className={`w-full border-2 border-${colors.primary} text-${colors.primary} hover:bg-${colors.primary}/10 font-bold py-6 rounded-xl`}
                      >
                        Negotiate Price
                      </Button>
                    </motion.div>
                  }
                />
              </div>
            </motion.div>
          </div>
        </ErrorBoundary>

        {/* Product Details Tabs with vibrant styling */}
        <ErrorBoundary>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <Tabs defaultValue="description" className="w-full">
              <TabsList className={`grid w-full grid-cols-3 p-1 bg-gradient-to-r ${colors.gradient} rounded-t-xl`}>
                <TabsTrigger
                  value="description"
                  className="text-white data-[state=active]:bg-white data-[state=active]:text-black rounded-t-lg data-[state=active]:shadow-lg"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="specifications"
                  className="text-white data-[state=active]:bg-white data-[state=active]:text-black rounded-t-lg data-[state=active]:shadow-lg"
                >
                  Specifications
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="text-white data-[state=active]:bg-white data-[state=active]:text-black rounded-t-lg data-[state=active]:shadow-lg"
                >
                  Reviews
                </TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="p-6 border border-t-0 rounded-b-xl mt-0 bg-white shadow-lg">
                <h3 className={`text-xl font-bold mb-4 text-${colors.primary}`}>Product Description</h3>
                <p className="text-gray-700">{product.description}</p>
                <p className="text-gray-700 mt-4">
                  This {product.name} is designed to meet the highest standards of quality and performance. Perfect for
                  both professional and personal use, it offers reliability and efficiency in all operations.
                </p>
                <div className={`mt-6 p-4 bg-${colors.light} rounded-lg border-l-4 border-${colors.primary}`}>
                  <h4 className="font-bold mb-2">Key Features</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Premium quality materials</li>
                    <li>Advanced technology integration</li>
                    <li>User-friendly interface</li>
                    <li>Energy efficient design</li>
                    <li>Compact and portable</li>
                  </ul>
                </div>
              </TabsContent>
              <TabsContent
                value="specifications"
                className="p-6 border border-t-0 rounded-b-xl mt-0 bg-white shadow-lg"
              >
                <h3 className={`text-xl font-bold mb-4 text-${colors.primary}`}>Technical Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between py-3 px-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <span className="font-medium">Brand</span>
                    <span className={`text-${colors.primary} font-semibold`}>Nexcart</span>
                  </div>
                  <div className="flex justify-between py-3 px-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <span className="font-medium">Model</span>
                    <span className={`text-${colors.primary} font-semibold`}>NX-{product.id}00</span>
                  </div>
                  <div className="flex justify-between py-3 px-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <span className="font-medium">Category</span>
                    <span className={`text-${colors.primary} font-semibold`}>{product.category}</span>
                  </div>
                  <div className="flex justify-between py-3 px-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <span className="font-medium">Warranty</span>
                    <span className={`text-${colors.primary} font-semibold`}>1 Year</span>
                  </div>
                  <div className="flex justify-between py-3 px-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <span className="font-medium">Stock</span>
                    <span className={`text-${colors.primary} font-semibold`}>{product.stock} units</span>
                  </div>
                  <div className="flex justify-between py-3 px-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <span className="font-medium">Rating</span>
                    <span className={`text-${colors.primary} font-semibold`}>{product.rating}/5</span>
                  </div>
                </div>
                <div className={`mt-6 p-4 bg-${colors.light} rounded-lg`}>
                  <h4 className="font-bold mb-2">Package Contents</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>1 x {product.name}</li>
                    <li>1 x User Manual</li>
                    <li>1 x Warranty Card</li>
                    <li>1 x Quick Start Guide</li>
                  </ul>
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="p-6 border border-t-0 rounded-b-xl mt-0 bg-white shadow-lg">
                <h3 className={`text-xl font-bold mb-4 text-${colors.primary}`}>Customer Reviews</h3>
                <div className="space-y-6">
                  <motion.div
                    className="border rounded-xl p-5 hover:shadow-md transition-shadow"
                    whileHover={{ y: -5 }}
                  >
                    <div className="flex items-center mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${i < 5 ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 font-bold text-gray-800">Excellent Product!</span>
                    </div>
                    <p className="text-gray-700 mb-2">
                      This product exceeded my expectations. The quality is outstanding and it works perfectly for my
                      needs. I would definitely recommend it to anyone looking for a reliable solution.
                    </p>
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        J
                      </div>
                      <div className="ml-2">
                        <p className="text-sm font-medium">John D.</p>
                        <p className="text-xs text-gray-500">2 weeks ago</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="border rounded-xl p-5 hover:shadow-md transition-shadow"
                    whileHover={{ y: -5 }}
                  >
                    <div className="flex items-center mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${i < 4 ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 font-bold text-gray-800">Great value for money</span>
                    </div>
                    <p className="text-gray-700 mb-2">
                      I'm very satisfied with this purchase. The product is well-made and performs as advertised. The
                      shipping was fast and the packaging was secure. Would buy from this store again.
                    </p>
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center text-white font-bold">
                        S
                      </div>
                      <div className="ml-2">
                        <p className="text-sm font-medium">Sarah M.</p>
                        <p className="text-xs text-gray-500">1 month ago</p>
                      </div>
                    </div>
                  </motion.div>

                  <div className="mt-8">
                    <Button className={`bg-gradient-to-r ${colors.gradient} hover:opacity-90 text-white w-full`}>
                      Write a Review
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </ErrorBoundary>

        {/* AI Product Recommendations with vibrant styling */}
        <ErrorBoundary
          fallback={
            <DataErrorFallback
              title="Couldn't load recommendations"
              message="We're having trouble loading product recommendations right now."
            />
          }
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <div className={`p-1 bg-gradient-to-r ${colors.gradient} rounded-2xl shadow-lg`}>
              <div className="bg-white rounded-xl p-6">
                <h2 className={`text-2xl font-bold text-gradient bg-gradient-to-r ${colors.gradient} mb-6 text-center`}>
                  You Might Also Like
                </h2>
                <AIProductRecommendations currentProductId={product.id} category={product.category} title="" />
              </div>
            </div>
          </motion.div>
        </ErrorBoundary>
      </motion.div>

      {/* Colorful bottom accent bar */}
      <div className={`h-2 w-full bg-gradient-to-r ${colors.gradient}`}></div>
    </div>
  )
}
