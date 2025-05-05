export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          username: string | null
          full_name: string | null
          avatar_url: string | null
          email: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          email?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          email?: string | null
        }
      }
      negotiations: {
        Row: {
          id: string
          created_at: string
          user_id: string
          product_id: number
          initial_price: number
          final_price: number | null
          status: "pending" | "accepted" | "rejected" | "completed"
          messages: Json[]
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          product_id: number
          initial_price: number
          final_price?: number | null
          status?: "pending" | "accepted" | "rejected" | "completed"
          messages?: Json[]
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          product_id?: number
          initial_price?: number
          final_price?: number | null
          status?: "pending" | "accepted" | "rejected" | "completed"
          messages?: Json[]
        }
      }
      products: {
        Row: {
          id: number
          name: string
          description: string
          price: number
          original_price: number | null
          discount: number | null
          rating: number | null
          stock: number
          category: string
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          description: string
          price: number
          original_price?: number | null
          discount?: number | null
          rating?: number | null
          stock?: number
          category: string
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string
          price?: number
          original_price?: number | null
          discount?: number | null
          rating?: number | null
          stock?: number
          category?: string
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: number
          name: string
          description: string | null
          image_url: string | null
          product_count: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          image_url?: string | null
          product_count?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          image_url?: string | null
          product_count?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          status: string
          shipping_address: Json
          payment_method: string
          subtotal: number
          shipping_cost: number
          tax: number
          total: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status: string
          shipping_address: Json
          payment_method: string
          subtotal: number
          shipping_cost: number
          tax: number
          total: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          status?: string
          shipping_address?: Json
          payment_method?: string
          subtotal?: number
          shipping_cost?: number
          tax?: number
          total?: number
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: number
          quantity: number
          price: number
          total: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: number
          quantity: number
          price: number
          total: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: number
          quantity?: number
          price?: number
          total?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Product = Database["public"]["Tables"]["products"]["Row"]
export type Category = Database["public"]["Tables"]["categories"]["Row"]
export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
export type Negotiation = Database["public"]["Tables"]["negotiations"]["Row"]
export type Order = Database["public"]["Tables"]["orders"]["Row"]
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"]
