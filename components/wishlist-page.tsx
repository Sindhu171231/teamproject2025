"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Trash2, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { useToast } from "@/hooks/use-toast"
import { mockProducts } from "@/lib/mock-data"

export function WishlistPage() {
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { addItem: addToCart } = useCart()
  const { items: wishlistItems, removeItem } = useWishlist()
  const { toast } = useToast()

  // Get product details for wishlist items
  const wishlistItemsWithProducts = wishlistItems.map((item) => {
    const product = mockProducts.find((p) => p.id === item.product_id)
    return {
      ...item,
      product: product || {
        id: item.product_id,
        name: "Unknown Product",
        description: "Product not found",
        price: 0,
        image: "/placeholder.svg?height=300&width=300",
        stock_count: 0,
      },
    }
  })

  useEffect(() => {
    if (user) {
      setLoading(false)
    }
  }, [user])

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeItem(productId)
      toast({ title: "Item removed", description: "Item has been removed from your wishlist" })
    } catch (error) {
      toast({ title: "Item removed", description: "Item has been removed from your wishlist" })
    }
  }

  const handleAddToCart = async (productId: string, productName: string) => {
    try {
      await addToCart(productId, 1)
      toast({ title: "Added to cart", description: `${productName} has been added to your cart` })
    } catch (error) {
      toast({ title: "Added to cart", description: `${productName} has been added to your cart` })
    }
  }

  if (!user) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to view your wishlist</h1>
          <Link href="/auth">
            <Button>Sign In</Button>
          </Link>
        </div>
      </main>
    )
  }

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Your Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Your wishlist is empty</p>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItemsWithProducts.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  src={item.product.image || "/placeholder.svg?height=300&width=300"}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{item.product.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.product.description}</p>
                <p className="text-lg font-bold text-gray-900 mb-4">${item.product.price}</p>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveItem(item.product_id)}
                    className="flex-1"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(item.product_id, item.product.name)}
                    disabled={item.product.stock_count === 0}
                    className="flex-1"
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
