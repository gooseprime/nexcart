"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import type { CheckoutFormData } from "@/lib/types"
import { motion } from "framer-motion"

interface ShippingFormProps {
  formData: CheckoutFormData
  updateFormData: (data: Partial<CheckoutFormData>) => void
  onNext: () => void
}

export function ShippingForm({ formData, updateFormData, onNext }: ShippingFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName) newErrors.fullName = "Full name is required"
    if (!formData.email) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"
    if (!formData.addressLine1) newErrors.addressLine1 = "Address is required"
    if (!formData.city) newErrors.city = "City is required"
    if (!formData.state) newErrors.state = "State is required"
    if (!formData.postalCode) newErrors.postalCode = "Postal code is required"
    if (!formData.phone) newErrors.phone = "Phone number is required"

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

  const formFields = [
    { name: "fullName", label: "Full Name", type: "text", colSpan: "md:col-span-1" },
    { name: "email", label: "Email", type: "email", colSpan: "md:col-span-1" },
    { name: "addressLine1", label: "Address Line 1", type: "text", colSpan: "md:col-span-2" },
    { name: "addressLine2", label: "Address Line 2 (Optional)", type: "text", colSpan: "md:col-span-2" },
    { name: "city", label: "City", type: "text", colSpan: "md:col-span-1" },
    { name: "state", label: "State", type: "text", colSpan: "md:col-span-1" },
    { name: "postalCode", label: "Postal Code", type: "text", colSpan: "md:col-span-1" },
    { name: "country", label: "Country", type: "text", colSpan: "md:col-span-1" },
    { name: "phone", label: "Phone Number", type: "tel", colSpan: "md:col-span-1" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Shipping Information</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formFields.map((field, index) => (
                <motion.div
                  key={field.name}
                  className={`space-y-2 ${field.colSpan}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Label htmlFor={field.name}>{field.label}</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    value={(formData as any)[field.name] || ""}
                    onChange={handleChange}
                    className={errors[field.name] ? "border-red-500" : ""}
                  />
                  {errors[field.name] && (
                    <motion.p className="text-sm text-red-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      {errors[field.name]}
                    </motion.p>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button type="submit">Continue to Payment</Button>
            </motion.div>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  )
}
