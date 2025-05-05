"use client"

import { Navbar } from "@/components/navbar"
import { ErrorFallback } from "@/components/ui/error-fallback"
import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <ErrorFallback
          title="Something went wrong"
          message="We're sorry, but we encountered an error. Our team has been notified."
          onRetry={reset}
        />
      </div>
    </div>
  )
}
