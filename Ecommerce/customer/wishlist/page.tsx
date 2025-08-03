"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, ArrowLeft, Trash2, Star } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import { useWishlist } from "../../../wishlist-context"
import { useCart } from "../../../cart-context"
import { useAuth } from "../../../auth-context"

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCart } = useCart()
  const { user } = useAuth()

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      seller: item.seller,
      stock: item.stock,
    })
    // Optionally remove from wishlist after adding to cart
    // removeFromWishlist(item.id)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Please Login</h2>
            <p className="text-gray-600 mb-6">You need to be logged in to view your wishlist.</p>
            <Link href="/auth/login">
              <Button className="w-full">Login to Continue</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center mb-8">
            <Link href="/">
              <Button variant="ghost" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">My Wishlist</h1>
          </div>

          <Card className="text-center py-16">
            <CardContent>
              <Heart className="h-24 w-24 text-gray-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
              <p className="text-gray-600 mb-8">Save items you love by clicking the heart icon.</p>
              <Link href="/products">
                <Button size="lg">Start Shopping</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link href="/">
              <Button variant="ghost" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">My Wishlist ({items.length} items)</h1>
          </div>

          <Button variant="outline" onClick={clearWishlist} className="text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Wishlist
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="group hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  width={300}
                  height={300}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 text-red-500 hover:text-red-600 bg-white/80 hover:bg-white"
                  onClick={() => removeFromWishlist(item.id)}
                >
                  <Heart className="h-5 w-5 fill-current" />
                </Button>
              </div>

              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {item.name}
                  </h3>

                  <p className="text-sm text-gray-600">by {item.seller}</p>

                  <div className="flex items-center space-x-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(item.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({item.reviews})</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-blue-600">${item.price}</span>
                  </div>

                  {item.stock < 10 && item.stock > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      Only {item.stock} left
                    </Badge>
                  )}

                  {item.stock === 0 && (
                    <Badge variant="secondary" className="text-xs">
                      Out of Stock
                    </Badge>
                  )}

                  <div className="flex space-x-2 pt-2">
                    <Button
                      onClick={() => handleAddToCart(item)}
                      disabled={item.stock === 0}
                      className="flex-1"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {item.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeFromWishlist(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
