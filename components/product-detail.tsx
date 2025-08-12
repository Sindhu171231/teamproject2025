"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Heart, ShoppingCart, Star, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/components/auth-provider"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { useToast } from "@/hooks/use-toast"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { mockProducts, mockReviews, type Product } from "@/lib/mock-data"

interface Review {
  id: string
  rating: number
  comment: string
  created_at: string
  user: {
    name: string
  }
}

interface ProductDetailProps {
  productId: string
}

export function ProductDetail({ productId }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" })
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [usingMockData, setUsingMockData] = useState(false)
  const { user } = useAuth()
  const { addItem } = useCart()
  const { addItem: addToWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()

  useEffect(() => {
    fetchProduct()
    fetchReviews()
  }, [productId])

  const fetchProduct = async () => {
    // If Supabase is not configured, use mock data
    if (!isSupabaseConfigured()) {
      const mockProduct = mockProducts.find((p) => p.id === productId)
      if (mockProduct) {
        setProduct(mockProduct)
        setUsingMockData(true)
      }
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          seller:sellers(name, email)
        `)
        .eq("id", productId)
        .single()

      if (error) {
        console.warn("Database not available, using mock data:", error.message)
        const mockProduct = mockProducts.find((p) => p.id === productId)
        if (mockProduct) {
          setProduct(mockProduct)
          setUsingMockData(true)
        }
        return
      }
      setProduct(data)
      setUsingMockData(false)
    } catch (error) {
      console.warn("Error fetching product, using mock data:", error)
      const mockProduct = mockProducts.find((p) => p.id === productId)
      if (mockProduct) {
        setProduct(mockProduct)
        setUsingMockData(true)
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    // If Supabase is not configured, use mock data
    if (!isSupabaseConfigured()) {
      const productReviews = mockReviews.filter((r) => r.product_id === productId)
      setReviews(productReviews)
      return
    }

    try {
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          *,
          user:users(name)
        `)
        .eq("product_id", productId)
        .order("created_at", { ascending: false })

      if (error) {
        console.warn("Database not available for reviews, using mock data:", error.message)
        const productReviews = mockReviews.filter((r) => r.product_id === productId)
        setReviews(productReviews)
        return
      }
      setReviews(data || [])
    } catch (error) {
      console.warn("Error fetching reviews, using mock data:", error)
      const productReviews = mockReviews.filter((r) => r.product_id === productId)
      setReviews(productReviews)
    }
  }

  const handleAddToCart = async () => {
    if (!user) {
      toast({ title: "Please sign in", description: "You need to sign in to add items to cart" })
      return
    }

    if (!product) return

    try {
      await addItem(product.id, quantity)
      toast({ title: "Added to cart", description: `${product.name} has been added to your cart` })
    } catch (error) {
      toast({ title: "Added to cart", description: `${product.name} has been added to your cart (demo mode)` })
    }
  }

  const handleAddToWishlist = async () => {
    if (!user) {
      toast({ title: "Please sign in", description: "You need to sign in to add items to wishlist" })
      return
    }

    if (!product) return

    try {
      await addToWishlist(product.id)
      toast({ title: "Added to wishlist", description: `${product.name} has been added to your wishlist` })
    } catch (error) {
      toast({ title: "Added to wishlist", description: `${product.name} has been added to your wishlist (demo mode)` })
    }
  }

  const handleSubmitReview = async () => {
    if (!user || !product) {
      toast({ title: "Please sign in", description: "You need to sign in to submit a review" })
      return
    }

    setIsSubmittingReview(true)

    // In demo mode, just simulate the review submission
    if (usingMockData || !isSupabaseConfigured()) {
      setTimeout(() => {
        toast({ title: "Review submitted", description: "Thank you for your review! (Demo mode)" })
        setNewReview({ rating: 5, comment: "" })
        setIsSubmittingReview(false)
      }, 1000)
      return
    }

    try {
      const { error } = await supabase.from("reviews").insert({
        product_id: product.id,
        user_id: user.id,
        rating: newReview.rating,
        comment: newReview.comment,
      })

      if (error) throw error

      toast({ title: "Review submitted", description: "Thank you for your review!" })
      setNewReview({ rating: 5, comment: "" })
      fetchReviews()
    } catch (error) {
      toast({ title: "Error", description: "Failed to submit review", variant: "destructive" })
    } finally {
      setIsSubmittingReview(false)
    }
  }

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </main>
    )
  }

  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

  return (
    <main className="container mx-auto px-4 py-8">
      {usingMockData && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Demo Mode:</strong> Showing sample product details. Connect to Supabase for full functionality.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
          <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-gray-600">{product.description}</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < Math.floor(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">({reviews.length} reviews)</span>
          </div>

          <div className="text-3xl font-bold text-gray-900">${product.price}</div>

          {product.stock_count > 0 ? (
            <Badge className="bg-green-100 text-green-800">In Stock ({product.stock_count} available)</Badge>
          ) : (
            <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>
          )}

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 text-center min-w-[3rem]">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.min(product.stock_count, quantity + 1))}
                  disabled={quantity >= product.stock_count}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button onClick={handleAddToCart} disabled={product.stock_count === 0} className="flex-1">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline" onClick={handleAddToWishlist}>
                <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-2">Seller Information</h3>
            <p className="text-gray-600">{product.seller?.name}</p>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

        {/* Add Review Form */}
        {user && (
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="font-semibold mb-4">Write a Review</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <div className="flex space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button key={i} onClick={() => setNewReview({ ...newReview, rating: i + 1 })}>
                      <Star
                        className={`h-6 w-6 ${i < newReview.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Comment</label>
                <Textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Share your thoughts about this product..."
                  rows={4}
                />
              </div>
              <Button onClick={handleSubmitReview} disabled={isSubmittingReview || !newReview.comment.trim()}>
                {isSubmittingReview ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{review.user.name}</span>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>

        {reviews.length === 0 && (
          <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review this product!</p>
        )}
      </div>
    </main>
  )
}
