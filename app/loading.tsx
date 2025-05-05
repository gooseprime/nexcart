import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 text-vibrant-purple animate-spin mb-4" />
        <p className="text-lg font-medium text-gray-700">Loading Nexcart...</p>
        <p className="text-sm text-gray-500">Please wait while we prepare your shopping experience</p>
      </div>
    </div>
  )
}
