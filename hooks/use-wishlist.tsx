"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

interface WishlistItem {
  id: string
  product_id: string
}

interface WishlistContextType {
  items: WishlistItem[]
  addItem: (productId: string) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  isInWishlist: (productId: string) => boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchWishlistItems()
    } else {
      setItems([])
    }
  }, [user])

  const fetchWishlistItems = async () => {
    if (!user) return

    // If Supabase is not configured, use localStorage for demo
    if (!isSupabaseConfigured()) {
      const savedWishlist = localStorage.getItem(`wishlist_${user.id}`)
      if (savedWishlist) {
        setItems(JSON.parse(savedWishlist))
      }
      return
    }

    // Always try localStorage first
    const savedWishlist = localStorage.getItem(`wishlist_${user.id}`)
    if (savedWishlist) {
      setItems(JSON.parse(savedWishlist))
    }

    try {
      const { data, error } = await supabase.from("wishlist").select("*").eq("user_id", user.id)

      if (error) {
        console.warn("Database table 'wishlist' not found, using localStorage:", error.message)
        return // Keep using localStorage data
      }

      // Only update if we got data from Supabase
      if (data) {
        setItems(data)
      }
    } catch (error) {
      console.warn("Error fetching wishlist items, using localStorage:", error)
      // Keep using localStorage data
    }
  }

  const saveToLocalStorage = (wishlistItems: WishlistItem[]) => {
    if (user) {
      localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(wishlistItems))
    }
  }

  const addItem = async (productId: string) => {
    if (!user) throw new Error("User not authenticated")

    // Check if item already exists
    if (items.some((item) => item.product_id === productId)) {
      throw new Error("Item already in wishlist")
    }

    // Always use localStorage as primary storage
    const newItem: WishlistItem = {
      id: `local_${Date.now()}_${Math.random()}`,
      product_id: productId,
    }
    const newItems = [...items, newItem]
    setItems(newItems)
    saveToLocalStorage(newItems)

    // Only try Supabase if configured and available
    if (isSupabaseConfigured()) {
      try {
        await supabase.from("wishlist").insert({
          user_id: user.id,
          product_id: productId,
        })
      } catch (error) {
        console.warn("Supabase wishlist operation failed, using localStorage:", error)
        // Continue with localStorage - no error thrown
      }
    }
  }

  const removeItem = async (productId: string) => {
    if (!user) throw new Error("User not authenticated")

    // If Supabase is not configured, use localStorage
    if (!isSupabaseConfigured()) {
      const newItems = items.filter((item) => item.product_id !== productId)
      setItems(newItems)
      saveToLocalStorage(newItems)
      return
    }

    try {
      const { error } = await supabase.from("wishlist").delete().eq("user_id", user.id).eq("product_id", productId)

      if (error) throw error
      fetchWishlistItems()
    } catch (error) {
      console.warn("Database error, using localStorage:", error)
      const newItems = items.filter((item) => item.product_id !== productId)
      setItems(newItems)
      saveToLocalStorage(newItems)
    }
  }

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.product_id === productId)
  }

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, isInWishlist }}>{children}</WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
