"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Edit } from "lucide-react"
import type { CheckoutFormData } from "@/lib/types"
import type { CartItem } from "@/contexts/cart-context"
import { motion } from "framer-motion"

interface OrderReviewProps {
  formData: CheckoutFormData
  items: CartItem[]
  onBack: () => void
  onSubmit: () => void
  isSubmitting: boolean
}

export function OrderReview({ formData, items, onBack, onSubmit, isSubmitting }: OrderReviewProps) {
  // Calculate totals
  const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0)
  const shipping = subtotal > 100 ? 0 : 10
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Review Your Order</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
            {/* Shipping Information */}
            <motion.div variants={item} className="border rounded-md p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">Shipping Information</h3>
                <Button variant="ghost" size="sm" className="h-8 px-2" onClick={onBack}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
              <div className="text-sm">
                <p className="font-medium">{formData.fullName}</p>
                <p>{formData.addressLine1}</p>
                {formData.addressLine2 && <p>{formData.addressLine2}</p>}
                <p>
                  {formData.city}, {formData.state} {formData.postalCode}
                </p>
                <p>{formData.country}</p>
                <p className="mt-2">
                  <span className="font-medium">Email:</span> {formData.email}
                </p>
                <p>
                  <span className="font-medium">Phone:</span> {formData.phone}
                </p>
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div variants={item} className="border rounded-md p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">Payment Method</h3>
                <Button variant="ghost" size="sm" className="h-8 px-2" onClick={onBack}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
              <div className="text-sm">
                {formData.paymentMethod === "credit_card" ? (
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Credit Card:</span>
                    <span>•••• •••• •••• {formData.cardNumber?.slice(-4)}</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span className="font-medium mr-2">PayPal</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Order Items */}
            <motion.div variants={item} className="border rounded-md overflow-hidden">
              <h3 className="font-semibold p-4 border-b">Order Items</h3>
              <div className="divide-y">
                {items.map((item, index) => (
                  <motion.div
                    key={item.product.id}
                    className="p-4 flex items-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.image_url || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-grow">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div variants={item} className="border rounded-md p-4">
              <h3 className="font-semibold mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button onClick={onSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Place Order"}
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
