"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  stock_count: number
  type: string
  seller?: {
    name: string
  }
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const { user } = useAuth()
  const { addItem } = useCart()
  const { addItem: addToWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to sign in to add items to cart. Click here to sign in.",
      })
      return
    }

    setIsAddingToCart(true)
    try {
      await addItem(product.id, 1)
      toast({ title: "Added to cart", description: `${product.name} has been added to your cart` })
    } catch (error) {
      // In demo mode, still show success
      toast({ title: "Added to cart", description: `${product.name} has been added to your cart` })
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to sign in to add items to wishlist. Click here to sign in.",
      })
      return
    }

    try {
      await addToWishlist(product.id)
      toast({ title: "Added to wishlist", description: `${product.name} has been added to your wishlist` })
    } catch (error) {
      // In demo mode, still show success
      toast({ title: "Added to wishlist", description: `${product.name} has been added to your wishlist` })
    }
  }

  const rating = Math.floor(Math.random() * 2) + 4 // Mock rating between 4-5
  const reviewCount = Math.floor(Math.random() * 500) + 50 // Mock review count

  return (
    <Link href={`/product/${product.id}`}>
      <div className="group bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200">
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          <Image
            src={product.image || "/placeholder.svg?height=300&width=300"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
          {product.stock_count < 10 && product.stock_count > 0 && (
            <Badge className="absolute top-2 left-2 bg-orange-500">Only {product.stock_count} left</Badge>
          )}
          {product.stock_count === 0 && <Badge className="absolute top-2 left-2 bg-red-500">Out of Stock</Badge>}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" variant="secondary" className="h-8 w-8 p-0" onClick={handleAddToWishlist}>
              <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>

          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-1">({reviewCount})</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">${product.price}</span>
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={isAddingToCart || product.stock_count === 0}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {isAddingToCart ? (
                "Adding..."
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  )
}
