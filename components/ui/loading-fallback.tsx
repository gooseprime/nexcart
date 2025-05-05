"use client"

import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"

interface LoadingFallbackProps {
  title?: string
  message?: string
  size?: "sm" | "md" | "lg"
}

export function LoadingFallback({
  title = "Loading",
  message = "Please wait while we load the content",
  size = "md",
}: LoadingFallbackProps) {
  const sizeClasses = {
    sm: {
      container: "p-4",
      icon: "h-6 w-6",
      title: "text-base",
      message: "text-xs",
    },
    md: {
      container: "p-6",
      icon: "h-8 w-8",
      title: "text-lg",
      message: "text-sm",
    },
    lg: {
      container: "p-8",
      icon: "h-10 w-10",
      title: "text-xl",
      message: "text-base",
    },
  }

  const classes = sizeClasses[size]

  return (
    <motion.div
      className={`flex flex-col items-center justify-center ${classes.container} rounded-lg bg-white shadow-sm border border-gray-100 w-full`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Loader2 className={`${classes.icon} text-vibrant-purple animate-spin mb-3`} />
      <h3 className={`${classes.title} font-medium text-gray-900 mb-1 text-center`}>{title}</h3>
      <p className={`${classes.message} text-gray-500 text-center`}>{message}</p>
    </motion.div>
  )
}
