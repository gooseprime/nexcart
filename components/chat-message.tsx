import { Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"

type MessageType = "ai" | "user"

interface ChatMessageProps {
  type: MessageType
  message: string
  isTyping?: boolean
}

export function ChatMessage({ type, message, isTyping = false }: ChatMessageProps) {
  const isAI = type === "ai"

  return (
    <div className={cn("flex items-start gap-3", !isAI && "justify-end")}>
      {isAI && (
        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
          <Bot className="h-4 w-4" />
        </div>
      )}

      <div
        className={cn(
          "p-3 rounded-xl shadow-sm max-w-[80%]",
          isAI ? "bg-white rounded-tl-none" : "bg-blue-600 rounded-tr-none",
        )}
      >
        {isTyping ? (
          <div className="flex space-x-1">
            <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
            <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "600ms" }}></div>
          </div>
        ) : (
          <p className={cn(isAI ? "text-gray-800" : "text-white")}>{message}</p>
        )}
      </div>

      {!isAI && (
        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 shrink-0">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  )
}
