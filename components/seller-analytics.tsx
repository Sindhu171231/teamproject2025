"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Star,
  Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/components/auth-provider"
import { demoUsers, mockProducts } from "@/lib/mock-data"
import Link from "next/link"

interface AnalyticsData {
  revenue: {
    current: number
    previous: number
    growth: number
  }
  orders: {
    current: number
    previous: number
    growth: number
  }
  customers: {
    current: number
    previous: number
    growth: number
  }
  avgOrderValue: {
    current: number
    previous: number
    growth: number
  }
}

export function SellerAnalytics() {
  const { user } = useAuth()
  const router = useRouter()
  const [timeRange, setTimeRange] = useState("30d")
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    revenue: { current: 12450, previous: 10200, growth: 22.1 },
    orders: { current: 156, previous: 134, growth: 16.4 },
    customers: { current: 89, previous: 76, growth: 17.1 },
    avgOrderValue: { current: 79.81, previous: 76.12, growth: 4.8 },
  })

  useEffect(() => {
    // Check if user is seller by multiple methods
    const isSeller =
      user &&
      (user.email === demoUsers.seller.email ||
        user.user_metadata?.user_type === "seller" ||
        user.user_metadata?.seller_id)

    if (user && !isSeller) {
      router.push("/")
      return
    }

    loadAnalytics()
  }, [user, router, timeRange])

  const loadAnalytics = () => {
    // In a real app, this would fetch data based on timeRange
    // For demo, we'll use mock data with slight variations based on time range
    const multiplier = timeRange === "7d" ? 0.25 : timeRange === "30d" ? 1 : 3

    setAnalytics({
      revenue: {
        current: Math.round(12450 * multiplier),
        previous: Math.round(10200 * multiplier),
        growth: 22.1,
      },
      orders: {
        current: Math.round(156 * multiplier),
        previous: Math.round(134 * multiplier),
        growth: 16.4,
      },
      customers: {
        current: Math.round(89 * multiplier),
        previous: Math.round(76 * multiplier),
        growth: 17.1,
      },
      avgOrderValue: {
        current: 79.81,
        previous: 76.12,
        growth: 4.8,
      },
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    )
  }

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? "text-green-600" : "text-red-600"
  }

  if (!user || (user.email !== demoUsers.seller.email && user.user_metadata?.user_type !== "seller")) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600">Please sign in as a seller to access analytics.</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 max-w-md mx-auto mt-4">
            <p className="text-sm text-blue-800">
              <strong>Demo Seller:</strong> seller@demo.com / demo123
            </p>
          </div>
          <Link href="/auth">
            <Button>Sign In as Seller</Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="outline" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Reports</h1>
            <p className="text-gray-600">Track your store performance and growth</p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.revenue.current)}</div>
            <div className="flex items-center text-xs">
              {getGrowthIcon(analytics.revenue.growth)}
              <span className={`ml-1 ${getGrowthColor(analytics.revenue.growth)}`}>
                {analytics.revenue.growth > 0 ? "+" : ""}
                {analytics.revenue.growth}%
              </span>
              <span className="text-muted-foreground ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.orders.current}</div>
            <div className="flex items-center text-xs">
              {getGrowthIcon(analytics.orders.growth)}
              <span className={`ml-1 ${getGrowthColor(analytics.orders.growth)}`}>
                {analytics.orders.growth > 0 ? "+" : ""}
                {analytics.orders.growth}%
              </span>
              <span className="text-muted-foreground ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.customers.current}</div>
            <div className="flex items-center text-xs">
              {getGrowthIcon(analytics.customers.growth)}
              <span className={`ml-1 ${getGrowthColor(analytics.customers.growth)}`}>
                {analytics.customers.growth > 0 ? "+" : ""}
                {analytics.customers.growth}%
              </span>
              <span className="text-muted-foreground ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.avgOrderValue.current)}</div>
            <div className="flex items-center text-xs">
              {getGrowthIcon(analytics.avgOrderValue.growth)}
              <span className={`ml-1 ${getGrowthColor(analytics.avgOrderValue.growth)}`}>
                {analytics.avgOrderValue.growth > 0 ? "+" : ""}
                {analytics.avgOrderValue.growth}%
              </span>
              <span className="text-muted-foreground ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Products</CardTitle>
            <CardDescription>Best sellers in the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockProducts
                .filter((p) => p.seller_id === "2")
                .slice(0, 5)
                .map((product, index) => {
                  const sales = Math.floor(Math.random() * 100) + 20
                  const revenue = sales * product.price
                  return (
                    <div key={product.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-xs text-gray-600">{sales} units sold</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(revenue)}</p>
                        <p className="text-xs text-gray-600">{formatCurrency(product.price)}/unit</p>
                      </div>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Average Rating</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">4.8/5.0</p>
                  <p className="text-xs text-gray-600">Based on 247 reviews</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Conversion Rate</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">3.2%</p>
                  <p className="text-xs text-green-600">+0.4% from last period</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Return Rate</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">2.1%</p>
                  <p className="text-xs text-gray-600">Industry avg: 8.9%</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Customer Retention</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">68%</p>
                  <p className="text-xs text-green-600">+5% from last period</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">Avg. Response Time</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">1.2 hours</p>
                  <p className="text-xs text-gray-600">Target: &lt; 2 hours</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Trends</CardTitle>
            <CardDescription>Revenue growth over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">This week</span>
                <Badge className="bg-green-100 text-green-800">+15.2%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">This week</span>
                <Badge className="bg-green-100 text-green-800">+15.2%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">This month</span>
                <Badge className="bg-blue-100 text-blue-800">+22.1%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">This quarter</span>
                <Badge className="bg-purple-100 text-purple-800">+18.7%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Insights</CardTitle>
            <CardDescription>Customer behavior analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">New Customers</span>
                <span className="font-semibold">34</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Returning Customers</span>
                <span className="font-semibold">55</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Customer Lifetime Value</span>
                <span className="font-semibold">$245</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Repeat Purchase Rate</span>
                <span className="font-semibold">42%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Status</CardTitle>
            <CardDescription>Stock level overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Products</span>
                <span className="font-semibold">{mockProducts.filter((p) => p.seller_id === "2").length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Low Stock Items</span>
                <span className="font-semibold text-orange-600">
                  {mockProducts.filter((p) => p.seller_id === "2" && p.stock_count < 10).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Out of Stock</span>
                <span className="font-semibold text-red-600">
                  {mockProducts.filter((p) => p.seller_id === "2" && p.stock_count === 0).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Inventory Value</span>
                <span className="font-semibold">
                  {formatCurrency(
                    mockProducts
                      .filter((p) => p.seller_id === "2")
                      .reduce((sum, p) => sum + p.price * p.stock_count, 0),
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
