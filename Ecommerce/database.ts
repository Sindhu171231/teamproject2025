import { supabase } from "./supabase"
import type { Database } from "./supabase"

type Tables = Database["public"]["Tables"]

// Product functions
export async function getProducts(filters?: {
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  featured?: boolean
  limit?: number
}) {
  let query = supabase
    .from("products")
    .select(`
      *,
      sellers!inner(business_name, verified, rating),
      categories(name)
    `)
    .eq("active", true)

  if (filters?.category && filters.category !== "All") {
    query = query.eq("categories.name", filters.category)
  }

  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  if (filters?.minPrice) {
    query = query.gte("price", filters.minPrice)
  }

  if (filters?.maxPrice) {
    query = query.lte("price", filters.maxPrice)
  }

  if (filters?.featured) {
    query = query.eq("featured", true)
  }

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  const { data, error } = await query.order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }

  return data || []
}

export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      sellers!inner(business_name, verified, rating),
      categories(name)
    `)
    .eq("id", id)
    .eq("active", true)
    .single()

  if (error) {
    console.error("Error fetching product:", error)
    return null
  }

  return data
}

export async function createProduct(product: Tables["products"]["Insert"]) {
  const { data, error } = await supabase.from("products").insert(product).select().single()

  if (error) {
    console.error("Error creating product:", error)
    throw error
  }

  return data
}

export async function updateProduct(id: string, updates: Tables["products"]["Update"]) {
  const { data, error } = await supabase.from("products").update(updates).eq("id", id).select().single()

  if (error) {
    console.error("Error updating product:", error)
    throw error
  }

  return data
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from("products").update({ active: false }).eq("id", id)

  if (error) {
    console.error("Error deleting product:", error)
    throw error
  }
}

// User functions
export async function createUser(user: Tables["users"]["Insert"]) {
  const { data, error } = await supabase.from("users").insert(user).select().single()

  if (error) {
    console.error("Error creating user:", error)
    throw error
  }

  return data
}

export async function getUserByEmail(email: string) {
  const { data, error } = await supabase.from("users").select("*").eq("email", email).single()

  if (error) {
    console.error("Error fetching user:", error)
    return null
  }

  return data
}

// Seller functions
export async function createSeller(seller: Tables["sellers"]["Insert"]) {
  const { data, error } = await supabase.from("sellers").insert(seller).select().single()

  if (error) {
    console.error("Error creating seller:", error)
    throw error
  }

  return data
}

export async function getSellerByUserId(userId: string) {
  const { data, error } = await supabase.from("sellers").select("*").eq("user_id", userId).single()

  if (error) {
    console.error("Error fetching seller:", error)
    return null
  }

  return data
}

export async function getSellerProducts(sellerId: string) {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      categories(name)
    `)
    .eq("seller_id", sellerId)
    .eq("active", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching seller products:", error)
    return []
  }

  return data || []
}

// Order functions
export async function createOrder(order: Tables["orders"]["Insert"], items: Tables["order_items"]["Insert"][]) {
  const { data: orderData, error: orderError } = await supabase.from("orders").insert(order).select().single()

  if (orderError) {
    console.error("Error creating order:", orderError)
    throw orderError
  }

  // Insert order items
  const orderItems = items.map((item) => ({
    ...item,
    order_id: orderData.id,
  }))

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

  if (itemsError) {
    console.error("Error creating order items:", itemsError)
    throw itemsError
  }

  return orderData
}

export async function getOrdersByCustomerId(customerId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items(
        *,
        products(name, images)
      )
    `)
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching orders:", error)
    return []
  }

  return data || []
}

export async function getOrdersBySellerId(sellerId: string) {
  const { data, error } = await supabase
    .from("order_items")
    .select(`
      *,
      orders!inner(*),
      products(name, images),
      users!orders_customer_id_fkey(first_name, last_name)
    `)
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching seller orders:", error)
    return []
  }

  return data || []
}

export async function updateOrderStatus(orderId: string, status: string) {
  const { data, error } = await supabase.from("orders").update({ status }).eq("id", orderId).select().single()

  if (error) {
    console.error("Error updating order status:", error)
    throw error
  }

  return data
}

// Cart functions
export async function getCartItems(customerId: string) {
  const { data, error } = await supabase
    .from("cart")
    .select(`
      *,
      products(
        *,
        sellers(business_name)
      )
    `)
    .eq("customer_id", customerId)

  if (error) {
    console.error("Error fetching cart items:", error)
    return []
  }

  return data || []
}

export async function addToCart(customerId: string, productId: string, quantity = 1) {
  const { data, error } = await supabase
    .from("cart")
    .upsert({
      customer_id: customerId,
      product_id: productId,
      quantity,
    })
    .select()
    .single()

  if (error) {
    console.error("Error adding to cart:", error)
    throw error
  }

  return data
}

export async function updateCartQuantity(customerId: string, productId: string, quantity: number) {
  const { data, error } = await supabase
    .from("cart")
    .update({ quantity })
    .eq("customer_id", customerId)
    .eq("product_id", productId)
    .select()
    .single()

  if (error) {
    console.error("Error updating cart quantity:", error)
    throw error
  }

  return data
}

export async function removeFromCart(customerId: string, productId: string) {
  const { error } = await supabase.from("cart").delete().eq("customer_id", customerId).eq("product_id", productId)

  if (error) {
    console.error("Error removing from cart:", error)
    throw error
  }
}

export async function clearCart(customerId: string) {
  const { error } = await supabase.from("cart").delete().eq("customer_id", customerId)

  if (error) {
    console.error("Error clearing cart:", error)
    throw error
  }
}

// Wishlist functions
export async function getWishlistItems(customerId: string) {
  const { data, error } = await supabase
    .from("wishlist")
    .select(`
      *,
      products(
        *,
        sellers(business_name)
      )
    `)
    .eq("customer_id", customerId)

  if (error) {
    console.error("Error fetching wishlist items:", error)
    return []
  }

  return data || []
}

export async function addToWishlist(customerId: string, productId: string) {
  const { data, error } = await supabase
    .from("wishlist")
    .insert({
      customer_id: customerId,
      product_id: productId,
    })
    .select()
    .single()

  if (error) {
    console.error("Error adding to wishlist:", error)
    throw error
  }

  return data
}

export async function removeFromWishlist(customerId: string, productId: string) {
  const { error } = await supabase.from("wishlist").delete().eq("customer_id", customerId).eq("product_id", productId)

  if (error) {
    console.error("Error removing from wishlist:", error)
    throw error
  }
}

// Categories
export async function getCategories() {
  const { data, error } = await supabase.from("categories").select("*").order("name")

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  return data || []
}

// Reviews
export async function getProductReviews(productId: string) {
  const { data, error } = await supabase
    .from("reviews")
    .select(`
      *,
      users(first_name, last_name)
    `)
    .eq("product_id", productId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching reviews:", error)
    return []
  }

  return data || []
}

export async function createReview(review: Tables["reviews"]["Insert"]) {
  const { data, error } = await supabase.from("reviews").insert(review).select().single()

  if (error) {
    console.error("Error creating review:", error)
    throw error
  }

  return data
}

// Analytics functions for sellers
export async function getSellerAnalytics(sellerId: string) {
  // Get total revenue
  const { data: revenueData } = await supabase.from("order_items").select("price, quantity").eq("seller_id", sellerId)

  const totalRevenue = revenueData?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0

  // Get total orders
  const { count: totalOrders } = await supabase
    .from("order_items")
    .select("*", { count: "exact" })
    .eq("seller_id", sellerId)

  // Get total products
  const { count: totalProducts } = await supabase
    .from("products")
    .select("*", { count: "exact" })
    .eq("seller_id", sellerId)
    .eq("active", true)

  // Get unique customers
  const { data: customerData } = await supabase
    .from("order_items")
    .select("orders!inner(customer_id)")
    .eq("seller_id", sellerId)

  const uniqueCustomers = new Set(customerData?.map((item) => item.orders.customer_id)).size

  return {
    totalRevenue,
    totalOrders: totalOrders || 0,
    totalProducts: totalProducts || 0,
    totalCustomers: uniqueCustomers,
  }
}
