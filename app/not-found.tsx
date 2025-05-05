import { Navbar } from "@/components/navbar"
import { NotFoundFallback } from "@/components/ui/not-found-fallback"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <NotFoundFallback />
      </div>
    </div>
  )
}
