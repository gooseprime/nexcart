"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, Send } from "lucide-react"
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChatMessage } from "@/components/chat-message"
import type { Product } from "@/lib/supabase/database.types"

interface NegotiateModalProps {
  product: Product
  trigger: React.ReactNode
}

export function NegotiateModal({ product, trigger }: NegotiateModalProps) {
  const [inputValue, setInputValue] = useState("")
  const chatWindowRef = useRef<HTMLDivElement>(null)

  // Sample static messages for demonstration
  const messages = [
    {
      type: "ai" as const,
      message: `Hello! I'm your Nexcart AI negotiator. I see you're interested in the ${product.name}. The current price is $${product.price}.`,
    },
    {
      type: "ai" as const,
      message: "What price would you like to offer? I can help you get the best deal possible.",
    },
    {
      type: "user" as const,
      message: `I'd like to offer $${Math.floor(product.price * 0.85)} for this product.`,
    },
    {
      type: "ai" as const,
      message: "Thanks for your offer! Let me check with the seller...",
    },
    {
      type: "ai" as const,
      message: `I've spoken with the seller, and they're willing to offer this ${product.name} for $${Math.floor(product.price * 0.92)}. This is a special discount from the original price of $${product.original_price || product.price + 100}.`,
    },
    {
      type: "ai" as const,
      message: "Would you like to accept this offer or make a counter-offer?",
    },
    {
      type: "user" as const,
      message: `How about $${Math.floor(product.price * 0.9)}? That's my final offer.`,
    },
  ]

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      // In a real app, this would add the message to state and trigger an API call
      setInputValue("")
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden border border-gray-200 shadow-lg transition-all duration-300 ease-in-out">
        <div className="flex flex-col h-[550px]">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
            <DialogTitle className="text-xl font-bold text-gray-900">Negotiate Your Deal</DialogTitle>
            <DialogClose className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-gray-100 transition-colors">
              <X className="h-4 w-4 text-gray-500" />
            </DialogClose>
          </div>

          {/* Chat Window */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50" ref={chatWindowRef}>
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <ChatMessage key={index} type={msg.type} message={msg.message} />
              ))}

              {/* Typing indicator as the last message */}
              <ChatMessage type="ai" message="" isTyping={true} />
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-100 bg-white sticky bottom-0">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Enter your offer..."
                className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Button
                type="submit"
                size="icon"
                className="h-10 w-10 rounded-xl bg-blue-600 hover:bg-blue-700 flex-shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <div className="mt-2 text-xs text-gray-500 text-center">
              Our AI negotiator will help you get the best possible price
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
