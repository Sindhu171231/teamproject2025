export interface Product {
  id: string
  name: string
  description: string
  price: number
  original_price?: number
  image: string
  stock_count: number
  type: string
  seller_id: string
  is_trending?: boolean
  discount_percentage?: number
  seller?: {
    name: string
    shop_name?: string
  }
}

export interface Seller {
  id: string
  user_id?: string
  email: string
  name: string
  shop_name: string
  shop_description: string
  is_verified: boolean
}

export const mockSellers: Seller[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    email: "seller@demo.com",
    name: "Jane Seller",
    shop_name: "TechStore Inc",
    shop_description: "Your one-stop shop for electronics and gadgets",
    is_verified: true,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    email: "fashion@demo.com",
    name: "Fashion Hub Owner",
    shop_name: "Fashion Hub",
    shop_description: "Trendy clothing and accessories",
    is_verified: true,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    email: "home@demo.com",
    name: "Home Essentials Owner",
    shop_name: "Home Essentials",
    shop_description: "Everything for your home",
    is_verified: true,
  },
]

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Ergonomic Office Chair",
    description:
      "Comfortable and supportive chair designed for long working hours. Features lumbar support and adjustable height.",
    price: 199.99,
    original_price: 249.99,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    stock_count: 15,
    type: "furniture",
    seller_id: "550e8400-e29b-41d4-a716-446655440003",
    is_trending: true,
    discount_percentage: 20,
    seller: { name: "Home Essentials Owner", shop_name: "Home Essentials" },
  },
  {
    id: "2",
    name: "Portable Blender",
    description: "Compact and powerful blender for smoothies and shakes on the go. Perfect for healthy lifestyle.",
    price: 29.99,
    original_price: 39.99,
    image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=400&fit=crop",
    stock_count: 25,
    type: "electronics",
    seller_id: "550e8400-e29b-41d4-a716-446655440001",
    is_trending: true,
    discount_percentage: 25,
    seller: { name: "Jane Seller", shop_name: "TechStore Inc" },
  },
  {
    id: "3",
    name: "Wireless Bluetooth Headphones",
    description: "High-quality sound with noise cancellation and comfortable earcups. 30-hour battery life.",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    stock_count: 30,
    type: "electronics",
    seller_id: "550e8400-e29b-41d4-a716-446655440001",
    seller: { name: "Jane Seller", shop_name: "TechStore Inc" },
  },
  {
    id: "4",
    name: "Noise-Cancelling Earbuds",
    description: "Compact earbuds with excellent sound quality and active noise cancellation. Sweat-resistant design.",
    price: 89.99,
    original_price: 119.99,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
    stock_count: 20,
    type: "electronics",
    seller_id: "550e8400-e29b-41d4-a716-446655440001",
    is_trending: true,
    discount_percentage: 25,
    seller: { name: "Jane Seller", shop_name: "TechStore Inc" },
  },
  {
    id: "5",
    name: "Summer Dress",
    description: "Lightweight and breathable dress perfect for summer days. Available in multiple colors and sizes.",
    price: 35.99,
    original_price: 45.99,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop",
    stock_count: 12,
    type: "clothing",
    seller_id: "550e8400-e29b-41d4-a716-446655440002",
    is_trending: true,
    discount_percentage: 22,
    seller: { name: "Fashion Hub Owner", shop_name: "Fashion Hub" },
  },
  {
    id: "6",
    name: "Casual T-Shirt",
    description: "Comfortable cotton t-shirt for everyday wear. Pre-shrunk and machine washable.",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    stock_count: 50,
    type: "clothing",
    seller_id: "550e8400-e29b-41d4-a716-446655440002",
    seller: { name: "Fashion Hub Owner", shop_name: "Fashion Hub" },
  },
  {
    id: "7",
    name: "Smart Watch",
    description: "Feature-rich smartwatch with fitness tracking, heart rate monitor, and smartphone notifications.",
    price: 149.99,
    original_price: 199.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    stock_count: 8,
    type: "electronics",
    seller_id: "550e8400-e29b-41d4-a716-446655440001",
    is_trending: true,
    discount_percentage: 25,
    seller: { name: "Jane Seller", shop_name: "TechStore Inc" },
  },
  {
    id: "8",
    name: "Coffee Maker",
    description: "Programmable coffee maker with thermal carafe. Brews up to 12 cups of perfect coffee.",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop",
    stock_count: 18,
    type: "home",
    seller_id: "550e8400-e29b-41d4-a716-446655440003",
    seller: { name: "Home Essentials Owner", shop_name: "Home Essentials" },
  },
  {
    id: "9",
    name: "Yoga Mat",
    description: "Non-slip yoga mat with extra cushioning. Perfect for yoga, pilates, and other floor exercises.",
    price: 24.99,
    original_price: 29.99,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
    stock_count: 35,
    type: "sports",
    seller_id: "550e8400-e29b-41d4-a716-446655440003",
    is_trending: true,
    discount_percentage: 17,
    seller: { name: "Home Essentials Owner", shop_name: "Home Essentials" },
  },
  {
    id: "10",
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse with precision tracking. Long battery life and comfortable grip.",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
    stock_count: 42,
    type: "electronics",
    seller_id: "550e8400-e29b-41d4-a716-446655440001",
    seller: { name: "Jane Seller", shop_name: "TechStore Inc" },
  },
  {
    id: "11",
    name: "Travel Backpack",
    description: "Durable and spacious backpack with multiple compartments. Perfect for travel, work, or school.",
    price: 49.99,
    original_price: 59.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    stock_count: 22,
    type: "accessories",
    seller_id: "550e8400-e29b-41d4-a716-446655440002",
    is_trending: true,
    discount_percentage: 17,
    seller: { name: "Fashion Hub Owner", shop_name: "Fashion Hub" },
  },
  {
    id: "12",
    name: "LED Desk Lamp",
    description:
      "Adjustable LED desk lamp with multiple brightness levels and color temperatures. USB charging port included.",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    stock_count: 28,
    type: "home",
    seller_id: "550e8400-e29b-41d4-a716-446655440003",
    seller: { name: "Home Essentials Owner", shop_name: "Home Essentials" },
  },
  {
    id: "13",
    name: "Running Shoes",
    description: "Lightweight running shoes with excellent cushioning and breathable mesh upper.",
    price: 79.99,
    original_price: 99.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    stock_count: 25,
    type: "sports",
    seller_id: "550e8400-e29b-41d4-a716-446655440002",
    is_trending: true,
    discount_percentage: 20,
    seller: { name: "Fashion Hub Owner", shop_name: "Fashion Hub" },
  },
  {
    id: "14",
    name: "Skincare Set",
    description: "Complete skincare routine with cleanser, toner, serum, and moisturizer. Suitable for all skin types.",
    price: 59.99,
    original_price: 79.99,
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop",
    stock_count: 15,
    type: "beauty",
    seller_id: "550e8400-e29b-41d4-a716-446655440002",
    is_trending: true,
    discount_percentage: 25,
    seller: { name: "Fashion Hub Owner", shop_name: "Fashion Hub" },
  },
  {
    id: "15",
    name: "Bluetooth Speaker",
    description: "Portable Bluetooth speaker with 360-degree sound and waterproof design. 12-hour battery life.",
    price: 39.99,
    original_price: 49.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    stock_count: 30,
    type: "electronics",
    seller_id: "550e8400-e29b-41d4-a716-446655440001",
    is_trending: true,
    discount_percentage: 20,
    seller: { name: "Jane Seller", shop_name: "TechStore Inc" },
  },
]

// Demo users for testing
export const demoUsers = {
  customer: {
    email: "customer@demo.com",
    password: "demo123",
    name: "John Customer",
    user_type: "customer",
    id: "customer-demo-id",
  },
  seller: {
    email: "seller@demo.com",
    password: "demo123",
    name: "Jane Seller",
    user_type: "seller",
    id: "seller-demo-id",
    seller_id: "550e8400-e29b-41d4-a716-446655440001", // Links to TechStore Inc
  },
}

export const mockReviews = [
  {
    id: "1",
    product_id: "1",
    user_id: "user1",
    rating: 5,
    comment: "Excellent chair! Very comfortable for long work sessions. The lumbar support is fantastic.",
    created_at: "2024-01-15T10:30:00Z",
    user: { name: "Sarah Johnson" },
  },
  {
    id: "2",
    product_id: "1",
    user_id: "user2",
    rating: 4,
    comment: "Good quality chair, but assembly was a bit tricky. Worth the price though.",
    created_at: "2024-01-10T14:20:00Z",
    user: { name: "Mike Chen" },
  },
  {
    id: "3",
    product_id: "2",
    user_id: "user3",
    rating: 5,
    comment: "Perfect for my morning smoothies. Compact size fits perfectly in my kitchen. Highly recommend!",
    created_at: "2024-01-12T08:45:00Z",
    user: { name: "Emma Davis" },
  },
  {
    id: "4",
    product_id: "3",
    user_id: "user4",
    rating: 4,
    comment: "Great sound quality and battery life. The noise cancellation works well on flights.",
    created_at: "2024-01-08T16:15:00Z",
    user: { name: "Alex Rodriguez" },
  },
  {
    id: "5",
    product_id: "4",
    user_id: "user5",
    rating: 5,
    comment: "Amazing noise cancellation! These earbuds are perfect for my daily commute. Worth every penny!",
    created_at: "2024-01-05T12:30:00Z",
    user: { name: "Lisa Wang" },
  },
]
