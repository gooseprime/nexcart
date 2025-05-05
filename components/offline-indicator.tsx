"use client"

import { useOffline } from "@/components/offline-provider"
import { WifiOff } from "lucide-react"

export function OfflineIndicator() {
  const { isOnline } = useOffline()

  if (isOnline) return null

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-sm text-red-800 shadow-lg">
      <WifiOff className="h-4 w-4" />
      <span>Offline</span>
    </div>
  )
}
