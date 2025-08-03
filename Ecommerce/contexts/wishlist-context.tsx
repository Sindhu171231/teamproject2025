"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { toast } from "sonner"

export interface WishlistItem {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating: number
  reviewCount: number
  inStock: boolean
  addedAt: Date
}

interface WishlistContextType {
  items: WishlistItem[]
  addItem: (item: Omit<WishlistItem, "addedAt">) => void
  removeItem: (id: string) => void
  clearWishlist: () => void
  isInWishlist: (id: string) => boolean
  getTotalItems: () => number
  isLoading: boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem("trendify_wishlist")
      if (savedWishlist) {
        const parsedItems = JSON.parse(savedWishlist)
        // Convert addedAt strings back to Date objects
        const itemsWithDates = parsedItems.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt),
        }))
        setItems(itemsWithDates)
      }
    } catch (error) {
      console.error("Error loading wishlist from localStorage:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save wishlist to localStorage whenever items change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("trendify_wishlist", JSON.stringify(items))
    }
  }, [items, isLoading])

  const addItem = (item: Omit<WishlistItem, "addedAt">) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((wishlistItem) => wishlistItem.id === item.id)

      if (existingItem) {
        toast.info(`${item.name} is already in your wishlist`)
        return currentItems
      }

      toast.success(`Added ${item.name} to wishlist`)
      return [...currentItems, { ...item, addedAt: new Date() }]
    })
  }

  const removeItem = (id: string) => {
    setItems((currentItems) => {
      const item = currentItems.find((item) => item.id === id)
      if (item) {
        toast.success(`Removed ${item.name} from wishlist`)
      }
      return currentItems.filter((item) => item.id !== id)
    })
  }

  const clearWishlist = () => {
    setItems([])
    toast.success("Wishlist cleared")
  }

  const isInWishlist = (id: string) => {
    return items.some((item) => item.id === id)
  }

  const getTotalItems = () => {
    return items.length
  }

  const value: WishlistContextType = {
    items,
    addItem,
    removeItem,
    clearWishlist,
    isInWishlist,
    getTotalItems,
    isLoading,
  }

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}

export default WishlistContext
