"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ShoppingBag,
  Heart,
  Package,
  Star,
  TrendingUp,
  User,
  Settings,
  LogOut,
  Search,
  ShoppingCart,
  Bell,
  MapPin,
  CreditCard,
  Gift,
  Home,
  Zap,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "../../../contexts/auth-context"
import { useRouter } from "next/navigation"

// Mock data for customer dashboard
const customerStats = {
  totalOrders: 24,
  wishlistItems: 12,
  totalSpent: 1247.5,
  rewardPoints: 2450,
}

const recentOrders = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    status: "Delivered",
    total: 79.99,
    items: 2,
    image: "/placeholder.svg?height=60&width=60&text=Headphones",
    productName: "Wireless Headphones",
  },
  {
    id: "ORD-002",
    date: "2024-01-12",
    status: "In Transit",
    total: 199.99,
    items: 1,
    image: "/placeholder.svg?height=60&width=60&text=Smart+Watch",
    productName: "Smart Fitness Watch",
  },
  {
    id: "ORD-003",
    date: "2024-01-10",
    status: "Processing",
    total: 24.99,
    items: 3,
    image: "/placeholder.svg?height=60&width=60&text=Accessories",
    productName: "Phone Accessories",
  },
]

const wishlistItems = [
  {
    id: 1,
    name: "Professional Camera Lens",
    price: 299.99,
    image: "/placeholder.svg?height=80&width=80&text=Camera+Lens",
    inStock: true,
    discount: 15,
  },
  {
    id: 2,
    name: "Gaming Mechanical Keyboard",
    price: 149.99,
    image: "/placeholder.svg?height=80&width=80&text=Gaming+Keyboard",
    inStock: true,
    discount: 0,
  },
  {
    id: 3,
    name: "Wireless Charging Pad",
    price: 39.99,
    image: "/placeholder.svg?height=80&width=80&text=Charging+Pad",
    inStock: false,
    discount: 20,
  },
]

const recommendations = [
  {
    id: 1,
    name: "Bluetooth Speaker",
    price: 59.99,
    rating: 4.5,
    image: "/placeholder.svg?height=100&width=100&text=Speaker",
    reviews: 234,
  },
  {
    id: 2,
    name: "Laptop Stand",
    price: 34.99,
    rating: 4.7,
    image: "/placeholder.svg?height=100&width=100&text=Laptop+Stand",
    reviews: 189,
  },
  {
    id: 3,
    name: "Phone Case",
    price: 19.99,
    rating: 4.3,
    image: "/placeholder.svg?height=100&width=100&text=Phone+Case",
    reviews: 156,
  },
]

const recentActivity = [
  {
    id: 1,
    type: "order",
    message: "Order #ORD-001 has been delivered",
    time: "2 hours ago",
    icon: Package,
  },
  {
    id: 2,
    type: "wishlist",
    message: "Item in your wishlist is now on sale",
    time: "1 day ago",
    icon: Heart,
  },
  {
    id: 3,
    type: "reward",
    message: "You earned 50 reward points",
    time: "3 days ago",
    icon: Gift,
  },
]

export default function CustomerDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()

  // Redirect if not customer
  useEffect(() => {
    if (user && user.role !== "customer") {
      router.push("/seller/dashboard")
    }
  }, [user, router])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (user?.role !== "customer") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>This page is only accessible to customers.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button className="w-full">Go to Homepage</Button>
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
                <CardDescription>{user?.email || "john.doe@example.com"}</CardDescription>
                <Badge className="mt-2">Premium Member</Badge>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  <Button variant="default" className="w-full justify-start">
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                  <Link href="/customer/orders">
                    <Button variant="ghost" className="w-full justify-start">
                      <Package className="h-4 w-4 mr-2" />
                      My Orders
                    </Button>
                  </Link>
                  <Link href="/customer/wishlist">
                    <Button variant="ghost" className="w-full justify-start">
                      <Heart className="h-4 w-4 mr-2" />
                      Wishlist
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full justify-start">
                    <MapPin className="h-4 w-4 mr-2" />
                    Addresses
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Payment Methods
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

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Reward Points</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{customerStats.rewardPoints}</div>
                  <p className="text-sm text-gray-600">Available Points</p>
                  <Button size="sm" className="mt-2 w-full">
                    Redeem Points
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Welcome Section */}
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name?.split(" ")[0] || "Customer"}! 👋</h1>
              <p className="text-gray-600">Here's what's happening with your account</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold">{customerStats.totalOrders}</p>
                      <p className="text-xs text-green-600">+2 this month</p>
                    </div>
                    <ShoppingBag className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Wishlist Items</p>
                      <p className="text-2xl font-bold">{customerStats.wishlistItems}</p>
                      <p className="text-xs text-blue-600">3 on sale</p>
                    </div>
                    <Heart className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Spent</p>
                      <p className="text-2xl font-bold">${customerStats.totalSpent}</p>
                      <p className="text-xs text-purple-600">This year</p>
                    </div>
                    <Package className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Reward Points</p>
                      <p className="text-2xl font-bold">{customerStats.rewardPoints}</p>
                      <p className="text-xs text-orange-600">Earn more</p>
                    </div>
                    <Gift className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Recent Orders</CardTitle>
                  <Link href="/customer/orders">
                    <Button variant="outline" size="sm">
                      View All Orders
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Image
                          src={order.image || "/placeholder.svg"}
                          alt="Order item"
                          width={60}
                          height={60}
                          className="rounded-md"
                        />
                        <div>
                          <p className="font-semibold">{order.id}</p>
                          <p className="text-sm text-gray-600">{order.productName}</p>
                          <p className="text-sm text-gray-600">
                            {order.date} • {order.items} items
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${order.total}</p>
                        <Badge
                          variant={
                            order.status === "Delivered"
                              ? "default"
                              : order.status === "In Transit"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Wishlist Preview */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Your Wishlist</CardTitle>
                  <Link href="/customer/wishlist">
                    <Button variant="outline" size="sm">
                      View All Items
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {wishlistItems.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="relative">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="w-full h-20 object-cover rounded-md mb-2"
                        />
                        {item.discount > 0 && (
                          <Badge className="absolute top-2 right-2 bg-red-500">-{item.discount}%</Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-sm mb-1">{item.name}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-lg font-bold">
                          ${item.discount > 0 ? (item.price * (1 - item.discount / 100)).toFixed(2) : item.price}
                        </p>
                        {item.discount > 0 && <p className="text-sm text-gray-500 line-through">${item.price}</p>}
                      </div>
                      <Button size="sm" className="w-full" disabled={!item.inStock}>
                        {item.inStock ? "Add to Cart" : "Out of Stock"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended for You</CardTitle>
                <CardDescription>Based on your purchase history and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recommendations.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={100}
                        height={100}
                        className="w-full h-24 object-cover rounded-md mb-2"
                      />
                      <h3 className="font-semibold text-sm mb-1">{item.name}</h3>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{item.rating}</span>
                        <span className="text-xs text-gray-500">({item.reviews})</span>
                      </div>
                      <p className="text-lg font-bold mb-2">${item.price}</p>
                      <Button size="sm" className="w-full">
                        Add to Cart
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest account activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                      <div className="p-2 rounded-full bg-blue-100">
                        <activity.icon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
