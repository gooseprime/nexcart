"use client"

import { Navbar } from "@/components/navbar"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, subtotal } = useCart()
  const [mounted, setMounted] = useState(false)

  // Fix hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
          <div className="animate-pulse">Loading cart...</div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <motion.div
          className="container mx-auto px-4 py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="text-3xl font-bold mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Your Shopping Cart
          </motion.h1>
          <motion.div
            className="bg-white rounded-lg shadow-sm border p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className="flex justify-center mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            >
              <ShoppingBag className="h-16 w-16 text-gray-300" />
            </motion.div>
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
            <Link href="/">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button>Continue Shopping</Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <motion.div
        className="container mx-auto px-4 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-3xl font-bold mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Your Shopping Cart
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">
                    {items.length} {items.length === 1 ? "Item" : "Items"}
                  </h2>
                  <Button variant="ghost" size="sm" onClick={clearCart} className="text-red-500 hover:text-red-700">
                    Clear Cart
                  </Button>
                </div>
              </div>

              <div className="divide-y">
                {items.map((item, index) => (
                  <motion.div
                    key={item.product.id}
                    className="p-6 flex flex-col sm:flex-row gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    exit={{ opacity: 0, height: 0 }}
                    layout
                  >
                    {/* Product Image */}
                    <motion.div
                      className="relative h-24 w-24 rounded-md overflow-hidden flex-shrink-0"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Image
                        src={item.product.image_url || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </motion.div>

                    {/* Product Details */}
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <Link href={`/products/${item.product.id}`} className="font-medium hover:text-blue-600">
                          {item.product.name}
                        </Link>
                        <span className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{item.product.category}</p>
                      <div className="flex justify-between items-center mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center border rounded-md">
                          <motion.div whileHover={{ backgroundColor: "#f3f4f6" }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="h-8 w-8 rounded-none"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                          </motion.div>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <motion.div whileHover={{ backgroundColor: "#f3f4f6" }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              disabled={item.product.stock <= item.quantity}
                              className="h-8 w-8 rounded-none"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </motion.div>
                        </div>

                        {/* Remove Button */}
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.product.id)}
                            className="text-gray-500 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{subtotal > 100 ? "Free" : "$10.00"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>${(subtotal * 0.08).toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${(subtotal + (subtotal > 100 ? 0 : 10) + subtotal * 0.08).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <Link href="/checkout" className="w-full">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button className="w-full mb-3">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
