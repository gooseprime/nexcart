"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/contexts/auth-context"
import { getSupabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import type { Order } from "@/lib/supabase/database.types"
import { motion } from "framer-motion"

export default function OrdersPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(true)

  // Get the Supabase client once
  const supabase = getSupabaseClient()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to view your orders",
        variant: "destructive",
      })
      router.push("/sign-in?redirect=/orders")
    }
  }, [user, isLoading, router, toast])

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return

      try {
        const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false })

        if (error) throw error
        setOrders(data || [])
      } catch (error) {
        console.error("Error fetching orders:", error)
        toast({
          title: "Error",
          description: "Failed to load your orders",
          variant: "destructive",
        })
      } finally {
        setIsLoadingOrders(false)
      }
    }

    if (user) {
      fetchOrders()
    }
  }, [user, supabase, toast])

  if (isLoading || isLoadingOrders) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
          <div className="animate-pulse">Loading orders...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect via useEffect
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
          Your Orders
        </motion.h1>

        {orders.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                >
                  <Package className="h-16 w-16 text-gray-300 mb-4" />
                </motion.div>
                <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
                <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
                <Link href="/">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button>Start Shopping</Button>
                  </motion.div>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            className="space-y-6"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            initial="hidden"
            animate="show"
          >
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="overflow-hidden">
                  <CardHeader className="bg-gray-50 py-4">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          Order placed:{" "}
                          {new Date(order.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <CardTitle className="text-lg mt-1">Order #{order.id.slice(0, 8)}</CardTitle>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge
                          className={
                            order.status === "completed"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : order.status === "processing"
                                ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                          }
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Total</p>
                          <p className="font-semibold">${order.total.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="py-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">
                          Shipping to: <span className="font-normal">{(order.shipping_address as any).full_name}</span>
                        </p>
                        <p className="text-sm text-gray-500">
                          {(order.shipping_address as any).city}, {(order.shipping_address as any).state}
                        </p>
                      </div>
                      <Link href={`/checkout/confirmation?orderId=${order.id}`}>
                        <motion.div whileHover={{ scale: 1.05, x: 5 }} whileTap={{ scale: 0.95 }}>
                          <Button variant="outline" size="sm" className="flex items-center">
                            View Details
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </motion.div>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
