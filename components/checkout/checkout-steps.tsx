"use client"

import { CheckCircle } from "lucide-react"
import type { CheckoutStep } from "@/lib/types"
import { motion } from "framer-motion"

interface CheckoutStepsProps {
  currentStep: CheckoutStep
  onStepChange: (step: CheckoutStep) => void
}

export function CheckoutSteps({ currentStep, onStepChange }: CheckoutStepsProps) {
  const steps = [
    { id: "shipping", label: "Shipping" },
    { id: "payment", label: "Payment" },
    { id: "review", label: "Review" },
  ] as const

  return (
    <motion.div
      className="flex justify-between"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {steps.map((step, index) => {
        const isActive = currentStep === step.id
        const isCompleted = steps.findIndex((s) => s.id === currentStep) > index
        const isClickable = isCompleted

        return (
          <motion.div
            key={step.id}
            className="flex-1 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 * index }}
          >
            <div
              className={`flex flex-col items-center ${isClickable ? "cursor-pointer" : ""}`}
              onClick={() => isClickable && onStepChange(step.id)}
            >
              <motion.div
                className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : isCompleted
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-500"
                }`}
                whileHover={isClickable ? { scale: 1.1 } : {}}
                whileTap={isClickable ? { scale: 0.95 } : {}}
              >
                {isCompleted ? <CheckCircle className="h-5 w-5" /> : index + 1}
              </motion.div>
              <span
                className={`text-sm font-medium ${
                  isActive ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </div>

            {index < steps.length - 1 && (
              <motion.div
                className="absolute top-5 left-1/2 w-full h-0.5"
                style={{
                  backgroundColor: isCompleted ? "#16a34a" : "#e5e7eb",
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.3 + 0.1 * index }}
              />
            )}
          </motion.div>
        )
      })}
    </motion.div>
  )
}
