"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TrendingUp, Clock, Flame, ShoppingCart, Heart, Star, Zap, Home, Bell } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "../../contexts/auth-context"
import { useCart } from "../../contexts/cart-context"
import { useWishlist } from "../../contexts/wishlist-context"
import AddToCartPopup from "../../AddToCartPopup"

// Mock hot deals data with real images
const hotDeals = [
  {
    id: "deal-1",
    name: "Wireless Gaming Headset",
    originalPrice: 199.99,
    dealPrice: 89.99,
    discount: 55,
    image: "https://images.unsplash.com/photo-1599669454699-248893623440?w=400&h=400&fit=crop",
    seller: "GameTech",
    rating: 4.8,
    reviews: 245,
    stock: 15,
    sold: 85,
    totalStock: 100,
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    category: "Electronics",
    features: ["Wireless", "RGB Lighting", "Noise Cancelling"],
  },
  {
    id: "deal-2",
    name: "Smart Fitness Tracker",
    originalPrice: 149.99,
    dealPrice: 79.99,
    discount: 47,
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop",
    seller: "HealthTech",
    rating: 4.6,
    reviews: 189,
    stock: 8,
    sold: 92,
    totalStock: 100,
    endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    category: "Electronics",
    features: ["Heart Rate Monitor", "Sleep Tracking", "Waterproof"],
  },
  {
    id: "deal-3",
    name: "Premium Coffee Maker",
    originalPrice: 299.99,
    dealPrice: 159.99,
    discount: 47,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop",
    seller: "KitchenPro",
    rating: 4.7,
    reviews: 156,
    stock: 22,
    sold: 78,
    totalStock: 100,
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    category: "Home",
    features: ["Programmable", "Auto-shutoff", "12-cup capacity"],
  },
  {
    id: "deal-4",
    name: "Bluetooth Portable Speaker",
    originalPrice: 89.99,
    dealPrice: 39.99,
    discount: 56,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    seller: "AudioMax",
    rating: 4.5,
    reviews: 312,
    stock: 5,
    sold: 95,
    totalStock: 100,
    endTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
    category: "Electronics",
    features: ["Waterproof", "20W Output", "12-hour battery"],
  },
  {
    id: "deal-5",
    name: "Ergonomic Office Chair",
    originalPrice: 399.99,
    dealPrice: 199.99,
    discount: 50,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    seller: "OfficeComfort",
    rating: 4.4,
    reviews: 89,
    stock: 12,
    sold: 38,
    totalStock: 50,
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    category: "Furniture",
    features: ["Lumbar Support", "Adjustable Height", "Mesh Back"],
  },
  {
    id: "deal-6",
    name: "4K Action Camera",
    originalPrice: 249.99,
    dealPrice: 129.99,
    discount: 48,
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop",
    seller: "CameraPro",
    rating: 4.6,
    reviews: 167,
    stock: 18,
    sold: 82,
    totalStock: 100,
    endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
    category: "Electronics",
    features: ["4K Video", "Waterproof", "Image Stabilization"],
  },
]

function CountdownTimer({ endTime }: { endTime: Date }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = endTime.getTime() - now

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [endTime])

  return (
    <div className="flex items-center gap-2 text-red-600">
      <Clock className="h-4 w-4" />
      <span className="font-mono text-sm">
        {timeLeft.days > 0 && `${timeLeft.days}d `}
        {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:
        {String(timeLeft.seconds).padStart(2, "0")}
      </span>
    </div>
  )
}

export default function HotDealsPage() {
  const { user } = useAuth()
  const { addToCart, getTotalItems } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedProduct, setSelectedProduct] = useState<(typeof hotDeals)[0] | null>(null)
  const [showCartPopup, setShowCartPopup] = useState(false)

  const categories = ["All", "Electronics", "Home", "Furniture"]
  const filteredDeals =
    selectedCategory === "All" ? hotDeals : hotDeals.filter((deal) => deal.category === selectedCategory)

  const handleAddToCart = (deal: (typeof hotDeals)[0]) => {
    if (!user) {
      window.location.href = "/auth/login"
      return
    }

    setSelectedProduct(deal)
    setShowCartPopup(true)
  }

  const handleCartPopupAddToCart = (productId: string, quantity: number) => {
    const deal = hotDeals.find((d) => d.id === productId)
    if (deal) {
      addToCart(
        {
          id: deal.id,
          name: deal.name,
          price: deal.dealPrice,
          originalPrice: deal.originalPrice,
          image: deal.image,
          seller: deal.seller,
          category: deal.category,
          stock: deal.stock,
        },
        quantity,
      )
    }
    setShowCartPopup(false)
    setSelectedProduct(null)
  }

  const handleWishlistToggle = (deal: (typeof hotDeals)[0]) => {
    if (!user) {
      window.location.href = "/auth/login"
      return
    }

    if (isInWishlist(deal.id)) {
      removeFromWishlist(deal.id)
    } else {
      addToWishlist({
        id: deal.id,
        name: deal.name,
        price: deal.dealPrice,
        originalPrice: deal.originalPrice,
        image: deal.image,
        seller: deal.seller,
        category: deal.category,
        rating: deal.rating,
        reviewCount: deal.reviews,
        inStock: deal.stock > 0,
      })
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

            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="icon">
                  <Home className="h-4 w-4" />
                </Button>
              </Link>
              {user ? (
                <>
                  <Link href="/cart">
                    <Button variant="outline" size="icon" className="relative bg-transparent">
                      <ShoppingCart className="h-4 w-4" />
                      {getTotalItems() > 0 && (
                        <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                          {getTotalItems()}
                        </Badge>
                      )}
                    </Button>
                  </Link>
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
                </>
              ) : (
                <div className="flex gap-2">
                  <Link href="/auth/login">
                    <Button variant="outline" size="sm" className="bg-transparent">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Flame className="h-8 w-8" />
            <h1 className="text-4xl md:text-5xl font-bold">Hot Deals</h1>
            <Flame className="h-8 w-8" />
          </div>
          <p className="text-xl mb-6 opacity-90">Limited time offers with incredible savings - Don't miss out!</p>
          <Badge className="bg-yellow-400 text-black text-lg px-4 py-2">
            <Zap className="h-5 w-5 mr-2" />
            Up to 60% OFF
          </Badge>
        </div>
      </section>

      {/* Category Filter */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory !== category ? "bg-transparent" : ""}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDeals.map((deal) => (
            <Card key={deal.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative">
                <Image
                  src={deal.image || "/placeholder.svg"}
                  alt={deal.name}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-3 left-3 bg-red-500 text-white">-{deal.discount}%</Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`absolute top-3 right-3 ${
                    isInWishlist(deal.id) ? "text-red-500" : "text-gray-400"
                  } hover:text-red-500 bg-white/80 backdrop-blur-sm`}
                  onClick={() => handleWishlistToggle(deal)}
                >
                  <Heart className={`h-5 w-5 ${isInWishlist(deal.id) ? "fill-current" : ""}`} />
                </Button>
              </div>

              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {deal.name}
                    </h3>
                    <p className="text-sm text-gray-600">by {deal.seller}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(deal.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({deal.reviews})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-red-600">${deal.dealPrice}</span>
                    <span className="text-lg text-gray-500 line-through">${deal.originalPrice}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>
                        Sold: {deal.sold}/{deal.totalStock}
                      </span>
                      <span className="text-red-600">{deal.stock} left</span>
                    </div>
                    <Progress value={(deal.sold / deal.totalStock) * 100} className="h-2" />
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {deal.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  <CountdownTimer endTime={deal.endTime} />

                  <Button onClick={() => handleAddToCart(deal)} disabled={deal.stock === 0} className="w-full">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {deal.stock === 0 ? "Sold Out" : "Add to Cart"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDeals.length === 0 && (
          <div className="text-center py-16">
            <Flame className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">No deals found</h3>
            <p className="text-gray-600 mb-6">Try selecting a different category</p>
            <Button onClick={() => setSelectedCategory("All")}>View All Deals</Button>
          </div>
        )}
      </div>

      {/* Newsletter Section */}
      <section className="bg-blue-600 text-white py-12 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Never Miss a Deal!</h2>
          <p className="text-xl mb-6 opacity-90">
            Subscribe to get notified about the hottest deals and exclusive offers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-2 rounded-md text-black" />
            <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Add to Cart Popup */}
      {selectedProduct && (
        <AddToCartPopup
          isOpen={showCartPopup}
          onClose={() => {
            setShowCartPopup(false)
            setSelectedProduct(null)
          }}
          product={{
            id: selectedProduct.id,
            name: selectedProduct.name,
            price: selectedProduct.dealPrice,
            image: selectedProduct.image,
            seller: selectedProduct.seller,
            stock: selectedProduct.stock,
          }}
          onAddToCart={handleCartPopupAddToCart}
        />
      )}
    </div>
  )
}
