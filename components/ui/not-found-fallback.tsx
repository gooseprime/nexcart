"use client"

import { Button } from "@/components/ui/button"
import { FileQuestion, Home, Search } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface NotFoundFallbackProps {
  title?: string
  message?: string
  showHomeButton?: boolean
  showSearchButton?: boolean
}

export function NotFoundFallback({
  title = "Page not found",
  message = "Sorry, we couldn't find the page you're looking for.",
  showHomeButton = true,
  showSearchButton = true,
}: NotFoundFallbackProps) {
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
        className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center mb-4"
      >
        <FileQuestion className="h-8 w-8 text-vibrant-purple" />
      </motion.div>
      <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">{title}</h2>
      <p className="text-gray-600 text-center mb-6">{message}</p>
      <div className="flex flex-col sm:flex-row gap-3">
        {showHomeButton && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/">
              <Button className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            </Link>
          </motion.div>
        )}
        {showSearchButton && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/search">
              <Button variant="outline" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Search Products
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
