"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

interface CartItem {
  id: string
  product_id: string
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (productId: string, quantity: number) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  clearCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchCartItems()
    } else {
      setItems([])
    }
  }, [user])

  const fetchCartItems = async () => {
    if (!user) return

    // If Supabase is not configured, use localStorage for demo
    if (!isSupabaseConfigured()) {
      const savedCart = localStorage.getItem(`cart_${user.id}`)
      if (savedCart) {
        setItems(JSON.parse(savedCart))
      }
      return
    }

    // Always try localStorage first, then attempt Supabase
    const savedCart = localStorage.getItem(`cart_${user.id}`)
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }

    try {
      const { data, error } = await supabase.from("cart").select("*").eq("user_id", user.id)

      if (error) {
        console.warn("Database table 'cart' not found, using localStorage:", error.message)
        return // Keep using localStorage data
      }

      // Only update if we got data from Supabase
      if (data) {
        setItems(data)
      }
    } catch (error) {
      console.warn("Error fetching cart items, using localStorage:", error)
      // Keep using localStorage data
    }
  }

  const saveToLocalStorage = (cartItems: CartItem[]) => {
    if (user) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(cartItems))
    }
  }

  const addItem = async (productId: string, quantity: number) => {
    if (!user) throw new Error("User not authenticated")

    // Always use localStorage in demo mode or when Supabase fails
    const existingItemIndex = items.findIndex((item) => item.product_id === productId)
    let newItems: CartItem[]

    if (existingItemIndex >= 0) {
      newItems = [...items]
      newItems[existingItemIndex].quantity += quantity
    } else {
      const newItem: CartItem = {
        id: `local_${Date.now()}_${Math.random()}`,
        product_id: productId,
        quantity,
      }
      newItems = [...items, newItem]
    }

    setItems(newItems)
    saveToLocalStorage(newItems)

    // Only try Supabase if configured and available
    if (isSupabaseConfigured()) {
      try {
        const { data: existingItem } = await supabase
          .from("cart")
          .select("*")
          .eq("user_id", user.id)
          .eq("product_id", productId)
          .single()

        if (existingItem) {
          await supabase
            .from("cart")
            .update({ quantity: existingItem.quantity + quantity })
            .eq("id", existingItem.id)
        } else {
          await supabase.from("cart").insert({
            user_id: user.id,
            product_id: productId,
            quantity,
          })
        }
      } catch (error) {
        console.warn("Supabase cart operation failed, using localStorage:", error)
        // Continue with localStorage - no error thrown
      }
    }
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user) throw new Error("User not authenticated")

    // If Supabase is not configured, use localStorage
    if (!isSupabaseConfigured()) {
      const newItems = items.map((item) => (item.product_id === productId ? { ...item, quantity } : item))
      setItems(newItems)
      saveToLocalStorage(newItems)
      return
    }

    try {
      const { error } = await supabase
        .from("cart")
        .update({ quantity })
        .eq("user_id", user.id)
        .eq("product_id", productId)

      if (error) throw error
      fetchCartItems()
    } catch (error) {
      console.warn("Database error, using localStorage:", error)
      const newItems = items.map((item) => (item.product_id === productId ? { ...item, quantity } : item))
      setItems(newItems)
      saveToLocalStorage(newItems)
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
      const { error } = await supabase.from("cart").delete().eq("user_id", user.id).eq("product_id", productId)

      if (error) throw error
      fetchCartItems()
    } catch (error) {
      console.warn("Database error, using localStorage:", error)
      const newItems = items.filter((item) => item.product_id !== productId)
      setItems(newItems)
      saveToLocalStorage(newItems)
    }
  }

  const clearCart = async () => {
    if (!user) throw new Error("User not authenticated")

    // If Supabase is not configured, use localStorage
    if (!isSupabaseConfigured()) {
      setItems([])
      localStorage.removeItem(`cart_${user.id}`)
      return
    }

    try {
      const { error } = await supabase.from("cart").delete().eq("user_id", user.id)

      if (error) throw error
      setItems([])
    } catch (error) {
      console.warn("Database error, using localStorage:", error)
      setItems([])
      localStorage.removeItem(`cart_${user.id}`)
    }
  }

  return (
    <CartContext.Provider value={{ items, addItem, updateQuantity, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
