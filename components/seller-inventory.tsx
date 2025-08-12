"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Plus, Minus, Trash2, Search, AlertTriangle, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { mockProducts, demoUsers, type Product, mockSellers } from "@/lib/mock-data"
import Link from "next/link"

interface InventoryItem extends Product {
  lastUpdated?: string
  reorderLevel: number
  supplier?: string
}

export function SellerInventory() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("name")

  // Check if user is seller by multiple methods
  const isSeller =
    user?.email === demoUsers.seller.email ||
    user?.user_metadata?.user_type === "seller" ||
    user?.user_metadata?.seller_id

  // Find seller info - create a default seller profile if user is marked as seller
  let sellerInfo =
    mockSellers.find((s) => s.email === user?.email) || mockSellers.find((s) => s.id === user?.user_metadata?.seller_id)

  // If user is marked as seller but not in mockSellers, create a default seller profile
  if (!sellerInfo && user?.user_metadata?.user_type === "seller") {
    sellerInfo = {
      id: user.id,
      email: user.email || "",
      name: user.user_metadata?.name || "Seller",
      shop_name: user.user_metadata?.shop_name || `${user.user_metadata?.name || "Seller"}'s Store`,
      shop_description: "Your online store powered by Trendify",
      is_verified: true,
    }
  }

  useEffect(() => {
    if (!user || !isSeller || !sellerInfo) {
      return
    }
    loadInventory()
  }, [user, isSeller, sellerInfo])

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </main>
    )
  }

  if (!user || !isSeller || !sellerInfo) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600">Please sign in as a seller to access inventory management.</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 max-w-md mx-auto mt-4">
            <p className="text-sm text-blue-800">
              <strong>Demo Seller:</strong> seller@demo.com / demo123
            </p>
          </div>
          <Link href="/auth">
            <Button>Sign In as Seller</Button>
          </Link>
        </div>
      </main>
    )
  }

  const loadInventory = () => {
    // Load seller's products with inventory data
    const sellerProducts = mockProducts.filter((p) => p.seller_id === "2") // TechStore Inc
    const sellerData = JSON.parse(localStorage.getItem(`seller_${user?.id}`) || "{}")

    const inventoryItems: InventoryItem[] = sellerProducts.map((product) => ({
      ...product,
      stock_count: sellerData.stockUpdates?.[product.id] ?? product.stock_count,
      lastUpdated: sellerData.lastUpdated?.[product.id] || new Date().toISOString(),
      reorderLevel: 10,
      supplier: "TechStore Suppliers",
    }))

    setInventory(inventoryItems)
  }

  const updateStock = (productId: string, newStock: number) => {
    const sellerData = JSON.parse(localStorage.getItem(`seller_${user?.id}`) || "{}")
    if (!sellerData.stockUpdates) sellerData.stockUpdates = {}
    if (!sellerData.lastUpdated) sellerData.lastUpdated = {}

    sellerData.stockUpdates[productId] = Math.max(0, newStock)
    sellerData.lastUpdated[productId] = new Date().toISOString()
    localStorage.setItem(`seller_${user?.id}`, JSON.stringify(sellerData))

    // Add activity log
    const activity = {
      type: "stock_updated",
      description: `Updated stock for product to ${newStock} units`,
      timestamp: new Date().toISOString(),
      productId,
    }

    const existingActivity = JSON.parse(localStorage.getItem(`seller_activity_${user?.id}`) || "[]")
    const updatedActivity = [activity, ...existingActivity].slice(0, 20)
    localStorage.setItem(`seller_activity_${user?.id}`, JSON.stringify(updatedActivity))

    loadInventory()
    toast({
      title: "Stock Updated",
      description: `Stock updated successfully`,
    })
  }

  const removeProduct = (productId: string) => {
    const product = inventory.find((p) => p.id === productId)

    // Add to removed products list
    const sellerData = JSON.parse(localStorage.getItem(`seller_${user?.id}`) || "{}")
    if (!sellerData.removedProducts) sellerData.removedProducts = []
    sellerData.removedProducts.push(productId)
    localStorage.setItem(`seller_${user?.id}`, JSON.stringify(sellerData))

    // Add activity log
    const activity = {
      type: "product_removed",
      description: `Removed "${product?.name}" from inventory`,
      timestamp: new Date().toISOString(),
      productId,
    }

    const existingActivity = JSON.parse(localStorage.getItem(`seller_activity_${user?.id}`) || "[]")
    const updatedActivity = [activity, ...existingActivity].slice(0, 20)
    localStorage.setItem(`seller_activity_${user?.id}`, JSON.stringify(updatedActivity))

    loadInventory()
    toast({
      title: "Product Removed",
      description: `${product?.name} has been removed from inventory`,
    })
  }

  const filteredInventory = inventory
    .filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFilter =
        filterStatus === "all" ||
        (filterStatus === "low_stock" && item.stock_count < item.reorderLevel) ||
        (filterStatus === "out_of_stock" && item.stock_count === 0) ||
        (filterStatus === "in_stock" && item.stock_count > 0)

      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "stock":
          return b.stock_count - a.stock_count
        case "price":
          return b.price - a.price
        default:
          return 0
      }
    })

  const getStockStatus = (item: InventoryItem) => {
    if (item.stock_count === 0) return { label: "Out of Stock", color: "bg-red-100 text-red-800" }
    if (item.stock_count < item.reorderLevel) return { label: "Low Stock", color: "bg-orange-100 text-orange-800" }
    return { label: "In Stock", color: "bg-green-100 text-green-800" }
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="outline" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Management</h1>
        <p className="text-gray-600">Manage your product stock and inventory</p>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
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

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="in_stock">In Stock</SelectItem>
                <SelectItem value="low_stock">Low Stock</SelectItem>
                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="stock">Stock Level</SelectItem>
                <SelectItem value="price">Price</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={() => router.push("/seller/add-product")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold">{inventory.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold">{inventory.filter((i) => i.stock_count < i.reorderLevel).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold text-sm">0</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold">{inventory.filter((i) => i.stock_count === 0).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">$</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold">
                  ${inventory.reduce((sum, item) => sum + item.price * item.stock_count, 0).toFixed(0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
          <CardDescription>Manage stock levels and product details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredInventory.map((item) => {
              const status = getStockStatus(item)
              return (
                <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-1">{item.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-lg font-bold text-green-600">${item.price}</span>
                      <Badge className={status.color}>{status.label}</Badge>
                      {item.stock_count < item.reorderLevel && (
                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                          Reorder Soon
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Current Stock</p>
                      <p className="text-xl font-bold">{item.stock_count}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStock(item.id, item.stock_count - 1)}
                        disabled={item.stock_count <= 0}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => updateStock(item.id, item.stock_count + 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        onClick={() => updateStock(item.id, item.stock_count + 50)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Restock +50
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeProduct(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredInventory.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
