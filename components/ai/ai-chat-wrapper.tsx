"use client"

import { AIChat } from "@/components/ai/ai-chat"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export function AIChatWrapper() {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  // Fix hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't show on auth pages
  if (!mounted || pathname.includes("/sign-in") || pathname.includes("/sign-up")) {
    return null
  }

  return (
    <AIChat initialContext="You are a helpful shopping assistant for Nexcart, an e-commerce platform specializing in electronics, tools, gadgets, and accessories. Help users find products, answer questions about the platform, and provide information about our AI-powered price negotiation feature." />
  )
}
