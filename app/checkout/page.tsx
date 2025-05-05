"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { useCart } from "@/contexts/cart-context"
import { ShippingForm } from "@/components/checkout/shipping-form"
import { PaymentForm } from "@/components/checkout/payment-form"
import { OrderReview } from "@/components/checkout/order-review"
import { CheckoutSummary } from "@/components/checkout/checkout-summary"
import { CheckoutSteps } from "@/components/checkout/checkout-steps"
import { createOrder } from "@/app/actions/checkout-actions"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import type { CheckoutStep, CheckoutFormData } from "@/lib/types"
import { motion } from "framer-motion"

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping")
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
    phone: "",
    paymentMethod: "credit_card",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    savePaymentInfo: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Fix hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to continue with checkout",
        variant: "destructive",
      })
      router.push("/sign-in?redirect=/checkout")
    }
  }, [user, isLoading, router, toast])

  // Redirect to cart if cart is empty
  useEffect(() => {
    if (mounted && items.length === 0) {
      toast({
        title: "Empty cart",
        description: "Your cart is empty. Please add items before checkout.",
      })
      router.push("/cart")
    }
  }, [mounted, items, router, toast])

  // Pre-fill email from user data
  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({ ...prev, email: user.email || "" }))
    }
  }, [user])

  const handleStepChange = (step: CheckoutStep) => {
    setCurrentStep(step)
  }

  const updateFormData = (data: Partial<CheckoutFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const result = await createOrder(formData, items)

      if (result.success) {
        clearCart()
        router.push(`/checkout/confirmation?orderId=${result.orderId}`)
      } else {
        toast({
          title: "Checkout failed",
          description: result.error || "An error occurred during checkout",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Checkout failed",
        description: error instanceof Error ? error.message : "An error occurred during checkout",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse">Loading checkout...</div>
        </div>
      </div>
    )
  }

  if (!user || items.length === 0) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <motion.div
        className="container mx-auto px-4 py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-3xl font-bold mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Checkout
        </motion.h1>

        <CheckoutSteps currentStep={currentStep} onStepChange={handleStepChange} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {currentStep === "shipping" && (
              <ShippingForm
                formData={formData}
                updateFormData={updateFormData}
                onNext={() => setCurrentStep("payment")}
              />
            )}

            {currentStep === "payment" && (
              <PaymentForm
                formData={formData}
                updateFormData={updateFormData}
                onBack={() => setCurrentStep("shipping")}
                onNext={() => setCurrentStep("review")}
              />
            )}

            {currentStep === "review" && (
              <OrderReview
                formData={formData}
                items={items}
                onBack={() => setCurrentStep("payment")}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            )}
          </motion.div>

          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <CheckoutSummary items={items} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
