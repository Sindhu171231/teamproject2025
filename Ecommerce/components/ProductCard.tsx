"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Star, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { useAuth } from "@/contexts/auth-context"
import AddToCartPopup from "../AddToCartPopup"
import { formatPrice, calculateDiscount } from "@/lib/utils"
import { toast } from "sonner"

export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating: number
  reviewCount: number
  inStock: boolean
  stock: number
  seller: string
  isNew?: boolean
  isFeatured?: boolean
  description?: string
  sku?: string
  tags?: string[]
}

interface ProductCardProps {
  product: Product
  className?: string
  showQuickView?: boolean
  showAddToCart?: boolean
  showWishlist?: boolean
}

export function ProductCard({
  product,
  className = "",
  showQuickView = true,
  showAddToCart = true,
  showWishlist = true,
}: ProductCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const [showCartPopup, setShowCartPopup] = useState(false)
  const { user } = useAuth()
  const { addToCart, isInCart, getItemQuantity } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()

  const discount = product.originalPrice ? calculateDiscount(product.originalPrice, product.price) : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      window.location.href = "/auth/login"
      return
    }

    if (!product.inStock) {
      toast.error("Product is out of stock")
      return
    }

    setShowCartPopup(true)
  }

  const handleCartPopupAddToCart = (productId: string, quantity: number) => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        seller: product.seller,
        category: product.category,
        stock: product.stock,
      },
      quantity,
    )
    setShowCartPopup(false)
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      window.location.href = "/auth/login"
      return
    }

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category,
        rating: product.rating,
        reviewCount: product.reviewCount,
        inStock: product.inStock,
        seller: product.seller,
      })
    }
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // TODO: Implement quick view modal
    console.log("Quick view for product:", product.id)
  }

  return (
    <>
      <Card className={`group relative overflow-hidden product-card-hover ${className}`}>
        <div className="relative aspect-square overflow-hidden">
          {/* Product Image */}
          <Link href={`/products/${product.id}`}>
            <div className="relative w-full h-full bg-gray-100">
              {!imageError ? (
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className={`object-cover transition-all duration-300 group-hover:scale-105 ${
                    isImageLoading ? "blur-sm" : "blur-0"
                  }`}
                  onLoad={() => setIsImageLoading(false)}
                  onError={() => {
                    setImageError(true)
                    setIsImageLoading(false)
                  }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <div className="text-gray-400 text-center">
                    <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-lg flex items-center justify-center">
                      <Eye className="w-8 h-8" />
                    </div>
                    <p className="text-sm">Image not available</p>
                  </div>
                </div>
              )}

              {/* Loading shimmer */}
              {isImageLoading && !imageError && <div className="absolute inset-0 shimmer" />}
            </div>
          </Link>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && (
              <Badge variant="secondary" className="bg-green-500 text-white">
                New
              </Badge>
            )}
            {product.isFeatured && (
              <Badge variant="secondary" className="bg-purple-500 text-white">
                Featured
              </Badge>
            )}
            {discount > 0 && <Badge variant="destructive">-{discount}%</Badge>}
            {!product.inStock && (
              <Badge variant="secondary" className="bg-gray-500 text-white">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          {showWishlist && (
            <Button
              variant="ghost"
              size="icon"
              className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                isInWishlist(product.id) ? "text-red-500 hover:text-red-600" : "text-gray-600 hover:text-red-500"
              }`}
              onClick={handleWishlistToggle}
            >
              <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
            </Button>
          )}

          {/* Quick Actions Overlay */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="flex gap-2">
              {showQuickView && (
                <Button variant="secondary" size="sm" className="flex-1" onClick={handleQuickView}>
                  <Eye className="w-4 h-4 mr-1" />
                  Quick View
                </Button>
              )}
              {showAddToCart && (
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  {isInCart(product.id) ? `In Cart (${getItemQuantity(product.id)})` : "Add to Cart"}
                </Button>
              )}
            </div>
          </div>
        </div>

        <CardContent className="p-4">
          <Link href={`/products/${product.id}`}>
            {/* Category */}
            <p className="text-sm text-muted-foreground mb-1 capitalize">{product.category}</p>

            {/* Product Name */}
            <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            {/* Stock Status */}
            {product.inStock ? (
              <p className="text-xs text-green-600 mt-1">In Stock ({product.stock} available)</p>
            ) : (
              <p className="text-xs text-red-600 mt-1">Out of Stock</p>
            )}
          </Link>
        </CardContent>
      </Card>

      {/* Add to Cart Popup */}
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
        onAddToCart={handleCartPopupAddToCart}
      />
    </>
  )
}

export default ProductCard
