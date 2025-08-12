"use client"

import { useEffect, useState } from "react"
import { ProductCard } from "@/components/product-card"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { mockProducts, type Product } from "@/lib/mock-data"

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [usingMockData, setUsingMockData] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    // If Supabase is not configured, use mock data immediately
    if (!isSupabaseConfigured()) {
      setProducts(mockProducts.slice(0, 8))
      setUsingMockData(true)
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          seller:sellers(name)
        `)
        .limit(8)

      if (error) {
        console.warn("Database not available, using mock data:", error.message)
        setProducts(mockProducts.slice(0, 8))
        setUsingMockData(true)
        return
      }

      if (data && data.length > 0) {
        setProducts(data)
        setUsingMockData(false)
      } else {
        // If no data in database, use mock data
        setProducts(mockProducts.slice(0, 8))
        setUsingMockData(true)
      }
    } catch (error) {
      console.warn("Error connecting to database, using mock data:", error)
      setProducts(mockProducts.slice(0, 8))
      setUsingMockData(true)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80"></div>
        ))}
      </div>
    )
  }

  return (
    <div>
      {usingMockData && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Demo Mode:</strong> Showing sample products. Connect to Supabase to see real data.
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
