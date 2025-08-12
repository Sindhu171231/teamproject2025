"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, Heart, Package, Star, TrendingUp, Clock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { mockProducts, type Product } from "@/lib/mock-data"

export function CustomerDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [recentOrders, setRecentOrders] = useState<any[]>([])

  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([])

  useEffect(() => {
    // Get recommended products (trending items)
    const recommended = mockProducts.filter((p) => p.is_trending).slice(0, 4)
    setRecommendedProducts(recommended)

    // Load real orders from localStorage
    if (user) {
      const userOrders = JSON.parse(localStorage.getItem(`orders_${user.id}`) || "[]")
      setRecentOrders(userOrders.slice(0, 3)) // Show only the 3 most recent orders
    }
  }, [user])

  if (!user) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p className="text-gray-600">Sign in to access your customer dashboard.</p>
          <Link href="/auth">
            <Button className="mt-4">Sign In</Button>
          </Link>
        </div>
      </main>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "Shipped":
        return <Package className="h-4 w-4 text-blue-500" />
      case "Processing":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <Package className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800"
      case "Shipped":
        return "bg-blue-100 text-blue-800"
      case "Processing":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user.user_metadata?.name || user.email}!</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wishlist Items</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Items saved for later</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,247</div>
            <p className="text-xs text-muted-foreground">This year</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Your latest purchases</CardDescription>
              </div>
              <Link href="/orders">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span className="font-semibold">{order.id}</span>
                      </div>
                      <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    </div>

                    <div className="space-y-2 mb-3">
                      {order.items.slice(0, 2).map((item: any, index: number) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="relative w-10 h-10 flex-shrink-0">
                            <Image
                              src={item.product_image || "/placeholder.svg"}
                              alt={item.product_name}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium line-clamp-1">{item.product_name}</p>
                            <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <p className="text-xs text-gray-500">+{order.items.length - 2} more items</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{new Date(order.order_date).toLocaleDateString()}</span>
                      <span className="font-semibold">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No recent orders</p>
                  <p className="text-sm">Place your first order to see it here!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recommended Products */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recommended for You</CardTitle>
                <CardDescription>Based on your browsing history</CardDescription>
              </div>
              <Link href="/products">
                <Button variant="outline" size="sm">
                  Browse All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {recommendedProducts.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <div className="group border rounded-lg p-3 hover:shadow-md transition-shadow">
                    <div className="relative aspect-square mb-2 overflow-hidden rounded">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                      {product.discount_percentage && (
                        <Badge className="absolute top-1 left-1 bg-red-500 text-xs">
                          -{product.discount_percentage}%
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-medium text-sm line-clamp-2 mb-1">{product.name}</h3>
                    <div className="flex items-center gap-1 mb-1">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-xs text-gray-600">(4.8)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">${product.price}</span>
                      {product.original_price && (
                        <span className="text-xs text-gray-500 line-through">${product.original_price}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your account and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/orders">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                <Package className="h-6 w-6" />
                <span className="text-sm">My Orders</span>
              </Button>
            </Link>
            <Link href="/wishlist">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                <Heart className="h-6 w-6" />
                <span className="text-sm">Wishlist</span>
              </Button>
            </Link>
            <Link href="/account">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                <Star className="h-6 w-6" />
                <span className="text-sm">Account</span>
              </Button>
            </Link>
            <Link href="/deals">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                <TrendingUp className="h-6 w-6" />
                <span className="text-sm">Hot Deals</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
