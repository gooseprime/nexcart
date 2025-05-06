import { getSupabaseServer } from "@/lib/supabase/server"
import type { Product } from "@/lib/supabase/database.types"

export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const supabase = getSupabaseServer()
    const { data, error } = await supabase
      .from("products")
      .select("*")
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
}

export async function getProductById(id: number): Promise<Product | null> {
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
}

export async function getCategories(): Promise<{ id: number; name: string }[]> {
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
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const supabase = getSupabaseServer()
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching all products:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getAllProducts:", error)
    return []
  }
}
