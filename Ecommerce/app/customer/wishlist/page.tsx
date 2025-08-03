"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Heart,
  ShoppingCart,
  Star,
  Trash2,
  TrendingUp,
  User,
  Package,
  Settings,
  LogOut,
  Search,
  Bell,
  Home,
  Zap,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "../../../contexts/auth-context"
import { useWishlist } from "../../../contexts/wishlist-context"
import { useCart } from "../../../contexts/cart-context"
import { useRouter } from "next/navigation"

export default function WishlistPage() {
  const { user, logout } = useAuth()
  const { items, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCart } = useCart()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [filteredItems, setFilteredItems] = useState(items)

  useEffect(() => {
    if (!user || user.role !== "customer") {
      router.push("/auth/login")
      return
    }
  }, [user, router])

  useEffect(() => {
    let filtered = items

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.seller?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Sort items
    switch (sortBy) {
      case "price-low":
        filtered = [...filtered].sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered = [...filtered].sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered = [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case "name":
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        // Keep original order for "newest"
        break
    }

    setFilteredItems(filtered)
  }, [items, searchQuery, sortBy])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleAddToCart = (item: (typeof items)[0]) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      seller: item.seller,
      stock: item.stock,
    })
    alert(`${item.name} added to cart!`)
  }

  const handleRemoveFromWishlist = (itemId: string) => {
    removeFromWishlist(itemId)
  }

  const handleClearWishlist = () => {
    if (confirm("Are you sure you want to clear your entire wishlist?")) {
      clearWishlist()
    }
  }

  if (!user || user.role !== "customer") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Please login as a customer to view your wishlist.</p>
            <Link href="/auth/login">
              <Button className="w-full">Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Trendify</span>
            </Link>

            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="icon">
                  <Home className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/hot-deals">
                <Button variant="outline" size="icon">
                  <Zap className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
              <Link href="/cart">
                <Button variant="outline" size="icon">
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "C"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src="/placeholder.svg?height=80&width=80" />
                  <AvatarFallback>
                    {user?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "C"}
                  </AvatarFallback>
                </Avatar>
                <CardTitle>{user?.name || "John Doe"}</CardTitle>
                <p className="text-sm text-gray-600">{user?.email || "john.doe@example.com"}</p>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  <Link href="/customer/dashboard">
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/customer/orders">
                    <Button variant="ghost" className="w-full justify-start">
                      <Package className="h-4 w-4 mr-2" />
                      Orders
                    </Button>
                  </Link>
                  <Button variant="default" className="w-full justify-start">
                    <Heart className="h-4 w-4 mr-2" />
                    Wishlist
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-red-600" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
              <p className="text-gray-600">Items you've saved for later ({items.length} items)</p>
            </div>

            {/* Filters and Controls */}
            {items.length > 0 && (
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                      <div className="flex-1">
                        <Input
                          placeholder="Search wishlist items..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full sm:w-48">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newest">Newest First</SelectItem>
                          <SelectItem value="name">Name A-Z</SelectItem>
                          <SelectItem value="price-low">Price: Low to High</SelectItem>
                          <SelectItem value="price-high">Price: High to Low</SelectItem>
                          <SelectItem value="rating">Highest Rated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleClearWishlist}
                      className="text-red-600 hover:text-red-700 bg-transparent"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Wishlist Items */}
            {filteredItems.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    {items.length === 0 ? "Your wishlist is empty" : "No items found"}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {items.length === 0
                      ? "Save items you love to your wishlist and shop them later"
                      : "Try adjusting your search criteria"}
                  </p>
                  {items.length === 0 && (
                    <Link href="/">
                      <Button>Start Shopping</Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <Card key={item.id} className="group hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <Image
                        src={item.image || "/placeholder.svg?height=200&width=200"}
                        alt={item.name}
                        width={200}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-red-500 hover:text-red-600 bg-white/80 backdrop-blur-sm"
                        onClick={() => handleRemoveFromWishlist(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {item.name}
                          </h3>
                          {item.seller && <p className="text-sm text-gray-600">by {item.seller}</p>}
                        </div>

                        {item.rating && item.reviews && (
                          <div className="flex items-center gap-1">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(item.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">({item.reviews})</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-blue-600">${item.price}</span>
                          {item.stock !== undefined && item.stock < 10 && item.stock > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              Only {item.stock} left
                            </Badge>
                          )}
                          {item.stock === 0 && (
                            <Badge variant="secondary" className="text-xs">
                              Out of Stock
                            </Badge>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button onClick={() => handleAddToCart(item)} disabled={item.stock === 0} className="flex-1">
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            {item.stock === 0 ? "Out of Stock" : "Add to Cart"}
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleRemoveFromWishlist(item.id)}
                            className="text-red-600 hover:text-red-700 bg-transparent"
                          >
                            <Heart className="h-4 w-4 fill-current" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Wishlist Stats */}
            {items.length > 0 && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Wishlist Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{items.length}</div>
                      <div className="text-sm text-gray-600">Total Items</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        ${items.reduce((total, item) => total + item.price, 0).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">Total Value</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {items.filter((item) => (item.stock || 0) < 10 && (item.stock || 0) > 0).length}
                      </div>
                      <div className="text-sm text-gray-600">Low Stock</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {items.filter((item) => item.stock === 0).length}
                      </div>
                      <div className="text-sm text-gray-600">Out of Stock</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
