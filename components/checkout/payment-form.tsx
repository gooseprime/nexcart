"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CreditCard } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import type { CheckoutFormData } from "@/lib/types"
import { motion } from "framer-motion"

interface PaymentFormProps {
  formData: CheckoutFormData
  updateFormData: (data: Partial<CheckoutFormData>) => void
  onBack: () => void
  onNext: () => void
}

export function PaymentForm({ formData, updateFormData, onBack, onNext }: PaymentFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (formData.paymentMethod === "credit_card") {
      if (!formData.cardNumber) newErrors.cardNumber = "Card number is required"
      else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
        newErrors.cardNumber = "Card number must be 16 digits"
      }

      if (!formData.cardExpiry) newErrors.cardExpiry = "Expiry date is required"
      else if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
        newErrors.cardExpiry = "Expiry date must be in MM/YY format"
      }

      if (!formData.cardCvc) newErrors.cardCvc = "CVC is required"
      else if (!/^\d{3,4}$/.test(formData.cardCvc)) {
        newErrors.cardCvc = "CVC must be 3 or 4 digits"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onNext()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    updateFormData({ [name]: value })

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handlePaymentMethodChange = (value: string) => {
    updateFormData({ paymentMethod: value as "credit_card" | "paypal" })
  }

  const handleCheckboxChange = (checked: boolean) => {
    updateFormData({ savePaymentInfo: checked })
  }

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")

    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }

    return v
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
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {Object.keys(errors).length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
              >
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Please fix the errors below to continue</AlertDescription>
                </Alert>
              </motion.div>
            )}

            <RadioGroup value={formData.paymentMethod} onValueChange={handlePaymentMethodChange} className="space-y-4">
              <motion.div
                className="flex items-center space-x-2 border rounded-md p-4"
                whileHover={{ backgroundColor: "#f9fafb" }}
                transition={{ duration: 0.2 }}
              >
                <RadioGroupItem value="credit_card" id="credit_card" />
                <Label htmlFor="credit_card" className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Credit / Debit Card
                </Label>
              </motion.div>
              <motion.div
                className="flex items-center space-x-2 border rounded-md p-4"
                whileHover={{ backgroundColor: "#f9fafb" }}
                transition={{ duration: 0.2 }}
              >
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal" className="flex items-center">
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M19.5 8.25H4.5C3.67157 8.25 3 8.92157 3 9.75V18.75C3 19.5784 3.67157 20.25 4.5 20.25H19.5C20.3284 20.25 21 19.5784 21 18.75V9.75C21 8.92157 20.3284 8.25 19.5 8.25Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.5 15.75H16.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.5 12.75H16.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.5 8.25V3.75"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 8.25V3.75"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16.5 8.25V3.75"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  PayPal
                </Label>
              </motion.div>
            </RadioGroup>

            {formData.paymentMethod === "credit_card" && (
              <motion.div
                className="space-y-4 mt-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={(e) => updateFormData({ cardNumber: formatCardNumber(e.target.value) })}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className={errors.cardNumber ? "border-red-500" : ""}
                  />
                  {errors.cardNumber && <p className="text-sm text-red-500">{errors.cardNumber}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardExpiry">Expiry Date</Label>
                    <Input
                      id="cardExpiry"
                      name="cardExpiry"
                      value={formData.cardExpiry}
                      onChange={(e) => updateFormData({ cardExpiry: formatExpiryDate(e.target.value) })}
                      placeholder="MM/YY"
                      maxLength={5}
                      className={errors.cardExpiry ? "border-red-500" : ""}
                    />
                    {errors.cardExpiry && <p className="text-sm text-red-500">{errors.cardExpiry}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardCvc">CVC</Label>
                    <Input
                      id="cardCvc"
                      name="cardCvc"
                      value={formData.cardCvc}
                      onChange={(e) => updateFormData({ cardCvc: e.target.value.replace(/\D/g, "") })}
                      placeholder="123"
                      maxLength={4}
                      className={errors.cardCvc ? "border-red-500" : ""}
                    />
                    {errors.cardCvc && <p className="text-sm text-red-500">{errors.cardCvc}</p>}
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="savePaymentInfo"
                    checked={formData.savePaymentInfo}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label htmlFor="savePaymentInfo">Save payment information for future purchases</Label>
                </div>
              </motion.div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button type="button" variant="outline" onClick={onBack}>
                Back to Shipping
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button type="submit">Continue to Review</Button>
            </motion.div>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  )
}
