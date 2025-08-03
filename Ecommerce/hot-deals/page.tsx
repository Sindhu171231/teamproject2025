"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Heart, ShoppingCart, Clock, TrendingUp, Search, Filter, Mail } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"
import { useWishlist } from "@/lib/wishlist-context"
import AddToCartPopup from "@/components/AddToCartPopup"
import AddToWishlistPopup from "@/components/AddToWishlistPopup"

// Hot deals data with time-limited offers
const hotDeals = [
  {
    id: "deal-1",
    name: "Wireless Bluetooth Headphones",
    originalPrice: 129.99,
    salePrice: 79.99,
    discount: 38,
    image: "/placeholder.svg?height=300&width=300&text=Headphones",
    rating: 4.5,
    reviews: 234,
    sold: 156,
    total: 200,
    timeLeft: 2 * 60 * 60 + 45 * 60, // 2 hours 45 minutes in seconds
    features: ["Noise Cancelling", "30hr Battery", "Quick Charge"],
    category: "Electronics",
  },
  {
    id: "deal-2",
    name: "Smart Fitness Watch",
    originalPrice: 299.99,
    salePrice: 199.99,
    discount: 33,
    image: "/placeholder.svg?height=300&width=300&text=Smart+Watch",
    rating: 4.7,
    reviews: 189,
    sold: 89,
    total: 150,
    timeLeft: 5 * 60 * 60 + 20 * 60, // 5 hours 20 minutes in seconds
    features: ["Heart Rate Monitor", "GPS", "Waterproof"],
    category: "Wearables",
  },
  {
    id: "deal-3",
    name: "Gaming Mechanical Keyboard",
    originalPrice: 199.99,
    salePrice: 149.99,
    discount: 25,
    image: "/placeholder.svg?height=300&width=300&text=Gaming+Keyboard",
    rating: 4.6,
    reviews: 167,
    sold: 78,
    total: 100,
    timeLeft: 1 * 60 * 60 + 15 * 60, // 1 hour 15 minutes in seconds
    features: ["RGB Backlight", "Mechanical Switches", "Anti-Ghosting"],
    category: "Gaming",
  },
  {
    id: "deal-4",
    name: "Professional Camera Lens",
    originalPrice: 599.99,
    salePrice: 399.99,
    discount: 33,
    image: "/placeholder.svg?height=300&width=300&text=Camera+Lens",
    rating: 4.8,
    reviews: 92,
    sold: 34,
    total: 50,
    timeLeft: 8 * 60 * 60 + 30 * 60, // 8 hours 30 minutes in seconds
    features: ["85mm f/1.4", "Weather Sealed", "Image Stabilization"],
    category: "Photography",
  },
  {
    id: "deal-5",
    name: "Wireless Charging Pad",
    originalPrice: 49.99,
    salePrice: 29.99,
    discount: 40,
    image: "/placeholder.svg?height=300&width=300&text=Wireless+Charger",
    rating: 4.3,
    reviews: 145,
    sold: 203,
    total: 250,
    timeLeft: 3 * 60 * 60 + 45 * 60, // 3 hours 45 minutes in seconds
    features: ["Fast Charging", "LED Indicator", "Universal Compatible"],
    category: "Electronics",
  },
  {
    id: "deal-6",
    name: "Premium Coffee Maker",
    originalPrice: 179.99,
    salePrice: 119.99,
    discount: 33,
    image: "/placeholder.svg?height=300&width=300&text=Coffee+Maker",
    rating: 4.4,
    reviews: 178,
    sold: 67,
    total: 120,
    timeLeft: 6 * 60 * 60 + 10 * 60, // 6 hours 10 minutes in seconds
    features: ["12-Cup Capacity", "Programmable", "Auto Shut-off"],
    category: "Home & Kitchen",
  },
]

function CountdownTimer({ timeLeft }: { timeLeft: number }) {
  const [time, setTime] = useState(timeLeft)

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const hours = Math.floor(time / 3600)
  const minutes = Math.floor((time % 3600) / 60)
  const seconds = time % 60

  return (
    <div className="flex items-center gap-2 text-red-600 font-mono">
      <Clock className="h-4 w-4" />
      <span>
        {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
    </div>
  )
}

export default function HotDealsPage() {
  const { user } = useAuth()
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showCartPopup, setShowCartPopup] = useState(false)
  const [showWishlistPopup, setShowWishlistPopup] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [email, setEmail] = useState("")

  const categories = ["All", "Electronics", "Wearables", "Gaming", "Photography", "Home & Kitchen"]

  const filteredDeals = hotDeals.filter((deal) => {
    const matchesSearch = deal.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || deal.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleAddToCart = (product: any) => {
    if (!user) {
      alert("Please login to add items to cart")
      return
    }
    setSelectedProduct(product)
    setShowCartPopup(true)
  }

  const handleAddToWishlist = (product: any) => {
    if (!user) {
      alert("Please login to add items to wishlist")
      return
    }
    setSelectedProduct(product)
    setShowWishlistPopup(true)
  }

  const handleWishlistToggle = (product: any) => {
    if (!user) {
      alert("Please login to manage wishlist")
      return
    }

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.salePrice,
        originalPrice: product.originalPrice,
        image: product.image,
        rating: product.rating,
        reviews: product.reviews,
      })
    }
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      alert("Successfully subscribed to deal alerts!")
      setEmail("")
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
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            🔥 Hot Deals
          </h1>
          <p className="text-xl text-gray-600 mb-6">Limited time offers - Don't miss out!</p>

          {/* Deal Alert Subscription */}
          <Card className="max-w-md mx-auto mb-8">
            <CardContent className="p-4">
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter email for deal alerts"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Subscribe
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search hot deals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory !== category ? "bg-transparent" : ""}
              >
                <Filter className="h-4 w-4 mr-2" />
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDeals.map((deal) => (
            <Card key={deal.id} className="group hover:shadow-xl transition-all duration-300 border-2 border-red-100">
              <CardHeader className="relative p-0">
                {/* Discount Badge */}
                <Badge className="absolute top-4 left-4 z-10 bg-red-600 text-white">-{deal.discount}%</Badge>

                {/* Wishlist Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white"
                  onClick={() => handleWishlistToggle(deal)}
                >
                  <Heart
                    className={`h-5 w-5 ${isInWishlist(deal.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                  />
                </Button>

                <div className="relative overflow-hidden">
                  <Image
                    src={deal.image || "/placeholder.svg"}
                    alt={deal.name}
                    width={300}
                    height={300}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Countdown Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 bg-black/80 text-white p-2 rounded">
                    <CountdownTimer timeLeft={deal.timeLeft} />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{deal.name}</h3>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {deal.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${i < Math.floor(deal.rating) ? "text-yellow-400" : "text-gray-300"}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {deal.rating} ({deal.reviews} reviews)
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Sold: {deal.sold}</span>
                      <span>Available: {deal.total - deal.sold}</span>
                    </div>
                    <Progress value={(deal.sold / deal.total) * 100} className="h-2" />
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-red-600">${deal.salePrice}</span>
                    <span className="text-lg text-gray-500 line-through">${deal.originalPrice}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button onClick={() => handleAddToCart(deal)} className="flex-1" disabled={deal.sold >= deal.total}>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {deal.sold >= deal.total ? "Sold Out" : "Add to Cart"}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleAddToWishlist(deal)}
                      className="bg-transparent"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredDeals.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No deals found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Popups */}
      {showCartPopup && selectedProduct && (
        <AddToCartPopup
          product={selectedProduct}
          onClose={() => setShowCartPopup(false)}
          onAddToCart={(product, quantity) => {
            addToCart({
              id: product.id,
              name: product.name,
              price: product.salePrice,
              image: product.image,
              quantity,
            })
            setShowCartPopup(false)
          }}
        />
      )}

      {showWishlistPopup && selectedProduct && (
        <AddToWishlistPopup
          product={selectedProduct}
          onClose={() => setShowWishlistPopup(false)}
          onAddToWishlist={(product) => {
            addToWishlist({
              id: product.id,
              name: product.name,
              price: product.salePrice,
              originalPrice: product.originalPrice,
              image: product.image,
              rating: product.rating,
              reviews: product.reviews,
            })
            setShowWishlistPopup(false)
          }}
        />
      )}
    </div>
  )
}
