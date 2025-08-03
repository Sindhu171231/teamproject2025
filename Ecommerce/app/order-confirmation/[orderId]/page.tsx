"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle,
  Package,
  Truck,
  MapPin,
  Clock,
  Download,
  Share2,
  ArrowLeft,
  Phone,
  Mail,
  Calendar,
  Star,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "../../../contexts/auth-context"
import { useOrders } from "../../../contexts/order-context"

interface OrderStatus {
  status: "confirmed" | "processing" | "shipped" | "out_for_delivery" | "delivered"
  timestamp: string
  description: string
}

interface TrackingInfo {
  currentStatus: string
  estimatedDelivery: string
  trackingNumber: string
  courierPartner: string
  statuses: OrderStatus[]
}

export default function OrderConfirmationPage() {
  const params = useParams()
  const { user } = useAuth()
  const { getOrderById } = useOrders()
  const orderId = params.orderId as string

  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo>({
    currentStatus: "confirmed",
    estimatedDelivery: "2024-02-15",
    trackingNumber: `TRK${Date.now()}`,
    courierPartner: "Trendify Express",
    statuses: [
      {
        status: "confirmed",
        timestamp: new Date().toISOString(),
        description: "Order confirmed and payment received",
      },
    ],
  })

  const [orderDetails] = useState({
    id: orderId,
    items: [
      {
        id: "1",
        name: "Wireless Bluetooth Headphones",
        price: 79.99,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80&text=Headphones",
      },
    ],
    total: 128.98,
    shippingAddress: {
      name: user?.name || "John Doe",
      address: "123 Main Street, Apt 4B",
      city: "New York",
      state: "NY",
      pincode: "10001",
    },
    paymentMethod: "Credit Card ending in 1234",
  })

  // Simulate order progression
  useEffect(() => {
    const progressOrder = () => {
      const statuses: OrderStatus[] = [
        {
          status: "confirmed",
          timestamp: new Date().toISOString(),
          description: "Order confirmed and payment received",
        },
        {
          status: "processing",
          timestamp: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          description: "Order is being prepared for shipment",
        },
        {
          status: "shipped",
          timestamp: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          description: "Order has been shipped and is on its way",
        },
        {
          status: "out_for_delivery",
          timestamp: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
          description: "Order is out for delivery",
        },
        {
          status: "delivered",
          timestamp: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
          description: "Order has been delivered successfully",
        },
      ]

      let currentIndex = 0
      const interval = setInterval(() => {
        if (currentIndex < statuses.length - 1) {
          currentIndex++
          setTrackingInfo((prev) => ({
            ...prev,
            currentStatus: statuses[currentIndex].status,
            statuses: statuses.slice(0, currentIndex + 1),
          }))
        } else {
          clearInterval(interval)
        }
      }, 10000) // Progress every 10 seconds for demo

      return () => clearInterval(interval)
    }

    const cleanup = progressOrder()
    return cleanup
  }, [])

  const getStatusProgress = (status: string) => {
    const statusMap = {
      confirmed: 20,
      processing: 40,
      shipped: 60,
      out_for_delivery: 80,
      delivered: 100,
    }
    return statusMap[status as keyof typeof statusMap] || 0
  }

  const getStatusColor = (status: string) => {
    const colorMap = {
      confirmed: "bg-blue-500",
      processing: "bg-yellow-500",
      shipped: "bg-purple-500",
      out_for_delivery: "bg-orange-500",
      delivered: "bg-green-500",
    }
    return colorMap[status as keyof typeof colorMap] || "bg-gray-500"
  }

  const getStatusIcon = (status: string) => {
    const iconMap = {
      confirmed: CheckCircle,
      processing: Package,
      shipped: Truck,
      out_for_delivery: MapPin,
      delivered: CheckCircle,
    }
    const Icon = iconMap[status as keyof typeof iconMap] || Clock
    return <Icon className="h-5 w-5" />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5" />
              Continue Shopping
            </Link>
            <h1 className="text-2xl font-bold">Order Confirmation</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Invoice
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Success Message */}
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-green-800">Order Placed Successfully!</h2>
                <p className="text-green-700">
                  Thank you for your order. We'll send you shipping confirmation when your item(s) are on the way.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Tracking */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tracking Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Tracking
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Order ID: {orderId}</span>
                  <span>•</span>
                  <span>Tracking: {trackingInfo.trackingNumber}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium capitalize">
                      {trackingInfo.currentStatus.replace("_", " ")}
                    </span>
                    <span className="text-sm text-gray-600">
                      {getStatusProgress(trackingInfo.currentStatus)}% Complete
                    </span>
                  </div>
                  <Progress value={getStatusProgress(trackingInfo.currentStatus)} className="h-2" />
                </div>

                {/* Status Timeline */}
                <div className="space-y-4">
                  {[
                    { key: "confirmed", label: "Order Confirmed", desc: "We've received your order" },
                    { key: "processing", label: "Processing", desc: "Your order is being prepared" },
                    { key: "shipped", label: "Shipped", desc: "Your order is on its way" },
                    { key: "out_for_delivery", label: "Out for Delivery", desc: "Your order is out for delivery" },
                    { key: "delivered", label: "Delivered", desc: "Your order has been delivered" },
                  ].map((step, index) => {
                    const isCompleted = trackingInfo.statuses.some((s) => s.status === step.key)
                    const isCurrent = trackingInfo.currentStatus === step.key
                    const statusData = trackingInfo.statuses.find((s) => s.status === step.key)

                    return (
                      <div key={step.key} className="flex items-start gap-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isCompleted ? `${getStatusColor(step.key)} text-white` : "bg-gray-200 text-gray-400"
                          }`}
                        >
                          {getStatusIcon(step.key)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className={`font-medium ${isCompleted ? "text-gray-900" : "text-gray-400"}`}>
                              {step.label}
                            </h3>
                            {isCurrent && (
                              <Badge variant="secondary" className="text-xs">
                                Current
                              </Badge>
                            )}
                          </div>
                          <p className={`text-sm ${isCompleted ? "text-gray-600" : "text-gray-400"}`}>{step.desc}</p>
                          {statusData && (
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(statusData.timestamp).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Estimated Delivery */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700 mb-2">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">Estimated Delivery</span>
                  </div>
                  <p className="text-blue-600">
                    {new Date(trackingInfo.estimatedDelivery).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-blue-600 mt-1">By {trackingInfo.courierPartner}</p>
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
                  {orderDetails.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-gray-600">Rate this product</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                        <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                          Buy Again
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{(orderDetails.total - 49).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>₹49.00</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹{orderDetails.total.toFixed(2)}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Payment Method: {orderDetails.paymentMethod}</p>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p className="font-medium">{orderDetails.shippingAddress.name}</p>
                  <p>{orderDetails.shippingAddress.address}</p>
                  <p>
                    {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} -{" "}
                    {orderDetails.shippingAddress.pincode}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Help & Support */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Support
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Support
                </Button>
                <Link href="/customer/orders">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Package className="h-4 w-4 mr-2" />
                    View All Orders
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
