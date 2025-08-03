"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  TrendingUp,
  CheckCircle,
  Package,
  Truck,
  MapPin,
  Home,
  Download,
  ArrowLeft,
  Phone,
  Mail,
  Calendar,
  Clock,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"

const trackingStages = [
  {
    id: 1,
    name: "Order Placed",
    description: "Your order has been confirmed",
    icon: CheckCircle,
    completed: true,
  },
  {
    id: 2,
    name: "Processing",
    description: "We're preparing your items",
    icon: Package,
    completed: true,
  },
  {
    id: 3,
    name: "Shipped",
    description: "Your order is on its way",
    icon: Truck,
    completed: false,
  },
  {
    id: 4,
    name: "Out for Delivery",
    description: "Your package is out for delivery",
    icon: MapPin,
    completed: false,
  },
  {
    id: 5,
    name: "Delivered",
    description: "Your order has been delivered",
    icon: Home,
    completed: false,
  },
]

export default function OrderConfirmationPage() {
  const params = useParams()
  const orderId = params.orderId as string
  const [order, setOrder] = useState<any>(null)
  const [currentStage, setCurrentStage] = useState(2)
  const [estimatedDelivery, setEstimatedDelivery] = useState("")

  useEffect(() => {
    // Load order from localStorage
    const orderData = localStorage.getItem(`order_${orderId}`)
    if (orderData) {
      const parsedOrder = JSON.parse(orderData)
      setOrder(parsedOrder)

      // Set estimated delivery date (3-5 business days from now)
      const deliveryDate = new Date()
      deliveryDate.setDate(deliveryDate.getDate() + 4)
      setEstimatedDelivery(
        deliveryDate.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      )
    }
  }, [orderId])

  // Simulate order progress updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev < 5) {
          return prev + 1
        }
        clearInterval(interval)
        return prev
      })
    }, 15000) // Update every 15 seconds for demo

    return () => clearInterval(interval)
  }, [])

  const getProgressPercentage = () => {
    return (currentStage / 5) * 100
  }

  const getStageStatus = (stageId: number) => {
    if (stageId < currentStage) return "completed"
    if (stageId === currentStage) return "current"
    return "pending"
  }

  const handleCancelOrder = () => {
    if (currentStage <= 2) {
      if (confirm("Are you sure you want to cancel this order?")) {
        alert("Order cancelled successfully. Refund will be processed within 3-5 business days.")
      }
    } else {
      alert("Order cannot be cancelled as it has already been shipped.")
    }
  }

  const handleReturnOrder = () => {
    if (currentStage === 5) {
      alert("Return request initiated. You'll receive return instructions via email.")
    } else {
      alert("You can only return orders after they have been delivered.")
    }
  }

  const handleDownloadInvoice = () => {
    alert("Invoice download started. Check your downloads folder.")
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Order not found</h2>
          <p className="text-gray-600 mb-4">The order you're looking for doesn't exist.</p>
          <Link href="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
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
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8">
            <Link href="/" className="flex items-center gap-2 text-blue-600 hover:underline">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>

          {/* Success Message */}
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-600 rounded-full p-3">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-green-800 mb-1">Order Confirmed!</h1>
                  <p className="text-green-700">
                    Thank you for your purchase. Your order #{orderId} has been placed successfully.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Tracking */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order Tracking
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Order #{orderId}</span>
                    <span>•</span>
                    <span>Tracking: TRK{orderId.slice(-6)}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Order Progress</span>
                      <span>{Math.round(getProgressPercentage())}% Complete</span>
                    </div>
                    <Progress value={getProgressPercentage()} className="h-3" />
                  </div>

                  {/* Tracking Stages */}
                  <div className="space-y-4">
                    {trackingStages.map((stage, index) => {
                      const status = getStageStatus(stage.id)
                      const Icon = stage.icon

                      return (
                        <div key={stage.id} className="flex items-start gap-4">
                          <div
                            className={`
                            rounded-full p-2 border-2 
                            ${
                              status === "completed"
                                ? "bg-green-600 border-green-600 text-white"
                                : status === "current"
                                  ? "bg-blue-600 border-blue-600 text-white animate-pulse"
                                  : "bg-gray-100 border-gray-300 text-gray-400"
                            }
                          `}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3
                                className={`font-semibold ${
                                  status === "completed"
                                    ? "text-green-800"
                                    : status === "current"
                                      ? "text-blue-800"
                                      : "text-gray-500"
                                }`}
                              >
                                {stage.name}
                              </h3>
                              {status === "current" && (
                                <Badge variant="secondary" className="animate-pulse">
                                  In Progress
                                </Badge>
                              )}
                              {status === "completed" && <Badge className="bg-green-600">Completed</Badge>}
                            </div>
                            <p className="text-sm text-gray-600">{stage.description}</p>
                            {status === "current" && (
                              <p className="text-xs text-blue-600 mt-1">
                                <Clock className="h-3 w-3 inline mr-1" />
                                Estimated completion: 2-4 hours
                              </p>
                            )}
                          </div>
                          {index < trackingStages.length - 1 && (
                            <div
                              className={`
                              w-px h-8 ml-6 mt-2
                              ${status === "completed" ? "bg-green-300" : "bg-gray-200"}
                            `}
                            />
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Estimated Delivery */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold text-blue-800">Estimated Delivery</span>
                    </div>
                    <p className="text-blue-700">{estimatedDelivery}</p>
                    <p className="text-sm text-blue-600 mt-1">We'll send you tracking updates via email and SMS</p>
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
                    {order.items.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="rounded-md"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          <p className="text-sm text-gray-600">${item.price} each</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary & Actions */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${order.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{order.shipping === 0 ? "FREE" : `$${order.shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${order.tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-1">
                    <p className="font-semibold">
                      {order.shippingInfo.firstName} {order.shippingInfo.lastName}
                    </p>
                    <p>{order.shippingInfo.address}</p>
                    {order.shippingInfo.apartment && <p>{order.shippingInfo.apartment}</p>}
                    <p>
                      {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zipCode}
                    </p>
                    <p>{order.shippingInfo.country}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{order.shippingInfo.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{order.shippingInfo.phone}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Order Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full bg-transparent" onClick={handleDownloadInvoice}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Invoice
                  </Button>

                  {currentStage <= 2 && (
                    <Button
                      variant="outline"
                      className="w-full bg-transparent text-red-600 border-red-200 hover:bg-red-50"
                      onClick={handleCancelOrder}
                    >
                      Cancel Order
                    </Button>
                  )}

                  {currentStage === 5 && (
                    <Button variant="outline" className="w-full bg-transparent" onClick={handleReturnOrder}>
                      Return Order
                    </Button>
                  )}

                  <Link href="/customer/orders">
                    <Button variant="outline" className="w-full bg-transparent">
                      View All Orders
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Help */}
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600">
                  <p className="mb-2">
                    If you have any questions about your order, please contact our customer support.
                  </p>
                  <div className="space-y-1">
                    <p>📞 1-800-TRENDIFY</p>
                    <p>📧 support@trendify.com</p>
                    <p>💬 Live chat available 24/7</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
