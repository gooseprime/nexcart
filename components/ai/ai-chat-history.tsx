"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, MessageSquare, Trash2 } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import type { AIConversation } from "@/lib/types"

export function AIChatHistory() {
  const [conversations, setConversations] = useState<AIConversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  // Get the Supabase client once
  const supabase = getSupabaseClient()

  useEffect(() => {
    if (!user) return

    const fetchConversations = async () => {
      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from("ai_conversations")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10)

        if (error) throw error
        setConversations(data || [])
      } catch (error) {
        console.error("Error fetching chat history:", error)
        toast({
          title: "Error",
          description: "Failed to load chat history",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchConversations()
  }, [user, supabase, toast])

  const deleteConversation = async (id: string) => {
    try {
      const { error } = await supabase.from("ai_conversations").delete().eq("id", id)

      if (error) throw error

      setConversations((prev) => prev.filter((conv) => conv.id !== id))
      toast({
        title: "Conversation deleted",
        description: "The conversation has been removed from your history",
      })
    } catch (error) {
      console.error("Error deleting conversation:", error)
      toast({
        title: "Error",
        description: "Failed to delete conversation",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chat History</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-vibrant-purple" />
        </CardContent>
      </Card>
    )
  }

  if (conversations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chat History</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">No chat history yet</p>
          <p className="text-sm text-gray-400 mt-2">Your conversations with our AI assistant will appear here</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Conversations</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {conversations.map((conversation) => {
            // Get the first user message as a preview
            const firstUserMessage = conversation.messages.find((msg) => msg.role === "user")?.content || "No message"
            // Format the date
            const date = new Date(conversation.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })

            return (
              <motion.div
                key={conversation.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{firstUserMessage}</p>
                    <p className="text-sm text-gray-500 mt-1">{date}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-red-500"
                    onClick={() => deleteConversation(conversation.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </CardContent>
    </Card>
  )
}
