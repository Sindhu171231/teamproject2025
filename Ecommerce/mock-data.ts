// Mock data for the e-commerce platform

export interface User {
  id: string
  name: string
  email: string
  role: "customer" | "seller"
  avatar?: string
  createdAt: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  subcategory?: string
  images: string[]
  seller: {
    id: string
    name: string
    rating: number
    verified: boolean
  }
  rating: number
  reviewCount: number
  stock: number
  sold: number
  tags: string[]
  specifications?: Record<string, string>
  inStock: boolean
  featured: boolean
  createdAt: string
}

export interface Order {
  id: string
  customerId: string
  customerName: string
  items: {
    productId: string
    productName: string
    quantity: number
    price: number
    image: string
  }[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  paymentMethod: string
  createdAt: string
  updatedAt: string
}

export interface Review {
  id: string
  productId: string
  customerId: string
  customerName: string
  rating: number
  comment: string
  images?: string[]
  helpful: number
  createdAt: string
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "customer",
    avatar: "/placeholder.svg?height=80&width=80",
    createdAt: "2024-01-01",
  },
  {
    id: "seller-1",
    name: "TechStore Pro",
    email: "contact@techstore.com",
    role: "seller",
    avatar: "/placeholder.svg?height=80&width=80",
    createdAt: "2023-12-01",
  },
]

// Mock Products
export const mockProducts: Product[] = [
  {
    id: "prod-1",
    name: "Wireless Bluetooth Headphones",
    description:
      "Premium quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.",
    price: 79.99,
    originalPrice: 99.99,
    category: "Electronics",
    subcategory: "Audio",
    images: [
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
    ],
    seller: {
      id: "seller-1",
      name: "TechGear Pro",
      rating: 4.8,
      verified: true,
    },
    rating: 4.5,
    reviewCount: 1234,
    stock: 45,
    sold: 2890,
    tags: ["wireless", "bluetooth", "noise-cancelling", "premium"],
    specifications: {
      "Battery Life": "30 hours",
      Connectivity: "Bluetooth 5.0",
      Weight: "250g",
      Warranty: "2 years",
    },
    inStock: true,
    featured: true,
    createdAt: "2024-01-01",
  },
  {
    id: "prod-2",
    name: "Smart Fitness Watch",
    description:
      "Advanced fitness tracking with heart rate monitoring, GPS, and smartphone integration. Track your health and stay connected.",
    price: 199.99,
    originalPrice: 249.99,
    category: "Wearables",
    subcategory: "Smartwatches",
    images: [
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
    ],
    seller: {
      id: "seller-2",
      name: "FitTech Solutions",
      rating: 4.7,
      verified: true,
    },
    rating: 4.7,
    reviewCount: 856,
    stock: 12,
    sold: 1456,
    tags: ["fitness", "smartwatch", "health", "gps"],
    specifications: {
      Display: '1.4" AMOLED',
      Battery: "7 days",
      "Water Resistance": "5ATM",
      Sensors: "Heart Rate, GPS, Accelerometer",
    },
    inStock: true,
    featured: true,
    createdAt: "2024-01-05",
  },
  {
    id: "prod-3",
    name: "Organic Cotton T-Shirt",
    description:
      "Comfortable and sustainable organic cotton t-shirt. Available in multiple colors and sizes. Perfect for everyday wear.",
    price: 24.99,
    originalPrice: 34.99,
    category: "Clothing",
    subcategory: "T-Shirts",
    images: [
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
    ],
    seller: {
      id: "seller-3",
      name: "EcoWear",
      rating: 4.6,
      verified: true,
    },
    rating: 4.3,
    reviewCount: 567,
    stock: 89,
    sold: 3421,
    tags: ["organic", "cotton", "sustainable", "comfortable"],
    specifications: {
      Material: "100% Organic Cotton",
      Fit: "Regular",
      Care: "Machine Washable",
      Origin: "Fair Trade Certified",
    },
    inStock: true,
    featured: false,
    createdAt: "2024-01-10",
  },
]

// Mock Orders
export const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customerId: "user-1",
    customerName: "John Doe",
    items: [
      {
        productId: "prod-1",
        productName: "Wireless Bluetooth Headphones",
        quantity: 1,
        price: 79.99,
        image: "/placeholder.svg?height=60&width=60",
      },
    ],
    total: 79.99,
    status: "delivered",
    shippingAddress: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    paymentMethod: "Credit Card",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-18",
  },
  {
    id: "ORD-002",
    customerId: "user-1",
    customerName: "John Doe",
    items: [
      {
        productId: "prod-2",
        productName: "Smart Fitness Watch",
        quantity: 1,
        price: 199.99,
        image: "/placeholder.svg?height=60&width=60",
      },
    ],
    total: 199.99,
    status: "shipped",
    shippingAddress: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    paymentMethod: "PayPal",
    createdAt: "2024-01-12",
    updatedAt: "2024-01-14",
  },
]

// Mock Reviews
export const mockReviews: Review[] = [
  {
    id: "rev-1",
    productId: "prod-1",
    customerId: "user-1",
    customerName: "John D.",
    rating: 5,
    comment: "Excellent headphones! Great sound quality and battery life is amazing.",
    helpful: 12,
    createdAt: "2024-01-20",
  },
  {
    id: "rev-2",
    productId: "prod-1",
    customerId: "user-2",
    customerName: "Sarah M.",
    rating: 4,
    comment: "Good headphones, comfortable to wear for long periods. Noise cancellation works well.",
    helpful: 8,
    createdAt: "2024-01-18",
  },
]

// Helper functions
export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find((product) => product.id === id)
}

export const getOrdersByCustomerId = (customerId: string): Order[] => {
  return mockOrders.filter((order) => order.customerId === customerId)
}

export const getReviewsByProductId = (productId: string): Review[] => {
  return mockReviews.filter((review) => review.productId === productId)
}

export const getProductsByCategory = (category: string): Product[] => {
  return mockProducts.filter((product) => product.category === category)
}

export const getFeaturedProducts = (): Product[] => {
  return mockProducts.filter((product) => product.featured)
}
