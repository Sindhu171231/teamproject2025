"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Star } from 'lucide-react'
import Image from "next/image"
import { useCart } from "./cart-context"
import { useWishlist } from "./wishlist-context"
import { useAuth } from "./auth-context"
import AddToCartPopup from "./AddToCartPopup"
import AddToWishlistPopup from "./AddToWishlistPopup"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  seller: string
  rating: number
  reviews: number
  stock: number
  category?: string
  description?: string
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const { user } = useAuth()
  const [showCartPopup, setShowCartPopup] = useState(false)
  const [showWishlistPopup, setShowWishlistPopup] = useState(false)

  const isWishlisted = isInWishlist(product.id)
  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = async (productId: string, quantity: number) => {
    if (!user) {
      window.location.href = "/auth/login"
      return
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      seller: product.seller,
      stock: product.stock,
    }, quantity)
  }

  const handleWishlistToggle = async (productId: string) => {
    if (!user) {
      window.location.href = "/auth/login"
      return
    }

    if (isWishlisted) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        seller: product.seller,
        rating: product.rating,
        reviews: product.reviews,
        stock: product.stock,
      })
    }
  }

  const handleQuickAddToCart = () => {
    if (!user) {
      window.location.href = "/auth/login"
      return
    }
    setShowCartPopup(true)
  }

  return (
    <>
      <Card className="group hover:shadow-lg transition-shadow duration-300 relative overflow-hidden">
        {discountPercentage > 0 && (
          <Badge className="absolute top-2 left-2 z-10 bg-red-500 hover:bg-red-600">-{discountPercentage}%</Badge>
        )}

        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 right-2 z-10 ${
            isWishlisted ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-red-500"
          }`}
          onClick={() => handleWishlistToggle(product.id)}
        >
          <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
        </Button>

        <div className="aspect-square overflow-hidden">
          <Image
            src={product.image || `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(product.name)}`}
            alt={product.name}
            width={300}
            height={300}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
              {product.name}
            </h3>

            <p className="text-sm text-gray-600">by {product.seller}</p>

            <div className="flex items-center space-x-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">({product.reviews})</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-blue-600">${product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
              )}
            </div>

            {product.stock < 10 && product.stock > 0 && (
              <Badge variant="destructive" className="text-xs">
                Only {product.stock} left
              </Badge>
            )}

            {product.stock === 0 && (
              <Badge variant="secondary" className="text-xs">
                Out of Stock
              </Badge>
            )}

            <Button onClick={handleQuickAddToCart} disabled={product.stock === 0} className="w-full mt-4">
              <ShoppingCart className="h-4 w-4 mr-2" />
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <AddToCartPopup 
        isOpen={showCartPopup} 
        onClose={() => setShowCartPopup(false)} 
        product={{
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          seller: product.seller,
          stock: product.stock,
        }}
        onAddToCart={handleAddToCart}
      />

      <AddToWishlistPopup 
        isOpen={showWishlistPopup} 
        onClose={() => setShowWishlistPopup(false)} 
        product={{
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          seller: product.seller,
          stock: product.stock,
        }}
        onAddToWishlist={handleWishlistToggle}
      />
    </>
  )
}
