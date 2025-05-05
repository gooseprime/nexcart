"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Search, Trash2 } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import type { UserSearch } from "@/lib/types"

export function AISearchHistory() {
  const [searches, setSearches] = useState<UserSearch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  // Get the Supabase client once
  const supabase = getSupabaseClient()

  useEffect(() => {
    if (!user) return

    const fetchSearches = async () => {
      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from("user_searches")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10)

        if (error) throw error
        setSearches(data || [])
      } catch (error) {
        console.error("Error fetching search history:", error)
        toast({
          title: "Error",
          description: "Failed to load search history",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSearches()
  }, [user, supabase, toast])

  const deleteSearch = async (id: string) => {
    try {
      const { error } = await supabase.from("user_searches").delete().eq("id", id)

      if (error) throw error

      setSearches((prev) => prev.filter((search) => search.id !== id))
      toast({
        title: "Search deleted",
        description: "The search has been removed from your history",
      })
    } catch (error) {
      console.error("Error deleting search:", error)
      toast({
        title: "Error",
        description: "Failed to delete search",
        variant: "destructive",
      })
    }
  }

  const handleSearchClick = (query: string) => {
    // Implement search functionality here
    // For now, just navigate to the search page
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Search History</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-vibrant-purple" />
        </CardContent>
      </Card>
    )
  }

  if (searches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Search History</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">No search history yet</p>
          <p className="text-sm text-gray-400 mt-2">Your AI-powered searches will appear here</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Searches</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {searches.map((search) => {
            // Format the date
            const date = new Date(search.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })

            return (
              <motion.div
                key={search.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleSearchClick(search.query)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{search.query}</p>
                    <p className="text-sm text-gray-500 mt-1">{date}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-red-500"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteSearch(search.id)
                    }}
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
