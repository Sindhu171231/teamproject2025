"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Package,
  Heart,
  TrendingUp,
  User,
  Settings,
  LogOut,
  Search,
  Bell,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  RotateCcw,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

// Mock data for testing
const mockOrders = [
  {
    id: "order-1",
    order_number: "ORD-001",
    status: "delivered",
    total_amount: 79.99,
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-18T14:20:00Z",
    shipping_address: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    payment_method: "Credit Card",
    order_items: [
      {
        id: "item-1",
        quantity: 1,
        price: 79.99,
        products: {
          id: "prod-1",
          name: "Wireless Bluetooth Headphones",
          images: ["/placeholder.svg?height=80&width=80"],
        },
      },
    ],
    canCancel: false,
    canReturn: true,
  },
  {
    id: "order-2",
    order_number: "ORD-002",
    status: "shipped",
    total_amount: 199.99,
    created_at: "2024-01-12T09:15:00Z",
    updated_at: "2024-01-14T16:45:00Z",
    shipping_address: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    payment_method: "PayPal",
    order_items: [
      {
        id: "item-2",
        quantity: 1,
        price: 199.99,
        products: {
          id: "prod-2",
          name: "Smart Fitness Watch",
          images: ["/placeholder.svg?height=80&width=80"],
        },
      },
    ],
    canCancel: false,
    canReturn: false,
  },
  {
    id: "order-3",
    order_number: "ORD-003",
    status: "processing",
    total_amount: 74.98,
    created_at: "2024-01-10T14:22:00Z",
    updated_at: "2024-01-10T14:22:00Z",
    shipping_address: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    payment_method: "Credit Card",
    order_items: [
      {
        id: "item-3",
        quantity: 2,
        price: 24.99,
        products: {
          id: "prod-3",
          name: "Organic Cotton T-Shirt",
          images: ["/placeholder.svg?height=80&width=80"],
        },
      },
      {
        id: "item-4",
        quantity: 1,
        price: 24.99,
        products: {
          id: "prod-3",
          name: "Organic Cotton T-Shirt - Blue",
          images: ["/placeholder.svg?height=80&width=80"],
        },
      },
    ],
    canCancel: true,
    canReturn: false,
  },
  {
    id: "order-4",
    order_number: "ORD-004",
    status: "cancelled",
    total_amount: 149.99,
    created_at: "2024-01-08T11:30:00Z",
    updated_at: "2024-01-09T09:15:00Z",
    shipping_address: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    payment_method: "Credit Card",
    order_items: [
      {
        id: "item-5",
        quantity: 1,
        price: 149.99,
        products: {
          id: "prod-5",
          name: "Gaming Mechanical Keyboard",
          images: ["/placeholder.svg?height=80&width=80"],
        },
      },
    ],
    canCancel: false,
    canReturn: false,
  },
  {
    id: "order-5",
    order_number: "ORD-005",
    status: "pending",
    total_amount: 329.98,
    created_at: "2024-01-20T16:45:00Z",
    updated_at: "2024-01-20T16:45:00Z",
    shipping_address: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    payment_method: "Credit Card",
    order_items: [
      {
        id: "item-6",
        quantity: 1,
        price: 299.99,
        products: {
          id: "prod-4",
          name: "Professional Camera Lens",
          images: ["/placeholder.svg?height=80&width=80"],
        },
      },
      {
        id: "item-7",
        quantity: 1,
        price: 29.99,
        products: {
          id: "prod-9",
          name: "Camera Lens Cap",
          images: ["/placeholder.svg?height=80&width=80"],
        },
      },
    ],
    canCancel: true,
    canReturn: false,
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <Clock className="h-4 w-4" />
    case "processing":
      return <Package className="h-4 w-4" />
    case "shipped":
      return <Truck className="h-4 w-4" />
    case "delivered":
      return <CheckCircle className="h-4 w-4" />
    case "cancelled":
      return <XCircle className="h-4 w-4" />
    default:
      return <Package className="h-4 w-4" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "processing":
      return "bg-blue-100 text-blue-800"
    case "shipped":
      return "bg-purple-100 text-purple-800"
    case "delivered":
      return "bg-green-100 text-green-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function OrdersPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState(mockOrders)
  const [filteredOrders, setFilteredOrders] = useState(mockOrders)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let filtered = orders

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.order_items.some((item) => item.products.name.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }, [orders, searchQuery, statusFilter])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleCancelOrder = (orderId: string) => {
    if (confirm("Are you sure you want to cancel this order?")) {
      setOrders(
        orders.map((order) => (order.id === orderId ? { ...order, status: "cancelled", canCancel: false } : order)),
      )
      alert("Order cancelled successfully. Refund will be processed within 3-5 business days.")
    }
  }

  const handleReturnOrder = (orderId: string) => {
    if (confirm("Are you sure you want to return this order?")) {
      alert("Return request submitted. You will receive return instructions via email within 24 hours.")
    }
  }

  const handleReorder = (orderId: string) => {
    alert(`Reordering items from order ${orderId}`)
  }

  const handleTrackOrder = (orderId: string) => {
    router.push(`/order-confirmation/${orderId}`)
  }

  const handleContactSupport = (orderId: string) => {
    alert(`Contacting support for order ${orderId}`)
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
                <Package className="h-4 w-4" />
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
                  <Button variant="default" className="w-full justify-start">
                    <Package className="h-4 w-4 mr-2" />
                    Orders
                  </Button>
                  <Link href="/customer/wishlist">
                    <Button variant="ghost" className="w-full justify-start">
                      <Heart className="h-4 w-4 mr-2" />
                      Wishlist
                    </Button>
                  </Link>
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
              <h1 className="text-3xl font-bold mb-2">My Orders</h1>
              <p className="text-gray-600">Track and manage your orders</p>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search orders by order number or product name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Orders</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    {searchQuery || statusFilter !== "all" ? "No orders found" : "No orders yet"}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchQuery || statusFilter !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "When you place orders, they'll appear here"}
                  </p>
                  {!searchQuery && statusFilter === "all" && (
                    <Link href="/products">
                      <Button>Start Shopping</Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <Card key={order.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                        <div className="flex items-center gap-4 mb-4 lg:mb-0">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <div>
                              <h3 className="font-semibold">{order.order_number}</h3>
                              <p className="text-sm text-gray-600">
                                Placed on {new Date(order.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                          <span className="font-bold text-lg">${order.total_amount}</span>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-3 mb-4">
                        {order.order_items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                            <Image
                              src={item.products.images?.[0] || "/placeholder.svg"}
                              alt={item.products.name}
                              width={60}
                              height={60}
                              className="w-15 h-15 object-cover rounded-md"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium">{item.products.name}</h4>
                              <p className="text-sm text-gray-600">
                                Quantity: {item.quantity} × ${item.price}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">${(item.quantity * item.price).toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Shipping Address */}
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-1">Shipping Address</h4>
                        <p className="text-sm text-gray-600">
                          {order.shipping_address.street}, {order.shipping_address.city}, {order.shipping_address.state}{" "}
                          {order.shipping_address.zipCode}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2">
                        {order.status === "shipped" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTrackOrder(order.order_number)}
                            className="bg-transparent"
                          >
                            <Truck className="h-4 w-4 mr-2" />
                            Track Order
                          </Button>
                        )}
                        {order.status === "delivered" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReorder(order.id)}
                            className="bg-transparent"
                          >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Reorder
                          </Button>
                        )}
                        {order.canCancel && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelOrder(order.id)}
                            className="bg-transparent text-red-600 hover:text-red-700"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancel Order
                          </Button>
                        )}
                        {order.canReturn && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReturnOrder(order.id)}
                            className="bg-transparent"
                          >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Return Order
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleContactSupport(order.id)}
                          className="bg-transparent"
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Support
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-transparent"
                          onClick={() => handleTrackOrder(order.order_number)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Order Summary Stats */}
            {filteredOrders.length > 0 && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {orders.filter((o) => o.status === "pending").length}
                      </div>
                      <div className="text-sm text-gray-600">Pending</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {orders.filter((o) => o.status === "processing").length}
                      </div>
                      <div className="text-sm text-gray-600">Processing</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {orders.filter((o) => o.status === "shipped").length}
                      </div>
                      <div className="text-sm text-gray-600">Shipped</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {orders.filter((o) => o.status === "delivered").length}
                      </div>
                      <div className="text-sm text-gray-600">Delivered</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {orders.filter((o) => o.status === "cancelled").length}
                      </div>
                      <div className="text-sm text-gray-600">Cancelled</div>
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
