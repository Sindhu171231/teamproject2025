"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductCard } from "@/components/product-card"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { mockProducts, type Product } from "@/lib/mock-data"

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("all")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [usingMockData, setUsingMockData] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    const search = searchParams.get("search")
    if (search) {
      setSearchQuery(search)
    }
  }, [searchParams])

  useEffect(() => {
    fetchProducts()
  }, [searchQuery, category, minPrice, maxPrice])

  const fetchProducts = async () => {
    setLoading(true)

    // If Supabase is not configured, use mock data immediately
    if (!isSupabaseConfigured()) {
      const filteredProducts = filterMockProducts()
      setProducts(filteredProducts)
      setUsingMockData(true)
      setLoading(false)
      return
    }

    try {
      let query = supabase.from("products").select(`
        *,
        seller:sellers(name)
      `)

      // Apply search filter
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
      }

      // Apply category filter
      if (category !== "all") {
        query = query.eq("type", category)
      }

      // Apply price filters
      if (minPrice) {
        query = query.gte("price", Number.parseFloat(minPrice))
      }
      if (maxPrice) {
        query = query.lte("price", Number.parseFloat(maxPrice))
      }

      const { data, error } = await query

      if (error) {
        console.warn("Database not available, using mock data:", error.message)
        const filteredProducts = filterMockProducts()
        setProducts(filteredProducts)
        setUsingMockData(true)
        return
      }

      if (data && data.length > 0) {
        setProducts(data)
        setUsingMockData(false)
      } else {
        // If no data in database, use filtered mock data
        const filteredProducts = filterMockProducts()
        setProducts(filteredProducts)
        setUsingMockData(true)
      }
    } catch (error) {
      console.warn("Error connecting to database, using mock data:", error)
      const filteredProducts = filterMockProducts()
      setProducts(filteredProducts)
      setUsingMockData(true)
    } finally {
      setLoading(false)
    }
  }

  const filterMockProducts = () => {
    let filteredProducts = [...mockProducts]

    if (searchQuery) {
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (category !== "all") {
      filteredProducts = filteredProducts.filter((p) => p.type === category)
    }

    if (minPrice) {
      filteredProducts = filteredProducts.filter((p) => p.price >= Number.parseFloat(minPrice))
    }

    if (maxPrice) {
      filteredProducts = filteredProducts.filter((p) => p.price <= Number.parseFloat(maxPrice))
    }

    return filteredProducts
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Our Products</h1>

      {usingMockData && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Demo Mode:</strong> Showing sample products with search and filter functionality. Connect to
            Supabase to see real data.
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="clothing">Clothing</SelectItem>
              <SelectItem value="home">Home & Garden</SelectItem>
              <SelectItem value="furniture">Furniture</SelectItem>
              <SelectItem value="sports">Sports</SelectItem>
              <SelectItem value="accessories">Accessories</SelectItem>
            </SelectContent>
          </Select>

          <Input placeholder="Min price" type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />

          <Input placeholder="Max price" type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80"></div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your search terms or filters.</p>
        </div>
      )}
    </main>
  )
}
