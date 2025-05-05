"use client"

import { Button } from "@/components/ui/button"
import { ServerOffIcon as DatabaseOff, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"

interface DataErrorFallbackProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export function DataErrorFallback({
  title = "Data loading error",
  message = "We couldn't load the data. This might be due to a network issue or a temporary problem with our servers.",
  onRetry,
}: DataErrorFallbackProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center p-6 rounded-lg bg-gray-50 border border-gray-100 w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3"
      >
        <DatabaseOff className="h-6 w-6 text-blue-500" />
      </motion.div>
      <h3 className="text-lg font-medium text-gray-900 mb-1 text-center">{title}</h3>
      <p className="text-gray-600 text-center text-sm mb-4">{message}</p>
      {onRetry && (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={onRetry} size="sm" variant="outline" className="flex items-center gap-1">
            <RefreshCw className="h-3 w-3" />
            Retry
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}
