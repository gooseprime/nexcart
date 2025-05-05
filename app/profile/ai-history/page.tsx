import { Navbar } from "@/components/navbar"
import { AIChatHistory } from "@/components/ai/ai-chat-history"
import { AISearchHistory } from "@/components/ai/ai-search-history"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function AIHistoryPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8">Your AI Interactions</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <AIChatHistory />
            </div>
            <div>
              <AISearchHistory />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
