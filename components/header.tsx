"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Heart, ShoppingCart, User, Menu, X, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { isSupabaseConfigured } from "@/lib/supabase"
import { demoUsers } from "@/lib/mock-data"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { user, signOut } = useAuth()
  const { items: cartItems } = useCart()
  const { items: wishlistItems } = useWishlist()
  const router = useRouter()

  const supabaseConfigured = isSupabaseConfigured()
  const isSeller = user?.email === demoUsers.seller.email || user?.user_metadata?.user_type === "seller"
  const isCustomer = user?.email === demoUsers.customer.email || user?.user_metadata?.user_type === "customer"

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  return (
    <header className="bg-white shadow-sm border-b">
      {!supabaseConfigured && (
        <div className="bg-yellow-100 border-b border-yellow-200 px-4 py-2">
          <div className="container mx-auto">
            <p className="text-sm text-yellow-800">
              <strong>Demo Mode:</strong> Supabase is not configured. Set up your environment variables to enable full
              functionality.
            </p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded"></div>
            <span className="text-xl font-bold">Trendify</span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <Button type="submit" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/products" className="text-gray-700 hover:text-gray-900">
              Products
            </Link>
            <Link href="/deals" className="text-gray-700 hover:text-gray-900 font-semibold text-red-600">
              🔥 Deals
            </Link>

            {user ? (
              <>
                <Link href="/wishlist" className="relative">
                  <Heart className="h-6 w-6 text-gray-700 hover:text-red-500" />
                  {wishlistItems.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                      {wishlistItems.length}
                    </Badge>
                  )}
                </Link>
                <Link href="/cart" className="relative">
                  <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-gray-900" />
                  {cartItems.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                    </Badge>
                  )}
                </Link>
                <div className="relative group">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span className="max-w-20 truncate">
                      {user.user_metadata?.name || (isSeller ? "Seller" : "Customer")}
                    </span>
                  </Button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    {isSeller ? (
                      <Link
                        href="/seller/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LayoutDashboard className="h-4 w-4 inline mr-2" />🏪 Seller Dashboard
                      </Link>
                    ) : (
                      <Link
                        href="/customer/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LayoutDashboard className="h-4 w-4 inline mr-2" />👤 Customer Dashboard
                      </Link>
                    )}
                    <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      My Account
                    </Link>
                    <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      My Orders
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <Link href="/auth">
                <Button>Sign In</Button>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
                <Button type="submit" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>
            <nav className="space-y-2">
              <Link href="/products" className="block py-2 text-gray-700">
                Products
              </Link>
              <Link href="/deals" className="block py-2 text-red-600 font-semibold">
                🔥 Hot Deals
              </Link>
              {user ? (
                <>
                  {isSeller ? (
                    <Link href="/seller/dashboard" className="block py-2 text-gray-700">
                      🏪 Seller Dashboard
                    </Link>
                  ) : (
                    <Link href="/customer/dashboard" className="block py-2 text-gray-700">
                      👤 Customer Dashboard
                    </Link>
                  )}
                  <Link href="/wishlist" className="block py-2 text-gray-700">
                    Wishlist
                  </Link>
                  <Link href="/cart" className="block py-2 text-gray-700">
                    Cart
                  </Link>
                  <Link href="/account" className="block py-2 text-gray-700">
                    My Account
                  </Link>
                  <Link href="/orders" className="block py-2 text-gray-700">
                    My Orders
                  </Link>
                  <button onClick={handleSignOut} className="block py-2 text-gray-700">
                    Sign Out
                  </button>
                </>
              ) : (
                <Link href="/auth" className="block py-2 text-gray-700">
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
