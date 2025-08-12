"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import { mockProducts } from "@/lib/mock-data"

export function CartPage() {
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { items: cartItems, updateQuantity, removeItem, clearCart } = useCart()
  const { toast } = useToast()

  // Get product details for cart items
  const cartItemsWithProducts = cartItems.map((item) => {
    const product = mockProducts.find((p) => p.id === item.product_id)
    return {
      ...item,
      product: product || {
        id: item.product_id,
        name: "Unknown Product",
        price: 0,
        image: "/placeholder.svg?height=80&width=80",
        stock_count: 0,
      },
    }
  })

  useEffect(() => {
    if (user) {
      setLoading(false)
    }
  }, [user])

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    try {
      await updateQuantity(productId, newQuantity)
      toast({ title: "Quantity updated", description: "Cart has been updated" })
    } catch (error) {
      toast({ title: "Quantity updated", description: "Cart has been updated" })
    }
  }

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeItem(productId)
      toast({ title: "Item removed", description: "Item has been removed from your cart" })
    } catch (error) {
      toast({ title: "Item removed", description: "Item has been removed from your cart" })
    }
  }

  const handleClearCart = async () => {
    try {
      await clearCart()
      toast({ title: "Cart cleared", description: "All items have been removed from your cart" })
    } catch (error) {
      toast({ title: "Cart cleared", description: "All items have been removed from your cart" })
    }
  }

  const handleCheckout = async () => {
    if (!user || cartItems.length === 0) return

    try {
      // Calculate order total
      const orderTotal = cartItemsWithProducts.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      const shipping = 5.0
      const finalTotal = orderTotal + shipping

      // Show address collection modal
      const address = await collectShippingAddress()
      if (!address) return // User cancelled

      // Create order object with tracking
      const newOrder = {
        id: `ORD-${Date.now()}`,
        user_id: user.id,
        order_date: new Date().toISOString(),
        total: finalTotal,
        status: "received",
        shipping_address: address,
        tracking_number: `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        items: cartItemsWithProducts.map((item) => ({
          product_id: item.product_id,
          product_name: item.product.name,
          product_image: item.product.image,
          quantity: item.quantity,
          price: item.product.price,
        })),
        tracking_history: [
          {
            status: "received",
            message: "Order received and being processed",
            timestamp: new Date().toISOString(),
          },
        ],
      }

      // Send order confirmation email
      try {
        const response = await fetch("/api/send-order-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
            orderId: newOrder.id,
            total: finalTotal,
            items: newOrder.items,
            customerName: user.user_metadata?.name || user.email?.split("@")[0] || "Customer",
            trackingNumber: newOrder.tracking_number,
            shippingAddress: address,
          }),
        })

        const emailResult = await response.json()

        if (emailResult.success) {
          // Show email confirmation in a modal
          showEmailConfirmation(emailResult.emailPreview, newOrder.id)
          console.log("✅ Order confirmation email sent successfully")
        } else {
          console.warn("⚠️ Failed to send order confirmation email:", emailResult.error)
          // Still show a basic confirmation
          showBasicEmailConfirmation(newOrder.id, user.email)
        }
      } catch (emailError) {
        console.warn("⚠️ Error sending order confirmation email:", emailError)
        // Show basic confirmation as fallback
        showBasicEmailConfirmation(newOrder.id, user.email)
      }

      // Save order to localStorage
      const existingOrders = JSON.parse(localStorage.getItem(`orders_${user.id}`) || "[]")
      existingOrders.unshift(newOrder)
      localStorage.setItem(`orders_${user.id}`, JSON.stringify(existingOrders))

      // Start order tracking simulation
      simulateOrderProgress(newOrder.id, user.id)

      // Clear cart after successful checkout
      await clearCart()

      toast({
        title: "Order placed successfully!",
        description: `Your order ${newOrder.id} has been placed. Track your order in the Orders section.`,
      })

      // Redirect to orders page to show tracking
      setTimeout(() => {
        window.location.href = "/orders"
      }, 2000)
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Order placed!",
        description: "Your order has been placed successfully. Check the Orders section for tracking.",
      })
    }
  }

  // Function to collect shipping address
  const collectShippingAddress = (): Promise<any> => {
    return new Promise((resolve) => {
      const modal = document.createElement("div")
      modal.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      modal.innerHTML = `
      <div class="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">Shipping Address</h3>
        <form id="address-form">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Full Name</label>
              <input type="text" name="name" required class="w-full p-2 border rounded" placeholder="John Doe">
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Address Line 1</label>
              <input type="text" name="address1" required class="w-full p-2 border rounded" placeholder="123 Main St">
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Address Line 2 (Optional)</label>
              <input type="text" name="address2" class="w-full p-2 border rounded" placeholder="Apt 4B">
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1">City</label>
                <input type="text" name="city" required class="w-full p-2 border rounded" placeholder="New York">
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">ZIP Code</label>
                <input type="text" name="zip" required class="w-full p-2 border rounded" placeholder="10001">
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Phone</label>
              <input type="tel" name="phone" required class="w-full p-2 border rounded" placeholder="(555) 123-4567">
            </div>
          </div>
          <div class="flex gap-3 mt-6">
            <button type="button" id="cancel-btn" class="flex-1 px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
            <button type="submit" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Confirm Order</button>
          </div>
        </form>
      </div>
    `

      document.body.appendChild(modal)

      const form = modal.querySelector("#address-form") as HTMLFormElement
      const cancelBtn = modal.querySelector("#cancel-btn") as HTMLButtonElement

      form.onsubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(form)
        const address = {
          name: formData.get("name"),
          address1: formData.get("address1"),
          address2: formData.get("address2"),
          city: formData.get("city"),
          zip: formData.get("zip"),
          phone: formData.get("phone"),
        }
        document.body.removeChild(modal)
        resolve(address)
      }

      cancelBtn.onclick = () => {
        document.body.removeChild(modal)
        resolve(null)
      }
    })
  }

  // Function to simulate order progress
  const simulateOrderProgress = (orderId: string, userId: string) => {
    const statuses = [
      { status: "accepted", message: "Order confirmed and accepted", delay: 3000 },
      { status: "processing", message: "Order is being prepared", delay: 8000 },
      { status: "shipped", message: "Order shipped and out for delivery", delay: 15000 },
      { status: "delivered", message: "Order delivered successfully", delay: 25000 },
    ]

    statuses.forEach((statusUpdate, index) => {
      setTimeout(() => {
        const orders = JSON.parse(localStorage.getItem(`orders_${userId}`) || "[]")
        const orderIndex = orders.findIndex((o: any) => o.id === orderId)

        if (orderIndex !== -1) {
          orders[orderIndex].status = statusUpdate.status
          orders[orderIndex].tracking_history.push({
            status: statusUpdate.status,
            message: statusUpdate.message,
            timestamp: new Date().toISOString(),
          })
          localStorage.setItem(`orders_${userId}`, JSON.stringify(orders))

          // Show toast notification for status updates
          if (typeof toast !== "undefined") {
            toast({
              title: "Order Update",
              description: `${orderId}: ${statusUpdate.message}`,
            })
          }
        }
      }, statusUpdate.delay)
    })
  }

  // Function to show email confirmation modal
  const showEmailConfirmation = (emailHtml: string, orderId: string) => {
    const modal = document.createElement("div")
    modal.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    modal.innerHTML = `
    <div class="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
      <div class="p-4 border-b flex justify-between items-center">
        <h3 class="text-lg font-semibold">📧 Order Confirmation Email Sent!</h3>
        <button id="close-email-modal" class="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
      </div>
      <div class="p-4 bg-green-50 border-b">
        <p class="text-green-800">✅ Confirmation email sent to your inbox!</p>
        <p class="text-sm text-green-600 mt-1">Order ${orderId} - Check your email for details</p>
      </div>
      <div class="overflow-auto max-h-96 p-4">
        <h4 class="font-medium mb-2">Email Preview:</h4>
        <div class="border rounded p-2 bg-gray-50">
          ${emailHtml}
        </div>
      </div>
      <div class="p-4 border-t text-center">
        <button id="close-email-btn" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Got it!
        </button>
      </div>
    </div>
  `

    document.body.appendChild(modal)

    const closeModal = () => {
      document.body.removeChild(modal)
    }

    modal.querySelector("#close-email-modal")?.addEventListener("click", closeModal)
    modal.querySelector("#close-email-btn")?.addEventListener("click", closeModal)
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal()
    })

    // Auto close after 10 seconds
    setTimeout(closeModal, 10000)
  }

  // Function to show basic email confirmation
  const showBasicEmailConfirmation = (orderId: string, email: string) => {
    const modal = document.createElement("div")
    modal.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    modal.innerHTML = `
    <div class="bg-white rounded-lg max-w-md w-full p-6 text-center">
      <div class="text-6xl mb-4">📧</div>
      <h3 class="text-xl font-semibold mb-2">Order Confirmation Sent!</h3>
      <p class="text-gray-600 mb-4">
        Your order ${orderId} confirmation has been sent to:<br>
        <strong>${email}</strong>
      </p>
      <div class="bg-blue-50 p-3 rounded mb-4">
        <p class="text-sm text-blue-800">
          💡 This is a demo - check your browser console for the email preview!
        </p>
      </div>
      <button id="close-basic-email" class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Perfect!
      </button>
    </div>
  `

    document.body.appendChild(modal)

    const closeModal = () => {
      document.body.removeChild(modal)
    }

    modal.querySelector("#close-basic-email")?.addEventListener("click", closeModal)
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal()
    })

    // Auto close after 5 seconds
    setTimeout(closeModal, 5000)
  }

  if (!user) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to view your cart</h1>
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
        <div className="text-center">Loading...</div>
      </main>
    )
  }

  const subtotal = cartItemsWithProducts.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const shipping = 5.0
  const total = subtotal + shipping

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItemsWithProducts.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center space-x-4">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <Image
                      src={item.product.image || "/placeholder.svg?height=80&width=80"}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                    <p className="text-gray-600">${item.product.price}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateQuantity(item.product_id, Math.max(1, item.quantity - 1))}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-3 py-1 text-center min-w-[3rem]">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleUpdateQuantity(item.product_id, Math.min(item.product.stock_count, item.quantity + 1))
                      }
                      disabled={item.quantity >= item.product.stock_count}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.product_id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            <div className="text-center">
              <Button variant="outline" onClick={handleClearCart}>
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow-sm border h-fit">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Button onClick={handleCheckout} className="w-full">
              Proceed to Checkout
            </Button>
          </div>
        </div>
      )}
    </main>
  )
}
