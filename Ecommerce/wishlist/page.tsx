"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ShoppingCart,
  Heart,
  Star,
  TrendingUp,
  User,
  Settings,
  LogOut,
  Search,
  Bell,
  Trash2,
  Package,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock data for testing
const mockWishlistItems = [
  {
    id: "wish-1",
    customer_id: "user-1",
    product_id: "prod-4",
    created_at: "2024-01-20",
    products: {
      id: "prod-4",
      name: "Professional Camera Lens",
      price: 299.99,
      original_price: 399.99,
      rating: 4.8,
      review_count: 234,
      images: ["/placeholder.svg?height=200&width=200"],
      stock: 8,
      sellers: {
        business_name: "PhotoPro Equipment",
      },
    },
  },
  {
    id: "wish-2",
    customer_id: "user-1",
    product_id: "prod-5",
    created_at: "2024-01-18",
    products: {
      id: "prod-5",
      name: "Gaming Mechanical Keyboard",
      price: 149.99,
      original_price: 179.99,
      rating: 4.6,
      review_count: 892,
      images: ["/placeholder.svg?height=200&width=200"],
      stock: 25,
      sellers: {
        business_name: "GameTech",
      },
    },
  },
  {
    id: "wish-3",
    customer_id: "user-1",
    product_id: "prod-6",
    created_at: "2024-01-15",
    products: {
      id: "prod-6",
      name: "Wireless Charging Pad",
      price: 39.99,
      original_price: 49.99,
      rating: 4.2,
      review_count: 445,
      images: ["/placeholder.svg?height=200&width=200"],
      stock: 0,
      sellers: {
        business_name: "ChargeTech",
      },
    },
  },
  {
    id: "wish-4",
    customer_id: "user-1",
    product_id: "prod-7",
    created_at: "2024-01-12",
    products: {
      id: "prod-7",
      name: "Bluetooth Wireless Earbuds",
      price: 89.99,
      original_price: 119.99,
      rating: 4.4,
      review_count: 567,
      images: ["/placeholder.svg?height=200&width=200"],
      stock: 15,
      sellers: {
        business_name: "AudioTech Pro",
      },
    },
  },
  {
    id: "wish-5",
    customer_id: "user-1",
    product_id: "prod-8",
    created_at: "2024-01-10",
    products: {
      id: "prod-8",
      name: "Smart Home Security Camera",
      price: 129.99,
      original_price: 159.99,
      rating: 4.5,
      review_count: 324,
      images: ["/placeholder.svg?height=200&width=200"],
      stock: 12,
      sellers: {
        business_name: "SecureTech",
      },
    },
  },
]

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState(mockWishlistItems)
  const [isLoading, setIsLoading] = useState(false)

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      setIsLoading(true)
      // In a real app, this would use the actual user ID from auth
      // await removeFromWishlist("user-1", productId)

      // For now, just remove from local state
      setWishlistItems((prev) => prev.filter((item) => item.product_id !== productId))
    } catch (error) {
      console.error("Error removing from wishlist:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToCart = async (productId: string) => {
    try {
      setIsLoading(true)
      // In a real app, this would use the actual user ID from auth
      // await addToCart("user-1", productId, 1)
      alert("Item added to cart!")
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setIsLoading(false)
    }
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
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <ShoppingCart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>JD</AvatarFallback>
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
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <CardTitle>John Doe</CardTitle>
                <p className="text-sm text-gray-600">john.doe@example.com</p>
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
                  <Button variant="ghost" className="w-full justify-start text-red-600">
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
              <p className="text-gray-600">
                {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved for later
              </p>
            </div>

            {wishlistItems.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
                  <p className="text-gray-600 mb-6">
                    Save items you love to your wishlist and never lose track of them
                  </p>
                  <Link href="/products">
                    <Button>Start Shopping</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {wishlistItems.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        <div className="relative">
                          <Image
                            src={item.products.images?.[0] || "/placeholder.svg"}
                            alt={item.products.name}
                            width={120}
                            height={120}
                            className="w-30 h-30 object-cover rounded-md"
                          />
                          {item.products.stock === 0 && (
                            <Badge className="absolute top-2 left-2 bg-red-500">Out of Stock</Badge>
                          )}
                        </div>

                        <div className="flex-1 space-y-3">
                          <div>
                            <h3 className="text-lg font-semibold hover:text-blue-600 cursor-pointer">
                              {item.products.name}
                            </h3>
                            <p className="text-sm text-gray-600">by {item.products.sellers.business_name}</p>
                          </div>

                          <div className="flex items-center gap-1">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(item.products.rating)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">({item.products.review_count})</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold">${item.products.price}</span>
                            {item.products.original_price && (
                              <span className="text-lg text-gray-500 line-through">
                                ${item.products.original_price}
                              </span>
                            )}
                            {item.products.original_price && (
                              <Badge variant="secondary">
                                {Math.round(
                                  ((item.products.original_price - item.products.price) /
                                    item.products.original_price) *
                                    100,
                                )}
                                % off
                              </Badge>
                            )}
                          </div>

                          <p className="text-sm text-gray-500">
                            Added on {new Date(item.created_at).toLocaleDateString()}
                          </p>

                          <div className="flex gap-3 pt-2">
                            <Button
                              onClick={() => handleAddToCart(item.product_id)}
                              disabled={item.products.stock === 0 || isLoading}
                              className="flex-1"
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              {item.products.stock === 0 ? "Out of Stock" : "Add to Cart"}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleRemoveFromWishlist(item.product_id)}
                              disabled={isLoading}
                              className="bg-transparent"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Recommendations */}
            {wishlistItems.length > 0 && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>You might also like</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="border rounded-lg p-4">
                        <Image
                          src="/placeholder.svg?height=100&width=100"
                          alt="Recommended product"
                          width={100}
                          height={100}
                          className="w-full h-24 object-cover rounded-md mb-2"
                        />
                        <h4 className="font-semibold text-sm mb-1">Recommended Product {i}</h4>
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">4.{i + 2}</span>
                        </div>
                        <p className="text-lg font-bold mb-2">${(29.99 + i * 10).toFixed(2)}</p>
                        <Button size="sm" className="w-full">
                          Add to Cart
                        </Button>
                      </div>
                    ))}
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
