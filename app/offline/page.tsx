"use client"

import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { WifiOff, RefreshCw, Home } from "lucide-react"
import Link from "next/link"

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
          <div className="md:flex">
            <div className="p-8 w-full">
              <div className="flex justify-center mb-6">
                <div className="h-24 w-24 rounded-full bg-blue-50 flex items-center justify-center">
                  <WifiOff className="h-12 w-12 text-vibrant-purple" />
                </div>
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">You're offline</h1>
                <p className="text-gray-600 mb-6">
                  It looks like you're not connected to the internet. Some features may be unavailable until you're back
                  online.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={() => window.location.reload()} className="flex items-center justify-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                  </Button>
                  <Link href="/">
                    <Button variant="outline" className="flex items-center justify-center gap-2">
                      <Home className="h-4 w-4" />
                      Go to Homepage
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="mt-8 border-t pt-6">
                <h2 className="text-lg font-semibold mb-4 text-center">Available Offline</h2>
                <p className="text-sm text-gray-600 mb-4 text-center">
                  You can still access previously visited pages and products while offline.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                    <li>Browse previously viewed products</li>
                    <li>View your shopping cart</li>
                    <li>Check your order history</li>
                    <li>Access saved product information</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
