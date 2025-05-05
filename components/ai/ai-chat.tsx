"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Send, X, Minimize2, Maximize2, History } from "lucide-react"
import { ChatMessage } from "@/components/chat-message"
import { generateAIResponse } from "@/app/actions/ai-actions"
import { useAuth } from "@/contexts/auth-context"
import { motion, AnimatePresence } from "framer-motion"
import { getSupabaseClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import type { AIMessage } from "@/lib/types"

interface AIChatProps {
  initialContext?: string
  initialMessages?: AIMessage[]
  title?: string
}

export function AIChat({ initialContext = "", initialMessages = [], title = "Nexcart AI Assistant" }: AIChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<AIMessage[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const { user } = useAuth()
  const { toast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Get the Supabase client once
  const supabase = getSupabaseClient()

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Save conversation to database
  const saveConversation = async (updatedMessages: AIMessage[]) => {
    if (!user) return

    try {
      if (conversationId) {
        // Update existing conversation
        await supabase
          .from("ai_conversations")
          .update({
            messages: updatedMessages,
          })
          .eq("id", conversationId)
      } else {
        // Create new conversation
        const { data, error } = await supabase
          .from("ai_conversations")
          .insert({
            user_id: user.id,
            messages: updatedMessages,
          })
          .select()
          .single()

        if (error) throw error
        if (data) setConversationId(data.id)
      }
    } catch (error) {
      console.error("Error saving conversation:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: AIMessage = { role: "user", content: input }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput("")
    setIsLoading(true)

    try {
      const { response, error } = await generateAIResponse(updatedMessages, user?.id, initialContext)

      if (error) {
        console.error("Error generating AI response:", error)
        toast({
          title: "Error",
          description: "Failed to generate AI response",
          variant: "destructive",
        })
      }

      const assistantMessage: AIMessage = { role: "assistant", content: response }
      const finalMessages = [...updatedMessages, assistantMessage]
      setMessages(finalMessages)

      // Save conversation to database
      if (user) {
        saveConversation(finalMessages)
      }
    } catch (error) {
      console.error("Error in AI chat:", error)
      const errorMessage: AIMessage = {
        role: "assistant",
        content: "I'm sorry, I encountered an error. Please try again later.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (isMinimized) {
      setIsMinimized(false)
    }
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const clearChat = () => {
    setMessages([])
    setConversationId(null)
  }

  return (
    <>
      {/* Chat button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={toggleChat}
          className="h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700"
          aria-label="Open AI Chat"
        >
          <Bot className="h-6 w-6" />
        </Button>
      </motion.div>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-80 md:w-96"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? "auto" : "500px",
            }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="shadow-xl border-blue-100 overflow-hidden h-full flex flex-col">
              <CardHeader className="py-3 px-4 bg-blue-600 text-white flex flex-row justify-between items-center">
                <CardTitle className="text-base font-medium flex items-center">
                  <Bot className="h-5 w-5 mr-2" />
                  {title}
                </CardTitle>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-white hover:bg-blue-700 rounded-full"
                    onClick={clearChat}
                    title="Clear chat"
                  >
                    <History className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-white hover:bg-blue-700 rounded-full"
                    onClick={toggleMinimize}
                  >
                    {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-white hover:bg-blue-700 rounded-full"
                    onClick={toggleChat}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <AnimatePresence>
                {!isMinimized && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="flex-1 flex flex-col"
                  >
                    <CardContent className="flex-1 overflow-y-auto p-4 bg-gray-50">
                      <div className="space-y-4">
                        {messages.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <Bot className="h-12 w-12 mx-auto mb-3 text-blue-600 opacity-80" />
                            <p>Hi! I'm your Nexcart AI assistant.</p>
                            <p className="text-sm">How can I help you today?</p>
                          </div>
                        ) : (
                          messages.map((msg, index) => (
                            <ChatMessage
                              key={index}
                              type={msg.role === "user" ? "user" : "ai"}
                              message={msg.content}
                              isTyping={index === messages.length - 1 && isLoading && msg.role === "assistant"}
                            />
                          ))
                        )}
                        {isLoading && messages[messages.length - 1]?.role === "user" && (
                          <ChatMessage type="ai" message="" isTyping={true} />
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    </CardContent>

                    <CardFooter className="p-2 border-t bg-white">
                      <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
                        <Input
                          placeholder="Type your message..."
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          disabled={isLoading}
                          className="flex-1"
                        />
                        <Button
                          type="submit"
                          size="icon"
                          disabled={isLoading || !input.trim()}
                          className={`h-9 w-9 rounded-full ${
                            isLoading || !input.trim() ? "bg-gray-300" : "bg-blue-600 hover:bg-blue-700"
                          }`}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </form>
                    </CardFooter>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
