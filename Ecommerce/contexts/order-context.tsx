"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import { toast } from "sonner"

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

export interface ShippingAddress {
  fullName: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
  country: string
}

export interface Order {
  orderId: string
  customerId: string
  customerName: string
  customerEmail: string
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  tax: number
  total: number
  shippingAddress: ShippingAddress
  paymentMethod: string
  deliveryOption: string
  specialInstructions?: string
  status: "placed" | "processing" | "shipped" | "out_for_delivery" | "delivered" | "cancelled"
  createdAt: string
  updatedAt: string
  estimatedDelivery?: string
  trackingNumber?: string
}

interface OrderState {
  orders: Order[]
  currentOrder: Order | null
}

type OrderAction =
  | { type: "ADD_ORDER"; payload: Order }
  | { type: "UPDATE_ORDER_STATUS"; payload: { orderId: string; status: Order["status"] } }
  | { type: "SET_CURRENT_ORDER"; payload: Order | null }
  | { type: "LOAD_ORDERS"; payload: Order[] }

interface OrderContextType {
  orders: Order[]
  currentOrder: Order | null
  addOrder: (order: Omit<Order, "orderId" | "createdAt" | "updatedAt">) => void
  updateOrderStatus: (orderId: string, status: Order["status"]) => void
  setCurrentOrder: (order: Order | null) => void
  getOrderById: (orderId: string) => Order | undefined
  getOrdersByCustomer: (customerId: string) => Order[]
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

const orderReducer = (state: OrderState, action: OrderAction): OrderState => {
  switch (action.type) {
    case "ADD_ORDER": {
      const newOrder = {
        ...action.payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      return {
        ...state,
        orders: [newOrder, ...state.orders],
        currentOrder: newOrder,
      }
    }

    case "UPDATE_ORDER_STATUS": {
      const updatedOrders = state.orders.map((order) => {
        if (order.orderId === action.payload.orderId) {
          return {
            ...order,
            status: action.payload.status,
            updatedAt: new Date().toISOString(),
          }
        }
        return order
      })

      const updatedCurrentOrder = state.currentOrder?.orderId === action.payload.orderId
        ? {
            ...state.currentOrder,
            status: action.payload.status,
            updatedAt: new Date().toISOString(),
          }
        : state.currentOrder

      return {
        ...state,
        orders: updatedOrders,
        currentOrder: updatedCurrentOrder,
      }
    }

    case "SET_CURRENT_ORDER":
      return {
        ...state,
        currentOrder: action.payload,
      }

    case "LOAD_ORDERS":
      return {
        ...state,
        orders: action.payload,
      }

    default:
      return state
  }
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
}

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(orderReducer, initialState)

  // Load orders from localStorage on mount
  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem("trendify-orders")
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders)
        dispatch({ type: "LOAD_ORDERS", payload: parsedOrders })
      }
    } catch (error) {
      console.error("Error loading orders from localStorage:", error)
    }
  }, [])

  // Save orders to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("trendify-orders", JSON.stringify(state.orders))
    } catch (error) {
      console.error("Error saving orders to localStorage:", error)
    }
  }, [state.orders])

  const addOrder = (orderData: Omit<Order, "orderId" | "createdAt" | "updatedAt">) => {
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const newOrder: Order = {
      ...orderData,
      orderId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    dispatch({ type: "ADD_ORDER", payload: newOrder })
    toast.success(`Order ${orderId} placed successfully!`)
  }

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    dispatch({ type: "UPDATE_ORDER_STATUS", payload: { orderId, status } })
    
    const statusMessages = {
      placed: "Order placed successfully",
      processing: "Order is being processed",
      shipped: "Order has been shipped",
      out_for_delivery: "Order is out for delivery",
      delivered: "Order has been delivered",
      cancelled: "Order has been cancelled",
    }
    
    toast.success(statusMessages[status])
  }

  const setCurrentOrder = (order: Order | null) => {
    dispatch({ type: "SET_CURRENT_ORDER", payload: order })
  }

  const getOrderById = (orderId: string) => {
    return state.orders.find((order) => order.orderId === orderId)
  }

  const getOrdersByCustomer = (customerId: string) => {
    return state.orders.filter((order) => order.customerId === customerId)
  }

  const contextValue: OrderContextType = {
    orders: state.orders,
    currentOrder: state.currentOrder,
    addOrder,
    updateOrderStatus,
    setCurrentOrder,
    getOrderById,
    getOrdersByCustomer,
  }

  return <OrderContext.Provider value={contextValue}>{children}</OrderContext.Provider>
}

export function useOrders() {
  const context = useContext(OrderContext)
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider")
  }
  return context
} 