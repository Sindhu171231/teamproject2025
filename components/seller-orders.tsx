"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { demoUsers } from "@/lib/mock-data"
import Link from "next/link"

interface SellerOrder {
  id: string
  customerName: string
  customerEmail: string
  orderDate: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  total: number
  items: Array<{
    productId: string
    productName: string
    productImage: string
    quantity: number
    price: number
  }>
}

export function SellerOrders() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [orders, setOrders] = useState<SellerOrder[]>([])
  const [filterStatus, setFilterStatus] = useState("all")

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

    loadSellerOrders()
  }, [user, router])

  const loadSellerOrders = () => {
    // Load seller orders from localStorage
    const sellerOrders = JSON.parse(localStorage.getItem(`seller_orders_${user?.id}`) || "[]")

    // Add some mock orders if none exist
    if (sellerOrders.length === 0) {
      const mockOrders: SellerOrder[] = [
        {
          id: "ORD-001",
          customerName: "John Customer",
          customerEmail: "customer@demo.com",
          orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: "delivered",
          total: 159.98,
          items: [
            {
              productId: "3",
              productName: "Wireless Bluetooth Headphones",
              productImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
              quantity: 2,
              price: 79.99,
            },
          ],
        },
        {
          id: "ORD-002",
          customerName: "Jane Smith",
          customerEmail: "jane@example.com",
          orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          status: "shipped",
          total: 149.99,
          items: [
            {
              productId: "7",
              productName: "Smart Watch",
              productImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop",
              quantity: 1,
              price: 149.99,
            },
          ],
        },
        {
          id: "ORD-003",
          customerName: "Mike Johnson",
          customerEmail: "mike@example.com",
          orderDate: new Date().toISOString(),
          status: "pending",
          total: 89.99,
          items: [
            {
              productId: "4",
              productName: "Noise-Cancelling Earbuds",
              productImage: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&h=100&fit=crop",
              quantity: 1,
              price: 89.99,
            },
          ],
        },
      ]

      localStorage.setItem(`seller_orders_${user?.id}`, JSON.stringify(mockOrders))
      setOrders(mockOrders)
    } else {
      setOrders(sellerOrders)
    }
  }

  const updateOrderStatus = (orderId: string, newStatus: SellerOrder["status"]) => {
    const updatedOrders = orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))

    setOrders(updatedOrders)
    localStorage.setItem(`seller_orders_${user?.id}`, JSON.stringify(updatedOrders))

    toast({
      title: "Order Status Updated",
      description: `Order ${orderId} status changed to ${newStatus}`,
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "processing":
        return <Package className="h-4 w-4 text-blue-500" />
      case "shipped":
        return <Package className="h-4 w-4 text-purple-500" />
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
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

  const filteredOrders = orders.filter((order) => filterStatus === "all" || order.status === filterStatus)

  if (!user || (user.email !== demoUsers.seller.email && user.user_metadata?.user_type !== "seller")) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600">Please sign in as a seller to access order management.</p>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
        <p className="text-gray-600">Manage and track your customer orders</p>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{orders.length}</p>
              <p className="text-sm text-gray-600">Total Orders</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {orders.filter((o) => o.status === "pending").length}
              </p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {orders.filter((o) => o.status === "processing").length}
              </p>
              <p className="text-sm text-gray-600">Processing</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {orders.filter((o) => o.status === "shipped").length}
              </p>
              <p className="text-sm text-gray-600">Shipped</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {orders.filter((o) => o.status === "delivered").length}
              </p>
              <p className="text-sm text-gray-600">Delivered</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
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
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(order.status)}
                    <h3 className="font-semibold text-lg">{order.id}</h3>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-gray-600">Customer: {order.customerName}</p>
                  <p className="text-gray-600">Email: {order.customerEmail}</p>
                  <p className="text-gray-600">Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">${order.total.toFixed(2)}</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <Image
                        src={item.productImage || "/placeholder.svg"}
                        alt={item.productName}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.productName}</h4>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${(item.quantity * item.price).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {order.status === "pending" && (
                    <Button size="sm" onClick={() => updateOrderStatus(order.id, "processing")}>
                      Mark as Processing
                    </Button>
                  )}
                  {order.status === "processing" && (
                    <Button size="sm" onClick={() => updateOrderStatus(order.id, "shipped")}>
                      Mark as Shipped
                    </Button>
                  )}
                  {order.status === "shipped" && (
                    <Button size="sm" onClick={() => updateOrderStatus(order.id, "delivered")}>
                      Mark as Delivered
                    </Button>
                  )}
                  {(order.status === "pending" || order.status === "processing") && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateOrderStatus(order.id, "cancelled")}
                      className="text-red-600 hover:text-red-700"
                    >
                      Cancel Order
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No orders found</p>
              <p className="text-gray-400 text-sm mt-2">
                {filterStatus === "all" ? "You haven't received any orders yet" : `No ${filterStatus} orders`}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  )
}
