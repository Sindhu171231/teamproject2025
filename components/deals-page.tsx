"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Clock, FlameIcon as Fire, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockProducts, type Product } from "@/lib/mock-data"

export function DealsPage() {
  const [deals, setDeals] = useState<Product[]>([])
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30,
  })

  useEffect(() => {
    // Get all products with discounts
    const dealsProducts = mockProducts.filter((product) => product.discount_percentage && product.original_price)
    setDeals(dealsProducts)

    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Fire className="h-10 w-10 text-red-500" />
          <h1 className="text-4xl font-bold text-gray-900">🔥 Hot Deals & Offers</h1>
        </div>
        <p className="text-lg text-gray-600 mb-6">Limited time offers with massive savings!</p>

        {/* Countdown Timer */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8 max-w-md mx-auto">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Clock className="h-5 w-5 text-red-500" />
            <span className="text-red-700 font-semibold">Deals end in:</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-2xl font-bold text-red-600">
            <div className="bg-red-100 px-4 py-2 rounded-lg">{timeLeft.hours.toString().padStart(2, "0")}</div>
            <span>:</span>
            <div className="bg-red-100 px-4 py-2 rounded-lg">{timeLeft.minutes.toString().padStart(2, "0")}</div>
            <span>:</span>
            <div className="bg-red-100 px-4 py-2 rounded-lg">{timeLeft.seconds.toString().padStart(2, "0")}</div>
          </div>
          <div className="text-sm text-red-600 mt-2">Hours : Minutes : Seconds</div>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {deals.map((product) => (
          <div
            key={product.id}
            className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
          >
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <Badge className="bg-red-500 text-white font-bold text-sm px-3 py-1">
                  -{product.discount_percentage}% OFF
                </Badge>
                {product.is_trending && (
                  <Badge className="bg-orange-500 text-white font-bold text-sm px-3 py-1">🔥 TRENDING</Badge>
                )}
              </div>
            </div>

            <div className="p-6">
              <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                {product.name}
              </h3>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">(4.8)</span>
              </div>

              {/* Pricing */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold text-red-600">${product.price}</span>
                <span className="text-xl text-gray-500 line-through">${product.original_price}</span>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <div className="text-green-700 font-semibold text-sm">
                  💰 You Save: ${((product.original_price || 0) - product.price).toFixed(2)}
                </div>
              </div>

              <div className="flex gap-3">
                <Link href={`/product/${product.id}`} className="flex-1">
                  <Button className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold">
                    Grab This Deal
                  </Button>
                </Link>
              </div>

              <div className="mt-3 text-center">
                <span className="text-sm text-gray-500">{product.stock_count} left in stock</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4">Don't Miss Out!</h2>
        <p className="text-lg mb-6">These deals won't last long. Shop now and save big!</p>
        <Link href="/products">
          <Button size="lg" className="bg-white text-red-500 hover:bg-gray-100 font-semibold">
            Browse All Products
          </Button>
        </Link>
      </div>
    </main>
  )
}
