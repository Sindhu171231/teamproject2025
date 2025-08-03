"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Search, ShoppingCart, Heart, User, Menu, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductCard, type Product } from "@/components/ProductCard"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { debounce } from "@/lib/utils"

// Mock products data
const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Premium Cotton T-Shirt",
    price: 29.99,
    originalPrice: 39.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    category: "clothing",
    rating: 4.5,
    reviewCount: 128,
    inStock: true,
    isNew: true,
    sku: "CLO-PRM-001",
    maxQuantity: 10,
    description: "Comfortable premium cotton t-shirt perfect for everyday wear.",
    tags: ["cotton", "casual", "comfortable"],
  },
  {
    id: "2",
    name: "Designer Leather Handbag",
    price: 199.99,
    originalPrice: 299.99,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop",
    category: "accessories",
    rating: 4.8,
    reviewCount: 89,
    inStock: true,
    isFeatured: true,
    sku: "ACC-LEA-002",
    maxQuantity: 5,
    description: "Elegant designer leather handbag with premium craftsmanship.",
    tags: ["leather", "designer", "handbag"],
  },
  {
    id: "3",
    name: "Running Sneakers",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    category: "shoes",
    rating: 4.3,
    reviewCount: 256,
    inStock: true,
    sku: "SHO-RUN-003",
    maxQuantity: 8,
    description: "High-performance running sneakers for athletes and fitness enthusiasts.",
    tags: ["running", "athletic", "comfortable"],
  },
  {
    id: "4",
    name: "Wireless Bluetooth Headphones",
    price: 149.99,
    originalPrice: 199.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    category: "electronics",
    rating: 4.6,
    reviewCount: 342,
    inStock: false,
    sku: "ELE-HEA-004",
    maxQuantity: 3,
    description: "Premium wireless headphones with noise cancellation technology.",
    tags: ["wireless", "bluetooth", "audio"],
  },
  {
    id: "5",
    name: "Vintage Denim Jacket",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
    category: "clothing",
    rating: 4.4,
    reviewCount: 167,
    inStock: true,
    isNew: true,
    sku: "CLO-DEN-005",
    maxQuantity: 6,
    description: "Classic vintage-style denim jacket with authentic wash and fit.",
    tags: ["denim", "vintage", "jacket"],
  },
  {
    id: "6",
    name: "Smart Fitness Watch",
    price: 249.99,
    originalPrice: 329.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    category: "electronics",
    rating: 4.7,
    reviewCount: 423,
    inStock: true,
    isFeatured: true,
    sku: "ELE-WAT-006",
    maxQuantity: 4,
    description: "Advanced fitness tracking watch with heart rate monitoring.",
    tags: ["fitness", "smartwatch", "health"],
  },
]

const CATEGORIES = [
  { id: "all", name: "All Categories", count: MOCK_PRODUCTS.length },
  { id: "clothing", name: "Clothing", count: MOCK_PRODUCTS.filter((p) => p.category === "clothing").length },
  { id: "accessories", name: "Accessories", count: MOCK_PRODUCTS.filter((p) => p.category === "accessories").length },
  { id: "shoes", name: "Shoes", count: MOCK_PRODUCTS.filter((p) => p.category === "shoes").length },
  { id: "electronics", name: "Electronics", count: MOCK_PRODUCTS.filter((p) => p.category === "electronics").length },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [isLoading, setIsLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const { user, isAuthenticated } = useAuth()
  const { getTotalItems } = useCart()
  const { getTotalItems: getWishlistItems } = useWishlist()

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  // Debounced search
  const debouncedSearch = useMemo(
    () =>
      debounce((query: string) => {
        setSearchQuery(query)
      }, 300),
    [],
  )

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = MOCK_PRODUCTS

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      default: // featured
        filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
    }

    return filtered
  }, [searchQuery, selectedCategory, sortBy])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value)
  }

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">Discover Your Style</h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 animate-fade-in">
              Shop the latest trends in fashion, electronics, and lifestyle products
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
              <Link href="/hot-deals">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90">
                  <Zap className="w-5 h-5 mr-2" />
                  Shop Hot Deals
                </Button>
              </Link>
              <Link href="/categories">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-purple-600 bg-transparent"
                >
                  Browse Categories
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary mb-2">10K+</div>
                <div className="text-sm text-muted-foreground">Products</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary mb-2">50K+</div>
                <div className="text-sm text-muted-foreground">Happy Customers</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary mb-2">99%</div>
                <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Filters and Sort */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="text-xs"
                >
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-square w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-6 w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-muted mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                <span className="font-bold text-xl">Trendify</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Your ultimate destination for fashion, electronics, and lifestyle products.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/hot-deals" className="text-muted-foreground hover:text-foreground">
                    Hot Deals
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="text-muted-foreground hover:text-foreground">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="text-muted-foreground hover:text-foreground">
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="text-muted-foreground hover:text-foreground">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="text-muted-foreground hover:text-foreground">
                    Returns
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-muted-foreground hover:text-foreground">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Trendify. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
