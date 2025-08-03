"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Package,
  DollarSign,
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  AlertTriangle,
  Bell,
  Settings,
  LogOut,
  Store,
  ShoppingCart,
  Eye,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "../../../auth-context"
import { useRouter } from "next/navigation"

// Mock data for seller dashboard
const sellerStats = {
  totalProducts: 45,
  totalRevenue: 12450.75,
  totalOrders: 128,
  totalCustomers: 89,
}

const mockProducts = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    price: 79.99,
    stock: 25,
    category: "Electronics",
    status: "Active",
    image: "/placeholder.svg?height=60&width=60&text=Headphones",
    sales: 45,
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: 199.99,
    stock: 12,
    category: "Electronics",
    status: "Active",
    image: "/placeholder.svg?height=60&width=60&text=Smart+Watch",
    sales: 23,
  },
  {
    id: 3,
    name: "Organic Cotton T-Shirt",
    price: 24.99,
    stock: 0,
    category: "Clothing",
    status: "Out of Stock",
    image: "/placeholder.svg?height=60&width=60&text=T-Shirt",
    sales: 67,
  },
  {
    id: 4,
    name: "Professional Camera Lens",
    price: 299.99,
    stock: 8,
    category: "Electronics",
    status: "Low Stock",
    image: "/placeholder.svg?height=60&width=60&text=Camera+Lens",
    sales: 12,
  },
  {
    id: 5,
    name: "Gaming Mechanical Keyboard",
    price: 149.99,
    stock: 18,
    category: "Electronics",
    status: "Active",
    image: "/placeholder.svg?height=60&width=60&text=Gaming+Keyboard",
    sales: 34,
  },
]

const recentOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    product: "Wireless Headphones",
    amount: 79.99,
    status: "Processing",
    date: "2024-01-15",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    product: "Smart Watch",
    amount: 199.99,
    status: "Shipped",
    date: "2024-01-14",
  },
  {
    id: "ORD-003",
    customer: "Mike Johnson",
    product: "T-Shirt",
    amount: 24.99,
    status: "Delivered",
    date: "2024-01-13",
  },
]

const notifications = [
  {
    id: 1,
    type: "stock",
    message: "Professional Camera Lens is running low on stock (8 remaining)",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: 2,
    type: "order",
    message: "New order received: ORD-001",
    time: "4 hours ago",
    unread: true,
  },
  {
    id: 3,
    type: "review",
    message: "New 5-star review for Wireless Headphones",
    time: "1 day ago",
    unread: false,
  },
]

export default function SellerDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState(mockProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    image: "",
  })

  // Redirect if not seller
  useEffect(() => {
    if (user && user.role !== "seller") {
      router.push("/customer/dashboard")
    }
  }, [user, router])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || product.category === filterCategory
    const matchesStatus = filterStatus === "all" || product.status === filterStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price && newProduct.stock && newProduct.category) {
      const product = {
        id: products.length + 1,
        name: newProduct.name,
        price: Number.parseFloat(newProduct.price),
        stock: Number.parseInt(newProduct.stock),
        category: newProduct.category,
        status: Number.parseInt(newProduct.stock) > 0 ? "Active" : "Out of Stock",
        image: "/placeholder.svg?height=60&width=60&text=" + encodeURIComponent(newProduct.name),
        sales: 0,
      }
      setProducts([...products, product])
      setNewProduct({ name: "", price: "", stock: "", category: "", description: "", image: "" })
      setIsAddProductOpen(false)
    }
  }

  const handleUpdateStock = (productId: number, newStock: number) => {
    setProducts(
      products.map((product) =>
        product.id === productId
          ? {
              ...product,
              stock: newStock,
              status: newStock === 0 ? "Out of Stock" : newStock < 10 ? "Low Stock" : "Active",
            }
          : product,
      ),
    )
  }

  const handleDeleteProduct = (productId: number) => {
    setProducts(products.filter((product) => product.id !== productId))
  }

  if (user?.role !== "seller") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>This page is only accessible to sellers.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button className="w-full">Go to Homepage</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Store className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Seller Portal</span>
            </Link>

            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon">
                <BarChart3 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="relative bg-transparent">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "S"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src="/placeholder.svg?height=80&width=80" />
                  <AvatarFallback>
                    {user?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "S"}
                  </AvatarFallback>
                </Avatar>
                <CardTitle>{user?.name || "Jane Seller"}</CardTitle>
                <CardDescription>{user?.email || "jane.seller@example.com"}</CardDescription>
                <Badge className="mt-2">Verified Seller</Badge>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  <Button variant="default" className="w-full justify-start">
                    <Store className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                  <Link href="/seller/products">
                    <Button variant="ghost" className="w-full justify-start">
                      <Package className="h-4 w-4 mr-2" />
                      Products
                    </Button>
                  </Link>
                  <Link href="/seller/orders">
                    <Button variant="ghost" className="w-full justify-start">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Orders
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Customers
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analytics
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-red-600" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </nav>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                  <Badge variant="destructive" className="ml-auto">
                    {notifications.filter((n) => n.unread).length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.slice(0, 3).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg text-sm ${
                        notification.unread ? "bg-blue-50 border-l-4 border-blue-500" : "bg-gray-50"
                      }`}
                    >
                      <p className="font-medium">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Welcome Section */}
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name?.split(" ")[0] || "Seller"}! 🏪</h1>
              <p className="text-gray-600">Manage your store and track your business performance</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Products</p>
                      <p className="text-2xl font-bold">{sellerStats.totalProducts}</p>
                      <p className="text-xs text-green-600">+3 this week</p>
                    </div>
                    <Package className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold">${sellerStats.totalRevenue}</p>
                      <p className="text-xs text-green-600">+12% this month</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold">{sellerStats.totalOrders}</p>
                      <p className="text-xs text-blue-600">+8 today</p>
                    </div>
                    <ShoppingCart className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Customers</p>
                      <p className="text-2xl font-bold">{sellerStats.totalCustomers}</p>
                      <p className="text-xs text-orange-600">+5 this week</p>
                    </div>
                    <Users className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Product Management */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Product Management</CardTitle>
                  <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add New Product</DialogTitle>
                        <DialogDescription>Fill in the details to add a new product to your store.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Product Name</Label>
                          <Input
                            id="name"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            placeholder="Enter product name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="price">Price ($)</Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <Label htmlFor="stock">Stock Quantity</Label>
                          <Input
                            id="stock"
                            type="number"
                            value={newProduct.stock}
                            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Select
                            value={newProduct.category}
                            onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Electronics">Electronics</SelectItem>
                              <SelectItem value="Clothing">Clothing</SelectItem>
                              <SelectItem value="Home">Home & Garden</SelectItem>
                              <SelectItem value="Sports">Sports & Outdoors</SelectItem>
                              <SelectItem value="Books">Books</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                            placeholder="Product description..."
                            rows={3}
                          />
                        </div>
                        <Button onClick={handleAddProduct} className="w-full">
                          Add Product
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Clothing">Clothing</SelectItem>
                      <SelectItem value="Home">Home & Garden</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Low Stock">Low Stock</SelectItem>
                      <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Products List */}
                <div className="space-y-4">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={60}
                          height={60}
                          className="rounded-md"
                        />
                        <div>
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-sm text-gray-600">{product.category}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant={
                                product.status === "Active"
                                  ? "default"
                                  : product.status === "Low Stock"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {product.status}
                            </Badge>
                            {product.status === "Low Stock" && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">${product.price}</p>
                        <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                        <p className="text-sm text-gray-600">Sales: {product.sales}</p>
                        <div className="flex gap-2 mt-2">
                          <Input
                            type="number"
                            value={product.stock}
                            onChange={(e) => handleUpdateStock(product.id, Number.parseInt(e.target.value) || 0)}
                            className="w-20 h-8"
                            min="0"
                          />
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Recent Orders</CardTitle>
                  <Link href="/seller/orders">
                    <Button variant="outline" size="sm">
                      View All Orders
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <p className="font-semibold">{order.id}</p>
                        <p className="text-sm text-gray-600">{order.customer}</p>
                        <p className="text-sm text-gray-600">{order.product}</p>
                        <p className="text-sm text-gray-600">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${order.amount}</p>
                        <Badge
                          variant={
                            order.status === "Delivered"
                              ? "default"
                              : order.status === "Shipped"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {order.status}
                        </Badge>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
