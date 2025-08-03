"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  CheckCircle,
  Package,
  Truck,
  MapPin,
  CreditCard,
  Download,
  MessageSquare,
  RotateCcw,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

// Mock order data
const mockOrder = {
  id: "ORD-1234567890",
  status: "processing",
  orderDate: "2024-01-20T10:30:00Z",
  estimatedDelivery: "2024-01-25T18:00:00Z",
  total: 299.97,
  items: [
    {
      id: "1",
      name: "Wireless Bluetooth Headphones",
      price: 79.99,
      quantity: 1,
      image: "/placeholder.svg?height=80&width=80",
      seller: "TechGear Pro",
    },
    {
      id: "2",
      name: "Smart Fitness Watch",
      price: 199.99,
      quantity: 1,
      image: "/placeholder.svg?height=80&width=80",
      seller: "FitTech Solutions",
    },
  ],
  shippingAddress: {
    name: "John Doe",
    address: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
  },
  trackingNumber: "TRK123456789",
}

const orderStatuses = [
  { key: "pending", label: "Order Placed", icon: CheckCircle, completed: true },
  { key: "processing", label: "Processing", icon: Package, completed: true },
  { key: "shipped", label: "Shipped", icon: Truck, completed: false },
  { key: "delivered", label: "Delivered", icon: MapPin, completed: false },
]

export default function OrderConfirmationPage() {
  const params = useParams()
  const orderId = params.orderId as string
  const [order, setOrder] = useState(mockOrder)
  const [currentStatusIndex, setCurrentStatusIndex] = useState(1)

  useEffect(() => {
    // Simulate order status updates
    const interval = setInterval(() => {
      setCurrentStatusIndex((prev) => {
        if (prev < orderStatuses.length - 1) {
          return prev + 1
        }
        clearInterval(interval)
        return prev
      })
    }, 10000) // Update every 10 seconds for demo

    return () => clearInterval(interval)
  }, [])

  const getProgressPercentage = () => {
    return ((currentStatusIndex + 1) / orderStatuses.length) * 100
  }

  const handleCancelOrder = () => {
    if (currentStatusIndex <= 1) {
      if (confirm("Are you sure you want to cancel this order?")) {
        alert("Order cancelled successfully. Refund will be processed within 3-5 business days.")
      }
    } else {
      alert("Order cannot be cancelled as it has already been shipped.")
    }
  }

  const handleReturnOrder = () => {
    if (currentStatusIndex === 3) {
      if (confirm("Are you sure you want to return this order?")) {
        alert("Return request submitted. You will receive return instructions via email.")
      }
    } else {
      alert("Return option is only available after delivery.")
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
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Order Confirmation Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your order #{orderId} has been placed successfully.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Tracking */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm text-gray-600">{Math.round(getProgressPercentage())}% Complete</span>
                    </div>
                    <Progress value={getProgressPercentage()} className="h-2" />
                  </div>

                  <div className="space-y-4">
                    {orderStatuses.map((status, index) => {
                      const Icon = status.icon
                      const isCompleted = index <= currentStatusIndex
                      const isCurrent = index === currentStatusIndex

                      return (
                        <div key={status.key} className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isCompleted
                                ? "bg-green-100 text-green-600"
                                : isCurrent
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <p
                              className={`font-medium ${isCompleted ? "text-green-600" : isCurrent ? "text-blue-600" : "text-gray-400"}`}
                            >
                              {status.label}
                            </p>
                            {isCurrent && (
                              <p className="text-sm text-gray-600">
                                {index === 1 && "Your order is being prepared"}
                                {index === 2 && "Your order is on the way"}
                                {index === 3 && "Your order has been delivered"}
                              </p>
                            )}
                          </div>
                          {isCompleted && <CheckCircle className="h-5 w-5 text-green-600" />}
                        </div>
                      )
                    })}
                  </div>

                  {currentStatusIndex >= 2 && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Truck className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-blue-600">Tracking Information</span>
                      </div>
                      <p className="text-sm text-gray-600">Tracking Number: {order.trackingNumber}</p>
                      <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                        Track Package
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">by {item.seller}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm">Qty: {item.quantity}</span>
                          <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardHeader>
                <CardTitle>Order Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" className="bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Download Invoice
                  </Button>
                  <Button variant="outline" className="bg-transparent">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                  {currentStatusIndex <= 1 && (
                    <Button
                      variant="outline"
                      onClick={handleCancelOrder}
                      className="bg-transparent text-red-600 hover:text-red-700"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel Order
                    </Button>
                  )}
                  {currentStatusIndex === 3 && (
                    <Button variant="outline" onClick={handleReturnOrder} className="bg-transparent">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Return Order
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Order Number</span>
                    <span className="font-mono text-sm">{orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Order Date</span>
                    <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Delivery</span>
                    <span>{new Date(order.estimatedDelivery).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <p className="font-medium">{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center">
                    VISA
                  </div>
                  <span className="text-sm">**** **** **** 1234</span>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Link href="/customer/orders">
                <Button variant="outline" className="bg-transparent">
                  View All Orders
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
