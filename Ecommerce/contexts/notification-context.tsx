"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  timestamp: Date
  read: boolean
  actionUrl?: string
  actionText?: string
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAllNotifications: () => void
  getUnreadCount: () => number
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

// Mock notifications for demo
const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Order Shipped",
    message: "Your order #12345 has been shipped and is on its way!",
    type: "success",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
    actionUrl: "/customer/orders",
    actionText: "Track Order",
  },
  {
    id: "2",
    title: "Flash Sale Alert",
    message: "50% off on electronics! Limited time offer ending soon.",
    type: "info",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    read: false,
    actionUrl: "/hot-deals",
    actionText: "Shop Now",
  },
  {
    id: "3",
    title: "Payment Successful",
    message: "Your payment of ₹2,499 has been processed successfully.",
    type: "success",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    read: true,
    actionUrl: "/customer/orders",
    actionText: "View Order",
  },
  {
    id: "4",
    title: "Low Stock Alert",
    message: "Only 2 items left for 'Wireless Gaming Headset' in your wishlist.",
    type: "warning",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    read: false,
    actionUrl: "/customer/wishlist",
    actionText: "Buy Now",
  },
]

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)

  const addNotification = useCallback((notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    }
    setNotifications((prev) => [newNotification, ...prev])
  }, [])

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }, [])

  const clearAllNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  const getUnreadCount = useCallback(() => {
    return notifications.filter((notification) => !notification.read).length
  }, [notifications])

  const contextValue: NotificationContextType = {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    getUnreadCount,
  }

  return <NotificationContext.Provider value={contextValue}>{children}</NotificationContext.Provider>
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
