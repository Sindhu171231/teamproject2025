"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Clock, FlameIcon as Fire } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockProducts, type Product } from "@/lib/mock-data"

export function HotDeals() {
  const [hotDeals, setHotDeals] = useState<Product[]>([])
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30,
  })

  useEffect(() => {
    // Get trending products with discounts
    const deals = mockProducts.filter((product) => product.is_trending && product.discount_percentage)
    setHotDeals(deals.slice(0, 6))

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

  if (hotDeals.length === 0) return null

  return (
    <section className="py-12 bg-gradient-to-r from-red-50 to-orange-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Fire className="h-8 w-8 text-red-500" />
            <h2 className="text-3xl font-bold text-gray-900">🔥 Hot Deals</h2>
            <Fire className="h-8 w-8 text-red-500" />
          </div>
          <p className="text-gray-600 mb-4">Limited time offers - Don't miss out!</p>

          {/* Countdown Timer */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <Clock className="h-5 w-5 text-red-500" />
            <div className="flex items-center gap-2 text-lg font-bold text-red-600">
              <div className="bg-red-100 px-3 py-1 rounded">{timeLeft.hours.toString().padStart(2, "0")}</div>
              <span>:</span>
              <div className="bg-red-100 px-3 py-1 rounded">{timeLeft.minutes.toString().padStart(2, "0")}</div>
              <span>:</span>
              <div className="bg-red-100 px-3 py-1 rounded">{timeLeft.seconds.toString().padStart(2, "0")}</div>
            </div>
            <span className="text-sm text-gray-600">Hours : Minutes : Seconds</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotDeals.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <div className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-red-100 hover:border-red-300">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <Badge className="absolute top-3 left-3 bg-red-500 text-white font-bold">
                    -{product.discount_percentage}%
                  </Badge>
                  <Badge className="absolute top-3 right-3 bg-orange-500 text-white">HOT</Badge>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl font-bold text-red-600">${product.price}</span>
                    {product.original_price && (
                      <span className="text-lg text-gray-500 line-through">${product.original_price}</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Save ${((product.original_price || 0) - product.price).toFixed(2)}
                    </span>
                    <Button size="sm" className="bg-red-500 hover:bg-red-600">
                      Grab Deal
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/deals">
            <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white">
              View All Deals
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
