"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Package, Truck, CheckCircle, Clock, ChevronDown, ChevronUp, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"

interface Order {
  id: string
  user_id: string
  order_date: string
  total: number
  status: string
  tracking_number?: string
  shipping_address?: any
  items: Array<{
    product_id: string
    product_name: string
    product_image: string
    quantity: number
    price: number
  }>
  tracking_history?: Array<{
    status: string
    message: string
    timestamp: string
  }>
}

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set())
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      loadOrders()
      // Set up polling to refresh orders every 3 seconds for live updates
      const interval = setInterval(loadOrders, 3000)
      return () => clearInterval(interval)
    }
  }, [user])

  const loadOrders = () => {
    if (!user) return

    try {
      const savedOrders = localStorage.getItem(`orders_${user.id}`)
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders)
        setOrders(parsedOrders)
      }
    } catch (error) {
      console.error("Error loading orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders)
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId)
    } else {
      newExpanded.add(orderId)
    }
    setExpandedOrders(newExpanded)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "received":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "accepted":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "processing":
        return <Package className="h-5 w-5 text-orange-500" />
      case "shipped":
        return <Truck className="h-5 w-5 text-purple-500" />
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "received":
        return "bg-blue-100 text-blue-800"
      case "accepted":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-orange-100 text-orange-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const resendEmailConfirmation = async (order: Order) => {
    try {
      const response = await fetch("/api/send-order-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user?.email,
          orderId: order.id,
          total: order.total,
          items: order.items,
          customerName: user?.user_metadata?.name || user?.email?.split("@")[0] || "Customer",
          trackingNumber: order.tracking_number,
          shippingAddress: order.shipping_address,
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Show email preview modal
        showEmailPreview(result.emailPreview, order.id)
      }
    } catch (error) {
      console.error("Error resending email:", error)
    }
  }

  const showEmailPreview = (emailHtml: string, orderId: string) => {
    const modal = document.createElement("div")
    modal.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    modal.innerHTML = `
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div class="p-4 border-b flex justify-between items-center">
          <h3 class="text-lg font-semibold">📧 Email Confirmation - ${orderId}</h3>
          <button id="close-modal" class="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
        </div>
        <div class="overflow-auto max-h-96 p-4">
          ${emailHtml}
        </div>
        <div class="p-4 border-t text-center">
          <button id="close-btn" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Close
          </button>
        </div>
      </div>
    `

    document.body.appendChild(modal)

    const closeModal = () => {
      document.body.removeChild(modal)
    }

    modal.querySelector("#close-modal")?.addEventListener("click", closeModal)
    modal.querySelector("#close-btn")?.addEventListener("click", closeModal)
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal()
    })
  }

  if (!user) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to view your orders</h1>
          <Link href="/auth">
            <Button>Sign In</Button>
          </Link>
        </div>
      </main>
    )
  }

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">Loading your orders...</div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Your Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-4">No orders found</p>
          <Link href="/products">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              {/* Order Header */}
              <div className="p-6 border-b bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(order.status)}
                    <div>
                      <h3 className="font-semibold text-lg">{order.id}</h3>
                      <p className="text-gray-600">Placed on {new Date(order.order_date).toLocaleDateString()}</p>
                      {order.tracking_number && (
                        <p className="text-sm text-gray-500 font-mono">Tracking: {order.tracking_number}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <span className="text-xl font-bold">${order.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleOrderExpansion(order.id)}
                    className="flex items-center gap-2"
                  >
                    {expandedOrders.has(order.id) ? (
                      <>
                        <ChevronUp className="h-4 w-4" />
                        Hide Details
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4" />
                        View Details
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => resendEmailConfirmation(order)}
                    className="flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    View Email
                  </Button>
                </div>
              </div>

              {/* Expanded Order Details */}
              {expandedOrders.has(order.id) && (
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Order Items */}
                    <div>
                      <h4 className="font-semibold mb-4">Items Ordered</h4>
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                            <div className="relative w-12 h-12 flex-shrink-0">
                              <Image
                                src={item.product_image || "/placeholder.svg?height=48&width=48"}
                                alt={item.product_name}
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{item.product_name}</p>
                              <p className="text-sm text-gray-600">
                                Qty: {item.quantity} × ${item.price}
                              </p>
                            </div>
                            <p className="font-semibold">${(item.quantity * item.price).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tracking Information */}
                    <div>
                      <h4 className="font-semibold mb-4">Order Tracking</h4>
                      {order.tracking_history && order.tracking_history.length > 0 ? (
                        <div className="space-y-3">
                          {order.tracking_history.map((track, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <div className="flex-shrink-0 mt-1">{getStatusIcon(track.status)}</div>
                              <div className="flex-1">
                                <p className="font-medium capitalize">{track.status}</p>
                                <p className="text-sm text-gray-600">{track.message}</p>
                                <p className="text-xs text-gray-500">{new Date(track.timestamp).toLocaleString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No tracking information available</p>
                      )}

                      {/* Shipping Address */}
                      {order.shipping_address && (
                        <div className="mt-6 p-4 bg-blue-50 rounded">
                          <h5 className="font-medium mb-2">Shipping Address</h5>
                          <div className="text-sm text-gray-700">
                            <p className="font-medium">{order.shipping_address.name}</p>
                            <p>{order.shipping_address.address1}</p>
                            {order.shipping_address.address2 && <p>{order.shipping_address.address2}</p>}
                            <p>
                              {order.shipping_address.city}, {order.shipping_address.zip}
                            </p>
                            <p>{order.shipping_address.phone}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
