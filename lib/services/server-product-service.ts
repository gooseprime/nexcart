import { getSupabaseServer } from "@/lib/supabase/server"
import type { Product } from "@/lib/supabase/database.types"
import { cache } from "react"

// Cache the product data for 1 minute to reduce database calls
export const getProductsByCategory = cache(async (category: string): Promise<Product[]> => {
  try {
    const supabase = getSupabaseServer()
    const { data, error } = await supabase
      .from("products")
      .select("id, name, description, price, original_price, rating, discount, category, image_url")
      .eq("category", category)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching products by category:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getProductsByCategory:", error)
    return []
  }
})

// Cache the product data for individual products
export const getProductById = cache(async (id: number): Promise<Product | null> => {
  try {
    const supabase = getSupabaseServer()
    const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching product by ID:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in getProductById:", error)
    return null
  }
})

// Cache categories for 5 minutes since they rarely change
export const getCategories = cache(async (): Promise<{ id: number; name: string }[]> => {
  try {
    const supabase = getSupabaseServer()
    const { data, error } = await supabase.from("categories").select("id, name").order("name")

    if (error) {
      console.error("Error fetching categories:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getCategories:", error)
    return []
  }
})

// Cache all products with pagination for better performance
export const getAllProducts = cache(async (limit = 12, page = 0): Promise<Product[]> => {
  try {
    const supabase = getSupabaseServer()
    const { data, error } = await supabase
      .from("products")
      .select("id, name, description, price, original_price, rating, discount, category, image_url")
      .order("created_at", { ascending: false })
      .range(page * limit, (page + 1) * limit - 1)

    if (error) {
      console.error("Error fetching all products:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getAllProducts:", error)
    return []
  }
})
