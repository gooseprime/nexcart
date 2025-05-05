import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { CartProvider } from "@/contexts/cart-context"
import { Toaster } from "@/components/ui/toaster"
import { AIChatWrapper } from "@/components/ai/ai-chat-wrapper"
import { OfflineProvider } from "@/components/offline-provider"
import { OfflineIndicator } from "@/components/offline-indicator"
import { OfflineSync } from "@/components/offline-sync"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Nexcart - Technical Equipment Marketplace",
  description: "Negotiate your best deal on tech equipment and electronics",
  // Remove manifest reference since we're not using PWA features
  themeColor: "#8A2BE2",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <CartProvider>
              <OfflineProvider>
                {children}
                <AIChatWrapper />
                <OfflineIndicator />
                <OfflineSync />
                <Toaster />
              </OfflineProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
