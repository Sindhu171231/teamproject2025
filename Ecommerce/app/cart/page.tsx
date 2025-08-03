"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  TrendingUp,
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
  Heart,
  Bell,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "../../contexts/auth-context"
import { useCart } from "../../contexts/cart-context"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const { user } = useAuth()
  const { items, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } = useCart()
  const router = useRouter()
  const [promoCode, setPromoCode] = useState("")

  if (!user) {
    router.push("/auth/login")
    return null
  }

  const subtotal = getTotalPrice()
  const shipping = subtotal > 50 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleCheckout = () => {
    router.push("/checkout")
  }

  if (items.length === 0) {
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
                <Button variant="outline" size="icon" className="bg-transparent">
                  <Bell className="h-4 w-4" />
                </Button>
                <Link href={user.role === "customer" ? "/customer/dashboard" : "/seller/dashboard"}>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {user.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Empty Cart */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet</p>
            <Link href="/">
              <Button size="lg">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
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

            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" className="bg-transparent">
                <Bell className="h-4 w-4" />
              </Button>
              <Link href={user.role === "customer" ? "/customer/dashboard" : "/seller/dashboard"}>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {user.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "U"}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <p className="text-gray-600">{getTotalItems()} items in your cart</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={100}
                      height={100}
                      className="rounded-md object-cover"
                    />

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <p className="text-sm text-gray-600">by {item.seller}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-bold text-blue-600">${(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                        </div>
                      </div>

                      {item.stock < 10 && (
                        <Badge variant="destructive" className="mt-2">
                          Only {item.stock} left in stock
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal ({getTotalItems()} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                </div>

                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <Button onClick={handleCheckout} className="w-full" size="lg">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>

            {/* Promo Code */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Promo Code</label>
                  <div className="flex gap-2">
                    <Input placeholder="Enter code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
                    <Button variant="outline">Apply</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-green-600" />
                  <span className="text-sm">Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span className="text-sm">Secure checkout guaranteed</span>
                </div>
                <div className="flex items-center gap-3">
                  <Heart className="h-5 w-5 text-red-600" />
                  <span className="text-sm">30-day return policy</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
