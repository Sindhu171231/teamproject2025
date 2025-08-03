"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Package,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Plus,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  Users,
  Settings,
  LogOut,
  Bell,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

// Mock data for seller dashboard
const salesStats = {
  totalRevenue: 15420.5,
  totalOrders: 89,
  totalProducts: 24,
  totalCustomers: 156,
}

const recentOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    product: "Wireless Headphones",
    amount: 79.99,
    status: "Processing",
    date: "2024-01-15",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    product: "Smart Watch",
    amount: 199.99,
    status: "Shipped",
    date: "2024-01-14",
  },
  {
    id: "ORD-003",
    customer: "Mike Johnson",
    product: "Cotton T-Shirt",
    amount: 24.99,
    status: "Delivered",
    date: "2024-01-13",
  },
]

const products = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    price: 79.99,
    stock: 45,
    sold: 123,
    status: "Active",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: 199.99,
    stock: 12,
    sold: 67,
    status: "Active",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 3,
    name: "Organic Cotton T-Shirt",
    price: 24.99,
    stock: 0,
    sold: 234,
    status: "Out of Stock",
    image: "/placeholder.svg?height=60&width=60",
  },
]

export default function SellerDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
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
              <Badge variant="secondary" className="ml-2">
                Seller
              </Badge>
            </Link>

            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>TS</AvatarFallback>
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
                  <AvatarFallback>TS</AvatarFallback>
                </Avatar>
                <CardTitle>{user?.name || "TechStore Pro"}</CardTitle>
                <CardDescription>Premium Electronics Seller</CardDescription>
                <Badge className="mt-2">Verified Seller</Badge>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Package className="h-4 w-4 mr-2" />
                    Products
                  </Button>
                  <Link href="/seller/orders">
                    <Button variant="ghost" className="w-full justify-start">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Orders
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Customers
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
          <div className="lg:col-span-3 space-y-8">
            {/* Welcome Section */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">Seller Dashboard</h1>
                <p className="text-gray-600">Manage your products and track your sales</p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold">${salesStats.totalRevenue.toLocaleString()}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold">{salesStats.totalOrders}</p>
                    </div>
                    <ShoppingCart className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Products</p>
                      <p className="text-2xl font-bold">{salesStats.totalProducts}</p>
                    </div>
                    <Package className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Customers</p>
                      <p className="text-2xl font-bold">{salesStats.totalCustomers}</p>
                    </div>
                    <Users className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Recent Orders</CardTitle>
                  <Link href="/seller/orders">
                    <Button variant="outline" size="sm">
                      View All Orders
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-semibold">{order.id}</p>
                        <p className="text-sm text-gray-600">{order.customer}</p>
                        <p className="text-sm text-gray-600">{order.product}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${order.amount}</p>
                        <Badge
                          variant={
                            order.status === "Delivered"
                              ? "default"
                              : order.status === "Shipped"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {order.status}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">{order.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Products Management */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Your Products</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View All
                    </Button>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={60}
                          height={60}
                          className="rounded-md"
                        />
                        <div>
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-sm text-gray-600">Price: ${product.price}</p>
                          <p className="text-sm text-gray-600">
                            Stock: {product.stock} | Sold: {product.sold}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={product.status === "Active" ? "default" : "destructive"}>
                          {product.status}
                        </Badge>
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks to manage your store</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex-col bg-transparent">
                    <Plus className="h-6 w-6 mb-2" />
                    Add New Product
                  </Button>
                  <Button variant="outline" className="h-20 flex-col bg-transparent">
                    <Package className="h-6 w-6 mb-2" />
                    Manage Inventory
                  </Button>
                  <Button variant="outline" className="h-20 flex-col bg-transparent">
                    <BarChart3 className="h-6 w-6 mb-2" />
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
