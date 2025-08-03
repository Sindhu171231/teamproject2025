"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface User {
  id: string
  email: string
  name: string
  role: "customer" | "seller" | "admin"
  avatar?: string
  phone?: string
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  preferences?: {
    notifications: boolean
    newsletter: boolean
    theme: "light" | "dark" | "system"
  }
  createdAt: Date
  lastLogin?: Date
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>
  isLoading: boolean
  isAuthenticated: boolean
}

interface RegisterData {
  email: string
  password: string
  name: string
  role: "customer" | "seller"
  phone?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo users for testing
const DEMO_USERS: User[] = [
  {
    id: "1",
    email: "customer@demo.com",
    name: "John Customer",
    role: "customer",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    phone: "+1 (555) 123-4567",
    address: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    preferences: {
      notifications: true,
      newsletter: true,
      theme: "system",
    },
    createdAt: new Date("2024-01-15"),
    lastLogin: new Date(),
  },
  {
    id: "2",
    email: "seller@demo.com",
    name: "Jane Seller",
    role: "seller",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    phone: "+1 (555) 987-6543",
    address: {
      street: "456 Business Ave",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90210",
      country: "USA",
    },
    preferences: {
      notifications: true,
      newsletter: false,
      theme: "light",
    },
    createdAt: new Date("2024-01-10"),
    lastLogin: new Date(),
  },
  {
    id: "3",
    email: "admin@demo.com",
    name: "Admin User",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    phone: "+1 (555) 555-0000",
    preferences: {
      notifications: true,
      newsletter: true,
      theme: "dark",
    },
    createdAt: new Date("2024-01-01"),
    lastLogin: new Date(),
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("trendify_user")
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser({
          ...userData,
          createdAt: new Date(userData.createdAt),
          lastLogin: userData.lastLogin ? new Date(userData.lastLogin) : undefined,
        })
      } catch (error) {
        console.error("Error parsing stored user data:", error)
        localStorage.removeItem("trendify_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Demo login - accept any password for demo users
      const demoUser = DEMO_USERS.find((u) => u.email === email)

      if (demoUser && password === "password") {
        const userWithUpdatedLogin = {
          ...demoUser,
          lastLogin: new Date(),
        }

        setUser(userWithUpdatedLogin)
        localStorage.setItem("trendify_user", JSON.stringify(userWithUpdatedLogin))

        return { success: true }
      }

      // For non-demo users, you would typically make an API call here
      return { success: false, error: "Invalid email or password" }
    } catch (error) {
      return { success: false, error: "Login failed. Please try again." }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Check if user already exists
      const existingUser = DEMO_USERS.find((u) => u.email === userData.email)
      if (existingUser) {
        return { success: false, error: "User with this email already exists" }
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        name: userData.name,
        role: userData.role,
        phone: userData.phone,
        preferences: {
          notifications: true,
          newsletter: true,
          theme: "system",
        },
        createdAt: new Date(),
        lastLogin: new Date(),
      }

      setUser(newUser)
      localStorage.setItem("trendify_user", JSON.stringify(newUser))

      return { success: true }
    } catch (error) {
      return { success: false, error: "Registration failed. Please try again." }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("trendify_user")
  }

  const updateProfile = async (data: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: "No user logged in" }

    setIsLoading(true)

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      const updatedUser = { ...user, ...data }
      setUser(updatedUser)
      localStorage.setItem("trendify_user", JSON.stringify(updatedUser))

      return { success: true }
    } catch (error) {
      return { success: false, error: "Failed to update profile. Please try again." }
    } finally {
      setIsLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    updateProfile,
    isLoading,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export default AuthContext
