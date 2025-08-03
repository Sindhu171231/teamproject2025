"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, Truck, MapPin, ShoppingCart, ArrowLeft, Lock, CheckCircle, Package, Clock } from "lucide-react"
import Link from "next/link"
import { useCart } from "../../contexts/cart-context"
import { useAuth } from "../../contexts/auth-context"
import { useNotifications } from "../../contexts/notification-context"
import { useOrders } from "../../contexts/order-context"
import { useEmailService } from "../../components/EmailService"

interface ShippingAddress {
  fullName: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
  country: string
}

interface PaymentMethod {
  type: "card" | "upi" | "netbanking" | "cod"
  cardNumber?: string
  expiryDate?: string
  cvv?: string
  upiId?: string
  bankName?: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const { addNotification } = useNotifications()
  const { addOrder } = useOrders()
  const { sendEmail, generateOrderConfirmationEmail } = useEmailService()

  const [step, setStep] = useState(1) // 1: Address, 2: Payment, 3: Review
  const [isProcessing, setIsProcessing] = useState(false)

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: user?.name || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  })

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    type: "card",
  })

  const [deliveryOption, setDeliveryOption] = useState("standard")
  const [specialInstructions, setSpecialInstructions] = useState("")

  useEffect(() => {
    if (!user) {
      router.push("/auth/login?redirect=/checkout")
      return
    }

    if (items.length === 0) {
      router.push("/cart")
      return
    }
  }, [user, items, router])

  const subtotal = getTotalPrice()
  const deliveryFee = deliveryOption === "express" ? 99 : deliveryOption === "standard" ? 49 : 0
  const tax = subtotal * 0.18 // 18% GST
  const total = subtotal + deliveryFee + tax

  const handleAddressSubmit = () => {
    if (
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pincode
    ) {
      addNotification({
        user_id: user?.id || "",
        title: "Incomplete Address",
        message: "Please fill in all required address fields",
        type: "error",
        read: false,
      })
      return
    }
    setStep(2)
  }

  const handlePaymentSubmit = () => {
    if (paymentMethod.type === "card") {
      if (!paymentMethod.cardNumber || !paymentMethod.expiryDate || !paymentMethod.cvv) {
        addNotification({
          user_id: user?.id || "",
          title: "Incomplete Payment Info",
          message: "Please fill in all card details",
          type: "error",
          read: false,
        })
        return
      }
    } else if (paymentMethod.type === "upi" && !paymentMethod.upiId) {
      addNotification({
        user_id: user?.id || "",
        title: "UPI ID Required",
        message: "Please enter your UPI ID",
        type: "error",
        read: false,
      })
      return
    }
    setStep(3)
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true)

    try {
      // Simulate order processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Create order data using the new order context
      const orderData = {
        customerId: user?.id || "",
        customerName: user?.name || "",
        customerEmail: user?.email || "",
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        subtotal,
        deliveryFee,
        tax,
        total,
        shippingAddress,
        paymentMethod: paymentMethod.type,
        deliveryOption,
        specialInstructions,
        status: "placed" as const,
      }

      // Add order to context
      addOrder(orderData)

      // Send confirmation email
      const emailData = generateOrderConfirmationEmail({
        orderId: `ORD-${Date.now()}`,
        customerName: user?.name || "",
        customerEmail: user?.email || "",
        items: items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total: total.toFixed(2),
        shippingAddress,
        paymentMethod: paymentMethod.type,
        deliveryOption,
        specialInstructions,
      })
      await sendEmail(emailData)

      // Add success notification
      addNotification({
        user_id: user?.id || "",
        title: "Order Placed Successfully!",
        message: "Your order has been confirmed and will be processed soon.",
        type: "success",
        read: false,
      })

      // Clear cart
      clearCart()

      // Redirect to order confirmation
      router.push(`/order-confirmation/${Date.now()}`)
    } catch (error) {
      addNotification({
        user_id: user?.id || "",
        title: "Order Failed",
        message: "There was an error processing your order. Please try again.",
        type: "error",
        read: false,
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (!user || items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/cart" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5" />
              Back to Cart
            </Link>
            <h1 className="text-2xl font-bold">Checkout</h1>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600">Secure Checkout</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Steps */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  {[
                    { number: 1, title: "Address", icon: MapPin },
                    { number: 2, title: "Payment", icon: CreditCard },
                    { number: 3, title: "Review", icon: CheckCircle },
                  ].map((stepItem, index) => (
                    <div key={stepItem.number} className="flex items-center">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full ${
                          step >= stepItem.number ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {step > stepItem.number ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <stepItem.icon className="h-5 w-5" />
                        )}
                      </div>
                      <span
                        className={`ml-2 font-medium ${step >= stepItem.number ? "text-blue-600" : "text-gray-600"}`}
                      >
                        {stepItem.title}
                      </span>
                      {index < 2 && (
                        <div className={`w-16 h-0.5 mx-4 ${step > stepItem.number ? "bg-blue-600" : "bg-gray-200"}`} />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Step 1: Shipping Address */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={shippingAddress.fullName}
                        onChange={(e) => setShippingAddress((prev) => ({ ...prev, fullName: e.target.value }))}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress((prev) => ({ ...prev, phone: e.target.value }))}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Textarea
                      id="address"
                      value={shippingAddress.address}
                      onChange={(e) => setShippingAddress((prev) => ({ ...prev, address: e.target.value }))}
                      placeholder="Enter your complete address"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress((prev) => ({ ...prev, city: e.target.value }))}
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Select
                        value={shippingAddress.state}
                        onValueChange={(value) => setShippingAddress((prev) => ({ ...prev, state: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Delhi">Delhi</SelectItem>
                          <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                          <SelectItem value="Karnataka">Karnataka</SelectItem>
                          <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                          <SelectItem value="West Bengal">West Bengal</SelectItem>
                          <SelectItem value="Gujarat">Gujarat</SelectItem>
                          <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                          <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        value={shippingAddress.pincode}
                        onChange={(e) => setShippingAddress((prev) => ({ ...prev, pincode: e.target.value }))}
                        placeholder="Pincode"
                        maxLength={6}
                      />
                    </div>
                  </div>

                  {/* Delivery Options */}
                  <div className="mt-6">
                    <Label className="text-base font-medium">Delivery Options</Label>
                    <RadioGroup value={deliveryOption} onValueChange={setDeliveryOption} className="mt-2">
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="standard" id="standard" />
                        <div className="flex-1">
                          <Label htmlFor="standard" className="font-medium">
                            Standard Delivery (5-7 days)
                          </Label>
                          <p className="text-sm text-gray-600">₹49 delivery charge</p>
                        </div>
                        <Badge variant="secondary">₹49</Badge>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="express" id="express" />
                        <div className="flex-1">
                          <Label htmlFor="express" className="font-medium">
                            Express Delivery (2-3 days)
                          </Label>
                          <p className="text-sm text-gray-600">₹99 delivery charge</p>
                        </div>
                        <Badge variant="secondary">₹99</Badge>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="free" id="free" />
                        <div className="flex-1">
                          <Label htmlFor="free" className="font-medium">
                            Free Delivery (7-10 days)
                          </Label>
                          <p className="text-sm text-gray-600">No delivery charge</p>
                        </div>
                        <Badge variant="outline">Free</Badge>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button onClick={handleAddressSubmit} className="w-full">
                    Continue to Payment
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Payment Method */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup
                    value={paymentMethod.type}
                    onValueChange={(value) => setPaymentMethod((prev) => ({ ...prev, type: value as any }))}
                  >
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Credit/Debit Card
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi" className="flex items-center gap-2">
                        <span className="text-lg">📱</span>
                        UPI
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="netbanking" id="netbanking" />
                      <Label htmlFor="netbanking" className="flex items-center gap-2">
                        <span className="text-lg">🏦</span>
                        Net Banking
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex items-center gap-2">
                        <span className="text-lg">💰</span>
                        Cash on Delivery
                      </Label>
                    </div>
                  </RadioGroup>

                  {/* Card Details */}
                  {paymentMethod.type === "card" && (
                    <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <Label htmlFor="cardNumber">Card Number *</Label>
                        <Input
                          id="cardNumber"
                          value={paymentMethod.cardNumber || ""}
                          onChange={(e) => setPaymentMethod((prev) => ({ ...prev, cardNumber: e.target.value }))}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Expiry Date *</Label>
                          <Input
                            id="expiryDate"
                            value={paymentMethod.expiryDate || ""}
                            onChange={(e) => setPaymentMethod((prev) => ({ ...prev, expiryDate: e.target.value }))}
                            placeholder="MM/YY"
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV *</Label>
                          <Input
                            id="cvv"
                            value={paymentMethod.cvv || ""}
                            onChange={(e) => setPaymentMethod((prev) => ({ ...prev, cvv: e.target.value }))}
                            placeholder="123"
                            maxLength={3}
                            type="password"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* UPI Details */}
                  {paymentMethod.type === "upi" && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <Label htmlFor="upiId">UPI ID *</Label>
                      <Input
                        id="upiId"
                        value={paymentMethod.upiId || ""}
                        onChange={(e) => setPaymentMethod((prev) => ({ ...prev, upiId: e.target.value }))}
                        placeholder="yourname@paytm"
                      />
                    </div>
                  )}

                  {/* Net Banking */}
                  {paymentMethod.type === "netbanking" && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <Label htmlFor="bankName">Select Bank *</Label>
                      <Select
                        value={paymentMethod.bankName || ""}
                        onValueChange={(value) => setPaymentMethod((prev) => ({ ...prev, bankName: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose your bank" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sbi">State Bank of India</SelectItem>
                          <SelectItem value="hdfc">HDFC Bank</SelectItem>
                          <SelectItem value="icici">ICICI Bank</SelectItem>
                          <SelectItem value="axis">Axis Bank</SelectItem>
                          <SelectItem value="kotak">Kotak Mahindra Bank</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                      Back to Address
                    </Button>
                    <Button onClick={handlePaymentSubmit} className="flex-1">
                      Review Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Order Review */}
            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Review Your Order
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Order Items */}
                  <div>
                    <h3 className="font-medium mb-4">Order Items</h3>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <h3 className="font-medium mb-2">Shipping Address</h3>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium">{shippingAddress.fullName}</p>
                      <p>{shippingAddress.address}</p>
                      <p>
                        {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}
                      </p>
                      <p>Phone: {shippingAddress.phone}</p>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <h3 className="font-medium mb-2">Payment Method</h3>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="capitalize">{paymentMethod.type.replace("_", " ")}</p>
                      {paymentMethod.type === "card" && paymentMethod.cardNumber && (
                        <p>**** **** **** {paymentMethod.cardNumber.slice(-4)}</p>
                      )}
                      {paymentMethod.type === "upi" && paymentMethod.upiId && <p>{paymentMethod.upiId}</p>}
                    </div>
                  </div>

                  {/* Special Instructions */}
                  <div>
                    <Label htmlFor="instructions">Special Instructions (Optional)</Label>
                    <Textarea
                      id="instructions"
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      placeholder="Any special delivery instructions..."
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                      Back to Payment
                    </Button>
                    <Button onClick={handlePlaceOrder} className="flex-1" disabled={isProcessing}>
                      {isProcessing ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Package className="h-4 w-4 mr-2" />
                          Place Order
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal ({items.length} items)</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>₹{deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (GST 18%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Estimated Delivery */}
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <Truck className="h-4 w-4" />
                    <span className="font-medium">Estimated Delivery</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">
                    {deliveryOption === "express"
                      ? "2-3 business days"
                      : deliveryOption === "standard"
                        ? "5-7 business days"
                        : "7-10 business days"}
                  </p>
                </div>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Lock className="h-4 w-4" />
                  <span>Your payment information is secure</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
