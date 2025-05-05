"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, Send, ArrowRight, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { ChatMessage } from "@/components/chat-message"
import { negotiatePrice } from "@/app/actions/ai-actions"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { motion } from "framer-motion"
import type { Product } from "@/lib/supabase/database.types"
import type { AIMessage } from "@/lib/types"

interface AINegotiateModalProps {
  product: Product
  trigger: React.ReactNode
}

export function AINegotiateModal({ product, trigger }: AINegotiateModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [offerAmount, setOfferAmount] = useState(Math.floor(product.price * 0.9))
  const [inputValue, setInputValue] = useState("")
  const [isNegotiating, setIsNegotiating] = useState(false)
  const [dealAccepted, setDealAccepted] = useState(false)
  const [finalPrice, setFinalPrice] = useState<number | null>(null)
  const chatWindowRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()
  const { addItem } = useCart()

  // Minimum offer is 70% of product price
  const minOffer = Math.floor(product.price * 0.7)
  // Maximum offer is the product price
  const maxOffer = product.price

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight
    }
  }, [messages])

  // Initialize chat when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initialMessage: AIMessage = {
        role: "assistant",
        content: `Hello! I'm your Nexcart AI negotiator. I see you're interested in the ${product.name}. The current price is $${product.price}.

Would you like to make an offer? You can use the slider below to set your price.`,
      }
      setMessages([initialMessage])
    }
  }, [isOpen, messages.length, product])

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      // Reset state when modal is closed
      setMessages([])
      setOfferAmount(Math.floor(product.price * 0.9))
      setInputValue("")
      setIsNegotiating(false)
      setDealAccepted(false)
      setFinalPrice(null)
    }
  }

  const handleMakeOffer = async () => {
    if (isNegotiating) return

    const userMessage: AIMessage = {
      role: "user",
      content: `I'd like to offer $${offerAmount} for this product.`,
    }
    setMessages((prev) => [...prev, userMessage])
    setIsNegotiating(true)

    try {
      const { counterOffer, message, accepted } = await negotiatePrice(product.id, offerAmount, user?.id)

      const assistantMessage: AIMessage = {
        role: "assistant",
        content: message,
      }
      setMessages((prev) => [...prev, assistantMessage])

      if (accepted) {
        setDealAccepted(true)
        setFinalPrice(offerAmount)
      } else if (counterOffer > 0) {
        setOfferAmount(counterOffer)
      }
    } catch (error) {
      console.error("Negotiation error:", error)
      const errorMessage: AIMessage = {
        role: "assistant",
        content: "I'm sorry, I encountered an error during our negotiation. Please try again.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsNegotiating(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isNegotiating) return

    const userMessage: AIMessage = {
      role: "user",
      content: inputValue,
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsNegotiating(true)

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: AIMessage = {
        role: "assistant",
        content: "I understand. You can use the slider below to adjust your offer, and I'll see what I can do!",
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsNegotiating(false)
    }, 1000)
  }

  const handleAcceptDeal = () => {
    if (finalPrice) {
      // Add product to cart with negotiated price
      addItem({
        ...product,
        price: finalPrice,
        original_price: product.price,
      })
      // Close modal
      setIsOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden border border-gray-200 shadow-lg transition-all duration-300 ease-in-out">
        <div className="flex flex-col h-[550px]">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
            <DialogTitle className="text-xl font-bold text-gray-900">AI Price Negotiation</DialogTitle>
            <DialogClose className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-gray-100 transition-colors">
              <X className="h-4 w-4 text-gray-500" />
            </DialogClose>
          </div>

          {/* Chat Window */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50" ref={chatWindowRef}>
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <ChatMessage key={index} type={msg.role === "user" ? "user" : "ai"} message={msg.content} />
              ))}
              {isNegotiating && <ChatMessage type="ai" message="" isTyping={true} />}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-100 bg-white">
            {!dealAccepted ? (
              <>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Your offer:</span>
                    <span className="font-semibold text-blue-600">${offerAmount}</span>
                  </div>
                  <Slider
                    value={[offerAmount]}
                    min={minOffer}
                    max={maxOffer}
                    step={1}
                    onValueChange={(value) => setOfferAmount(value[0])}
                    disabled={isNegotiating}
                    className="mb-4"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>${minOffer}</span>
                    <span>Original: ${product.price}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button onClick={handleMakeOffer} disabled={isNegotiating} className="flex-1">
                    {isNegotiating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Make Offer
                  </Button>

                  <form onSubmit={handleSubmit} className="flex flex-1 items-center space-x-2">
                    <Input
                      type="text"
                      placeholder="Ask a question..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      disabled={isNegotiating}
                      className="flex-1"
                    />
                    <Button
                      type="submit"
                      size="icon"
                      disabled={isNegotiating || !inputValue.trim()}
                      className="h-9 w-9 rounded-full"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <p className="text-lg font-semibold text-green-600 mb-2">Deal Accepted!</p>
                <p className="text-sm text-gray-600 mb-4">
                  You've negotiated a price of ${finalPrice} for {product.name}.
                </p>
                <Button onClick={handleAcceptDeal} className="w-full">
                  Add to Cart at Negotiated Price
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
