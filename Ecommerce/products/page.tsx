"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { TrendingUp, Search, Filter, Grid3X3, List, ArrowLeft } from "lucide-react"
import Link from "next/link"
import ProductCard from "../../ProductCard"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  image: string
  seller: string
  category: string
  badge?: string
  inStock: boolean
  stock: number
}

const products: Product[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    price: 79.99,
    originalPrice: 129.99,
    rating: 4.5,
    reviews: 1234,
    image: "/placeholder.svg?height=300&width=300&text=Headphones",
    seller: "AudioTech",
    category: "Electronics",
    badge: "Best Seller",
    inStock: true,
    stock: 45,
  },
  {
    id: "2",
    name: "Smart Fitness Watch",
    price: 199.99,
    rating: 4.3,
    reviews: 856,
    image: "/placeholder.svg?height=300&width=300&text=Smart+Watch",
    seller: "FitTech",
    category: "Electronics",
    inStock: true,
    stock: 23,
  },
  {
    id: "3",
    name: "Organic Cotton T-Shirt",
    price: 24.99,
    originalPrice: 39.99,
    rating: 4.7,
    reviews: 432,
    image: "/placeholder.svg?height=300&width=300&text=T-Shirt",
    seller: "EcoWear",
    category: "Clothing",
    badge: "Eco-Friendly",
    inStock: true,
    stock: 67,
  },
  {
    id: "4",
    name: "Stainless Steel Water Bottle",
    price: 29.99,
    rating: 4.6,
    reviews: 789,
    image: "/placeholder.svg?height=300&width=300&text=Water+Bottle",
    seller: "HydroLife",
    category: "Home & Garden",
    inStock: true,
    stock: 156,
  },
  {
    id: "5",
    name: "Gaming Mechanical Keyboard",
    price: 149.99,
    originalPrice: 199.99,
    rating: 4.8,
    reviews: 1567,
    image: "/placeholder.svg?height=300&width=300&text=Keyboard",
    seller: "GameGear",
    category: "Electronics",
    badge: "Gaming",
    inStock: true,
    stock: 34,
  },
  {
    id: "6",
    name: "Yoga Mat Premium",
    price: 49.99,
    rating: 4.4,
    reviews: 623,
    image: "/placeholder.svg?height=300&width=300&text=Yoga+Mat",
    seller: "FitLife",
    category: "Sports",
    inStock: true,
    stock: 89,
  },
  {
    id: "7",
    name: "LED Desk Lamp",
    price: 39.99,
    originalPrice: 59.99,
    rating: 4.2,
    reviews: 345,
    image: "/placeholder.svg?height=300&width=300&text=Desk+Lamp",
    seller: "LightPro",
    category: "Home & Garden",
    inStock: true,
    stock: 78,
  },
  {
    id: "8",
    name: "Wireless Phone Charger",
    price: 34.99,
    rating: 4.1,
    reviews: 567,
    image: "/placeholder.svg?height=300&width=300&text=Wireless+Charger",
    seller: "ChargeTech",
    category: "Electronics",
    inStock: true,
    stock: 123,
  },
  {
    id: "9",
    name: "Premium Coffee Beans 1kg",
    price: 18.99,
    rating: 4.9,
    reviews: 2341,
    image: "/placeholder.svg?height=300&width=300&text=Coffee+Beans",
    seller: "BrewMaster",
    category: "Food & Beverages",
    badge: "Premium",
    inStock: true,
    stock: 234,
  },
  {
    id: "10",
    name: "Skincare Serum Set",
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.6,
    reviews: 1876,
    image: "/placeholder.svg?height=300&width=300&text=Skincare+Set",
    seller: "BeautyPro",
    category: "Beauty & Personal Care",
    badge: "Bestseller",
    inStock: true,
    stock: 56,
  },
]

const categories = [
  "All",
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Sports",
  "Food & Beverages",
  "Beauty & Personal Care",
]

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [priceRange, setPriceRange] = useState([0, 500])
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filteredProducts, setFilteredProducts] = useState(products)

  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]

      return matchesSearch && matchesCategory && matchesPrice
    })

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
      case "reviews":
        filtered.sort((a, b) => b.reviews - a.reviews)
        break
      default:
        // Keep original order for "featured"
        break
    }

    setFilteredProducts(filtered)
  }, [searchTerm, selectedCategory, priceRange, sortBy])

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
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </h3>

                {/* Search */}
                <div className="space-y-2 mb-6">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="space-y-2 mb-6">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="space-y-2 mb-6">
                  <label className="text-sm font-medium">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <Slider value={priceRange} onValueChange={setPriceRange} max={500} step={10} className="w-full" />
                </div>

                {/* Sort By */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="reviews">Most Reviews</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Section */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Products</h1>
                <p className="text-gray-600">
                  Showing {filteredProducts.length} of {products.length} products
                </p>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Products Grid/List */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} viewMode={viewMode} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
