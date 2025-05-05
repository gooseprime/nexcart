"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { CheckCircle, Package, Truck } from "lucide-react"
import Link from "next/link"
import { getSupabaseClient } from "@/lib/supabase/client"
import { motion } from "framer-motion"

export default function ConfirmationPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Get the Supabase client once
  const supabase = getSupabaseClient()

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return

      try {
        // Fetch order details
        const { data: order, error } = await supabase.from("orders").select("*").eq("id", orderId).single()

        if (error) throw error

        // Fetch order items with product details
        const { data: items, error: itemsError } = await supabase
          .from("order_items")
          .select(`
            *,
            product:products(*)
          `)
          .eq("order_id", orderId)

        if (itemsError) throw itemsError

        setOrderDetails({ ...order, items })
      } catch (error) {
        console.error("Error fetching order details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderId, supabase])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse">Loading order details...</div>
        </div>
      </div>
    )
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <h2 className="text-2xl font-semibold mb-2">Order not found</h2>
            <p className="text-gray-600 mb-6">We couldn't find the order you're looking for.</p>
            <Link href="/">
              <Button>Return to Home</Button>
            </Link>
          </div>
        </div>
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
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="bg-white rounded-lg shadow-sm border p-8 text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="flex justify-center mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            >
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
            </motion.div>
            <motion.h1
              className="text-3xl font-bold mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Order Confirmed!
            </motion.h1>
            <motion.p
              className="text-gray-600 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Thank you for your purchase. Your order has been received and is being processed.
            </motion.p>
            <motion.p
              className="text-gray-800 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Order ID: <span className="font-bold">{orderId}</span>
            </motion.p>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg shadow-sm border overflow-hidden mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Order Status</h2>
            </div>
            <div className="p-6">
              <motion.div
                className="flex items-center mb-8"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <CheckCircle className="h-6 w-6 text-vibrant-blue" />
                </div>
                <div>
                  <h3 className="font-medium">Order Placed</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(orderDetails.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center mb-8"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                  <Package className="h-6 w-6 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-medium">Processing</h3>
                  <p className="text-sm text-gray-500">Your order is being prepared</p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                  <Truck className="h-6 w-6 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-medium">Shipping</h3>
                  <p className="text-sm text-gray-500">Estimated delivery in 3-5 business days</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="flex gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Link href="/orders" className="flex-1">
              <Button variant="outline" className="w-full">
                View All Orders
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button className="w-full">Continue Shopping</Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
