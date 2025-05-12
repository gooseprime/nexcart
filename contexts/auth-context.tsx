"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User, Session } from "@supabase/supabase-js"
import { getSupabaseClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Get the Supabase client once - but only on the client side
  const supabase = typeof window !== "undefined" ? getSupabaseClient() : null

  useEffect(() => {
    if (!supabase) return

    const setData = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()
        if (error) {
          console.error(error)
          setIsLoading(false)
          return
        }

        setSession(session)
        setUser(session?.user ?? null)
      } catch (err) {
        console.error("Error getting session:", err)
      } finally {
        setIsLoading(false)
      }
    }

    let subscription: { unsubscribe: () => void } | null = null

    try {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        router.refresh()
      })
      subscription = data.subscription
    } catch (err) {
      console.error("Error setting up auth state change listener:", err)
    }

    setData()

    return () => {
      subscription?.unsubscribe()
    }
  }, [router, supabase])

  const signUp = async (email: string, password: string, fullName: string) => {
    if (!supabase) return { error: new Error("Supabase client not available") }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })
      return { error }
    } catch (err) {
      console.error("Error during sign up:", err)
      return { error: err }
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!supabase) return { error: new Error("Supabase client not available") }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { error }
    } catch (err) {
      console.error("Error during sign in:", err)
      return { error: err }
    }
  }

  const signOut = async () => {
    if (!supabase) return

    try {
      await supabase.auth.signOut()
      router.push("/")
    } catch (err) {
      console.error("Error during sign out:", err)
    }
  }

  const value = {
    user,
    session,
    isLoading,
    signUp,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
