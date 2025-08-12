"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  Plus,
  Package,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  Star,
  BarChart3,
  Settings,
  Eye,
  Edit,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { mockProducts, mockSellers, demoUsers } from "@/lib/mock-data"

export function SellerDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    // Wait for auth to load
    if (!loading) {
      setIsCheckingAuth(false)
    }
  }, [loading])

  // Show loading while checking authentication
  if (loading || isCheckingAuth) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </main>
    )
  }

  // Check if user is authenticated
  if (!user) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">🔐 Authentication Required</h1>
          <p className="text-gray-600 mb-4">Please sign in to access the seller dashboard.</p>
          <Link href="/auth">
            <Button className="mt-4">Sign In</Button>
          </Link>
        </div>
      </main>
    )
  }

  // Check if user is seller by multiple methods
  const isSeller =
    user.email === demoUsers.seller.email || user.user_metadata?.user_type === "seller" || user.user_metadata?.seller_id

  console.log("🔍 Auth Debug Info:", {
    userEmail: user.email,
    userType: user.user_metadata?.user_type,
    sellerId: user.user_metadata?.seller_id,
    isSeller,
    demoSellerEmail: demoUsers.seller.email,
  })

  // Find seller info - create a default seller profile if user is marked as seller
  let sellerInfo =
    mockSellers.find((s) => s.email === user.email) || mockSellers.find((s) => s.id === user.user_metadata?.seller_id)

  // If user is marked as seller but not in mockSellers, create a default seller profile
  if (!sellerInfo && user.user_metadata?.user_type === "seller") {
    sellerInfo = {
      id: user.id,
      email: user.email || "",
      name: user.user_metadata?.name || "Seller",
      shop_name: user.user_metadata?.shop_name || `${user.user_metadata?.name || "Seller"}'s Store`,
      shop_description: "Your online store powered by Trendify",
      is_verified: true,
    }
  }

  if (!isSeller || !sellerInfo) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">🚫 Access Denied</h1>
          <p className="text-gray-600 mb-4">This seller dashboard is only accessible to authorized sellers.</p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 max-w-md mx-auto">
            <h3 className="font-semibold text-blue-800 mb-2">Demo Seller Credentials:</h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p>
                <strong>Email:</strong> seller@demo.com
              </p>
              <p>
                <strong>Password:</strong> demo123
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 max-w-md mx-auto">
            <h3 className="font-semibold text-yellow-800 mb-2">Current User Info:</h3>
            <div className="text-sm text-yellow-700 space-y-1">
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>User Type:</strong> {user.user_metadata?.user_type || "Not set"}
              </p>
              <p>
                <strong>Is Seller:</strong> {isSeller ? "Yes" : "No"}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Link href="/auth">
              <Button className="mr-2">Sign In as Seller</Button>
            </Link>
            <Button variant="outline" onClick={() => router.push("/")}>
              Go to Homepage
            </Button>
          </div>
        </div>
      </main>
    )
  }

  // Get seller's products using the seller ID
  const sellerProducts = mockProducts.filter((p) => p.seller_id === sellerInfo.id)
  const totalRevenue = 15420.5
  const monthlyOrders = 89
  const pendingOrders = 12
  const lowStockItems = sellerProducts.filter((p) => p.stock_count < 10).length

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Success Message */}
      <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm text-green-800">
          ✅ <strong>Authentication Successful!</strong> Welcome to your seller dashboard.
        </p>
      </div>

      {/* Seller Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">🏪 Seller Dashboard</h1>
            <p className="text-lg text-gray-600">
              Welcome back, <span className="font-semibold text-blue-600">{sellerInfo.shop_name}</span>!
              <span className="text-sm text-gray-500 ml-2">({sellerInfo.name})</span>
            </p>
            <p className="text-sm text-gray-500">{sellerInfo.shop_description}</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => router.push("/seller/add-product")} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
            <Button variant="outline" onClick={() => router.push("/seller/analytics")}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </div>
        </div>
      </div>

      {/* Business Metrics - Seller Specific */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +23.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Products</CardTitle>
            <Package className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{sellerProducts.length}</div>
            <p className="text-xs text-blue-600">Active listings in store</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders This Month</CardTitle>
            <ShoppingCart className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{monthlyOrders}</div>
            <p className="text-xs text-orange-600">{pendingOrders} pending orders</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Store Rating</CardTitle>
            <Star className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">4.8</div>
            <p className="text-xs text-yellow-600">Based on 247 reviews</p>
          </CardContent>
        </Card>
      </div>

      {/* Urgent Actions Alert */}
      {(lowStockItems > 0 || pendingOrders > 0) && (
        <Card className="mb-8 bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-red-500 mt-1" />
              <div className="flex-1">
                <h3 className="font-bold text-red-800 text-lg">⚠️ Urgent Actions Required</h3>
                <div className="mt-2 space-y-2">
                  {pendingOrders > 0 && (
                    <p className="text-red-700">
                      • <strong>{pendingOrders} orders</strong> are waiting for processing
                      <Button
                        variant="link"
                        className="p-0 ml-2 text-red-800 underline"
                        onClick={() => router.push("/seller/orders")}
                      >
                        Process Now →
                      </Button>
                    </p>
                  )}
                  {lowStockItems > 0 && (
                    <p className="text-red-700">
                      • <strong>{lowStockItems} products</strong> are running low on stock
                      <Button
                        variant="link"
                        className="p-0 ml-2 text-red-800 underline"
                        onClick={() => router.push("/seller/inventory")}
                      >
                        Restock Now →
                      </Button>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Seller Management Tools */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Business Management
            </CardTitle>
            <CardDescription>Core seller operations and tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => router.push("/seller/inventory")}
              className="w-full justify-start h-12 bg-blue-600 hover:bg-blue-700"
            >
              <Package className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Inventory Management</div>
                <div className="text-xs opacity-90">
                  {sellerProducts.length} products • {lowStockItems} low stock
                </div>
              </div>
            </Button>

            <Button
              onClick={() => router.push("/seller/orders")}
              variant="outline"
              className="w-full justify-start h-12 bg-transparent"
            >
              <ShoppingCart className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Order Management</div>
                <div className="text-xs text-gray-600">
                  {monthlyOrders} total • {pendingOrders} pending
                </div>
              </div>
            </Button>

            <Button
              onClick={() => router.push("/seller/analytics")}
              variant="outline"
              className="w-full justify-start h-12 bg-transparent"
            >
              <BarChart3 className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Sales Analytics</div>
                <div className="text-xs text-gray-600">Revenue reports & insights</div>
              </div>
            </Button>

            <Button
              onClick={() => router.push("/seller/add-product")}
              variant="outline"
              className="w-full justify-start h-12 bg-transparent"
            >
              <Plus className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Add New Product</div>
                <div className="text-xs text-gray-600">Expand your catalog</div>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Quick Product Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  My Product Catalog
                </CardTitle>
                <CardDescription>Your active product listings</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push("/seller/inventory")}>
                Manage All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sellerProducts.slice(0, 4).map((product) => (
                <div key={product.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm line-clamp-1">{product.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-green-600">${product.price}</span>
                      <Badge variant={product.stock_count < 10 ? "destructive" : "secondary"}>
                        {product.stock_count} in stock
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button size="sm" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Business Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Business Performance Summary
          </CardTitle>
          <CardDescription>Key metrics and performance indicators for {sellerInfo.shop_name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">$1,847</div>
              <div className="text-sm text-green-700">Average Order Value</div>
              <div className="text-xs text-green-600 mt-1">+12% vs last month</div>
            </div>

            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">94%</div>
              <div className="text-sm text-blue-700">Customer Satisfaction</div>
              <div className="text-xs text-blue-600 mt-1">Based on reviews</div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">2.3 days</div>
              <div className="text-sm text-purple-700">Avg. Fulfillment Time</div>
              <div className="text-xs text-purple-600 mt-1">Industry leading</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
