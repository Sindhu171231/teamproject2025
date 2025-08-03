"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
  seller: string
  rating: number
  reviews: number
  stock: number
}

interface WishlistContextType {
  items: WishlistItem[]
  addToWishlist: (item: WishlistItem) => void
  removeFromWishlist: (id: string) => void
  clearWishlist: () => void
  isInWishlist: (id: string) => boolean
  getTotalItems: () => number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist")
    if (savedWishlist) {
      try {
        setItems(JSON.parse(savedWishlist))
      } catch (error) {
        console.error("Error loading wishlist from localStorage:", error)
      }
    }
  }, [])

  // Save wishlist to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(items))
  }, [items])

  const addToWishlist = (item: WishlistItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id)
      if (existingItem) {
        return prevItems // Item already in wishlist
      }
      return [...prevItems, item]
    })
  }

  const removeFromWishlist = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const clearWishlist = () => {
    setItems([])
  }

  const isInWishlist = (id: string) => {
    return items.some((item) => item.id === id)
  }

  const getTotalItems = () => {
    return items.length
  }

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
        getTotalItems,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
