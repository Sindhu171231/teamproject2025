"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import { isSupabaseConfigured } from "@/lib/supabase"
import { demoUsers, mockSellers } from "@/lib/mock-data"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, userData: any) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.warn("Supabase is not configured. Running in demo mode.")

      // Load demo user from localStorage immediately
      const savedUser = localStorage.getItem("demo_user")
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser)
          setUser(parsedUser)
        } catch (error) {
          console.error("Error parsing saved user:", error)
          localStorage.removeItem("demo_user")
        }
      }
      setLoading(false)
      return
    }

    // Get initial session for Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    // Demo mode authentication
    if (!isSupabaseConfigured()) {
      const demoUser = Object.values(demoUsers).find((u) => u.email === email && u.password === password)
      if (demoUser) {
        // Create a proper mock user object with seller information
        const sellerInfo = mockSellers.find((s) => s.email === email)

        const mockUser = {
          id: demoUser.id,
          email: demoUser.email,
          user_metadata: {
            name: demoUser.name,
            user_type: demoUser.user_type,
            seller_id: sellerInfo?.id || null,
            shop_name: sellerInfo?.shop_name || null,
          },
          app_metadata: {},
          aud: "authenticated",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          email_confirmed_at: new Date().toISOString(),
          phone_confirmed_at: null,
          confirmation_sent_at: null,
          recovery_sent_at: null,
          email_change_sent_at: null,
          new_email: null,
          invited_at: null,
          action_link: null,
          email_change: null,
          phone_change: null,
          phone: null,
          confirmed_at: new Date().toISOString(),
          email_change_confirm_status: 0,
          banned_until: null,
          reauthentication_sent_at: null,
          is_sso_user: false,
          deleted_at: null,
          is_anonymous: false,
        } as User

        setUser(mockUser)
        localStorage.setItem("demo_user", JSON.stringify(mockUser))
        return
      } else {
        throw new Error("Invalid demo credentials. Use customer@demo.com or seller@demo.com with password: demo123")
      }
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signUp = async (email: string, password: string, userData: any) => {
    if (!isSupabaseConfigured()) {
      throw new Error("Supabase is not configured. Please set up your environment variables.")
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    })
    if (error) throw error
  }

  const signOut = async () => {
    if (!isSupabaseConfigured()) {
      setUser(null)
      localStorage.removeItem("demo_user")
      return
    }
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
