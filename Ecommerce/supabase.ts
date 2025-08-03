import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password_hash: string
          role: "customer" | "seller"
          first_name: string | null
          last_name: string | null
          phone: string | null
          address: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          role: "customer" | "seller"
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          role?: "customer" | "seller"
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      sellers: {
        Row: {
          id: string
          user_id: string
          business_name: string
          business_type: string | null
          tax_id: string | null
          description: string | null
          business_address: string | null
          verified: boolean
          rating: number
          total_sales: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_name: string
          business_type?: string | null
          tax_id?: string | null
          description?: string | null
          business_address?: string | null
          verified?: boolean
          rating?: number
          total_sales?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_name?: string
          business_type?: string | null
          tax_id?: string | null
          description?: string | null
          business_address?: string | null
          verified?: boolean
          rating?: number
          total_sales?: number
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          parent_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          parent_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          parent_id?: string | null
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          seller_id: string
          category_id: string | null
          name: string
          description: string | null
          price: number
          original_price: number | null
          stock: number
          sold: number
          rating: number
          review_count: number
          images: string[] | null
          tags: string[] | null
          specifications: any | null
          featured: boolean
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          seller_id: string
          category_id?: string | null
          name: string
          description?: string | null
          price: number
          original_price?: number | null
          stock?: number
          sold?: number
          rating?: number
          review_count?: number
          images?: string[] | null
          tags?: string[] | null
          specifications?: any | null
          featured?: boolean
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          seller_id?: string
          category_id?: string | null
          name?: string
          description?: string | null
          price?: number
          original_price?: number | null
          stock?: number
          sold?: number
          rating?: number
          review_count?: number
          images?: string[] | null
          tags?: string[] | null
          specifications?: any | null
          featured?: boolean
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          customer_id: string
          order_number: string
          status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
          total_amount: number
          shipping_address: any
          payment_method: string | null
          payment_status: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          order_number: string
          status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
          total_amount: number
          shipping_address: any
          payment_method?: string | null
          payment_status?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          order_number?: string
          status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
          total_amount?: number
          shipping_address?: any
          payment_method?: string | null
          payment_status?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          seller_id: string | null
          quantity: number
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          seller_id?: string | null
          quantity: number
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          seller_id?: string | null
          quantity?: number
          price?: number
          created_at?: string
        }
      }
      cart: {
        Row: {
          id: string
          customer_id: string
          product_id: string
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          product_id: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          product_id?: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
      }
      wishlist: {
        Row: {
          id: string
          customer_id: string
          product_id: string
          created_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          product_id: string
          created_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          product_id?: string
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          product_id: string
          customer_id: string
          order_id: string | null
          rating: number
          comment: string | null
          images: string[] | null
          helpful_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          customer_id: string
          order_id?: string | null
          rating: number
          comment?: string | null
          images?: string[] | null
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          customer_id?: string
          order_id?: string | null
          rating?: number
          comment?: string | null
          images?: string[] | null
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
