"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import { toast } from "sonner"

export interface CartItem {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  seller: string
  category: string
  stock: number
  quantity: number
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}

type CartAction =
  | { type: "ADD_ITEM"; payload: { item: Omit<CartItem, "quantity">; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartState }

interface CartContextType {
  items: CartItem[]
  total: number
  itemCount: number
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  isInCart: (id: string) => boolean
  getItemQuantity: (id: string) => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const { item, quantity } = action.payload
      const existingItemIndex = state.items.findIndex((cartItem) => cartItem.id === item.id)

      if (existingItemIndex > -1) {
        // Item already exists, update quantity
        const updatedItems = [...state.items]
        const existingItem = updatedItems[existingItemIndex]
        const newQuantity = Math.min(existingItem.quantity + quantity, item.stock)

        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
        }

        const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)

        return {
          items: updatedItems,
          total,
          itemCount,
        }
      } else {
        // New item
        const newItem: CartItem = {
          ...item,
          quantity: Math.min(quantity, item.stock),
        }

        const updatedItems = [...state.items, newItem]
        const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)

        return {
          items: updatedItems,
          total,
          itemCount,
        }
      }
    }

    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter((item) => item.id !== action.payload.id)
      const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)

      return {
        items: updatedItems,
        total,
        itemCount,
      }
    }

    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload

      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        return cartReducer(state, { type: "REMOVE_ITEM", payload: { id } })
      }

      const updatedItems = state.items.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            quantity: Math.min(quantity, item.stock),
          }
        }
        return item
      })

      const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)

      return {
        items: updatedItems,
        total,
        itemCount,
      }
    }

    case "CLEAR_CART":
      return {
        items: [],
        total: 0,
        itemCount: 0,
      }

    case "LOAD_CART":
      return action.payload

    default:
      return state
  }
}

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("trendify-cart")
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        dispatch({ type: "LOAD_CART", payload: parsedCart })
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("trendify-cart", JSON.stringify(state))
    } catch (error) {
      console.error("Error saving cart to localStorage:", error)
    }
  }, [state])

  const addToCart = (item: Omit<CartItem, "quantity">, quantity = 1) => {
    if (quantity <= 0) {
      toast.error("Invalid quantity")
      return
    }

    if (quantity > item.stock) {
      toast.error(`Only ${item.stock} items available in stock`)
      return
    }

    const existingItem = state.items.find((cartItem) => cartItem.id === item.id)
    const currentQuantity = existingItem ? existingItem.quantity : 0
    const totalQuantity = currentQuantity + quantity

    if (totalQuantity > item.stock) {
      toast.error(`Cannot add more items. Only ${item.stock - currentQuantity} more available`)
      return
    }

    dispatch({ type: "ADD_ITEM", payload: { item, quantity } })

    if (existingItem) {
      toast.success(`Updated ${item.name} quantity to ${totalQuantity}`)
    } else {
      toast.success(`Added ${item.name} to cart`)
    }
  }

  const removeFromCart = (id: string) => {
    const item = state.items.find((item) => item.id === id)
    dispatch({ type: "REMOVE_ITEM", payload: { id } })

    if (item) {
      toast.success(`Removed ${item.name} from cart`)
    }
  }

  const updateQuantity = (id: string, quantity: number) => {
    const item = state.items.find((item) => item.id === id)

    if (!item) {
      toast.error("Item not found in cart")
      return
    }

    if (quantity <= 0) {
      removeFromCart(id)
      return
    }

    if (quantity > item.stock) {
      toast.error(`Only ${item.stock} items available in stock`)
      return
    }

    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
    toast.success(`Updated ${item.name} quantity to ${quantity}`)
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
    toast.success("Cart cleared")
  }

  const getTotalItems = () => {
    return state.itemCount
  }

  const getTotalPrice = () => {
    return state.total
  }

  const isInCart = (id: string) => {
    return state.items.some((item) => item.id === id)
  }

  const getItemQuantity = (id: string) => {
    const item = state.items.find((item) => item.id === id)
    return item ? item.quantity : 0
  }

  const contextValue: CartContextType = {
    items: state.items,
    total: state.total,
    itemCount: state.itemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isInCart,
    getItemQuantity,
  }

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
