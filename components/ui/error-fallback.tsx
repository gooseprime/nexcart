"use client"

import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface ErrorFallbackProps {
  title?: string
  message?: string
  showHomeButton?: boolean
  showRetryButton?: boolean
  onRetry?: () => void
}

export function ErrorFallback({
  title = "Something went wrong",
  message = "We're sorry, but we encountered an error. Please try again later.",
  showHomeButton = true,
  showRetryButton = true,
  onRetry,
}: ErrorFallbackProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center p-8 rounded-lg bg-white shadow-md border border-gray-100 max-w-md mx-auto my-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
        className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4"
      >
        <AlertTriangle className="h-8 w-8 text-red-500" />
      </motion.div>
      <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">{title}</h2>
      <p className="text-gray-600 text-center mb-6">{message}</p>
      <div className="flex flex-col sm:flex-row gap-3">
        {showRetryButton && onRetry && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button onClick={onRetry} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </motion.div>
        )}
        {showHomeButton && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/">
              <Button variant="outline" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
