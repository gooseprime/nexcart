// This file is now deprecated. Use server-product-service.ts or client-product-service.ts instead.
// We're keeping this file to avoid breaking changes, but it should be removed in the future.

import { getSupabaseServer } from "@/lib/supabase/server"
import { getSupabaseClient } from "@/lib/supabase/client"
import type { Product } from "@/lib/supabase/database.types"

// Define default images for products that don't have images
const DEFAULT_PRODUCT_IMAGES = {
  Electronics: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1301&auto=format&fit=crop",
  Gadgets: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop",
  Tools: "https://images.unsplash.com/photo-1581166397057-235af2b3c6dd?q=80&w=2070&auto=format&fit=crop",
  Tool: "https://images.unsplash.com/photo-1581166397057-235af2b3c6dd?q=80&w=2070&auto=format&fit=crop", // Added singular form
  Accessories: "https://images.unsplash.com/photo-1625929675093-a85aab94bffa?q=80&w=2071&auto=format&fit=crop",
}

// Helper function to ensure products have images
function ensureProductImages(products: Product[]): Product[] {
  return products.map((product) => {
    if (!product.image_url) {
      // Assign a default image based on category
      const defaultImage =
        DEFAULT_PRODUCT_IMAGES[product.category as keyof typeof DEFAULT_PRODUCT_IMAGES] ||
        "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1301&auto=format&fit=crop"

      return {
        ...product,
        image_url: defaultImage,
      }
    }
    return product
  })
}

export async function getProducts(limit = 6): Promise<Product[]> {
  const supabase = getSupabaseServer()

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }

  // Ensure all products have images
  return ensureProductImages(data)
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const supabase = getSupabaseClient()
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
}

export async function getProductById(id: number): Promise<Product | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching product by ID:", error)
    return null
  }

  return data
}

export async function getCategories(): Promise<{ id: number; name: string }[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("categories").select("id, name").order("name")

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  return data || []
}

export async function updateProductImages() {
  const supabase = getSupabaseServer()

  // Update the categoryImageMap with high-quality Unsplash images
  const categoryImageMap = {
    Electronics: [
      "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1301&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?q=80&w=2080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1588508065123-287b28e013da?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=2068&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?q=80&w=2025&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1601524909162-ae8725290836?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop",
    ],
    Gadgets: [
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1625961332771-3f40b0e2bdcf?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512686096451-a15c19314d59?q=80&w=2069&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1606041011872-596597976b25?q=80&w=1972&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600003263720-95b45a4035d5?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?q=80&w=1964&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1964&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=2080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=2080&auto=format&fit=crop",
    ],
    Tools: [
      "https://images.unsplash.com/photo-1581166397057-235af2b3c6dd?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1572981779307-38e8278a0acc?q=80&w=1932&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1426927308491-6380b6a9936f?q=80&w=2071&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1526570207772-784d36084510?q=80&w=2035&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586864387789-628af9feed72?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1563185628-4a72ca26578e?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2069&auto=format&fit=crop",
    ],
    Tool: [
      "https://images.unsplash.com/photo-1581166397057-235af2b3c6dd?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1572981779307-38e8278a0acc?q=80&w=1932&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1426927308491-6380b6a9936f?q=80&w=2071&auto=format&fit=crop",
    ],
    Accessories: [
      "https://images.unsplash.com/photo-1625929675093-a85aab94bffa?q=80&w=2071&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600003263720-95b45a4035d5?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1780&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600086427699-bfffb9066a38?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1968&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600950207944-0d63e8edbc3f?q=80&w=2070&auto=format&fit=crop",
    ],
  }

  // For each category, update product images
  for (const [category, images] of Object.entries(categoryImageMap)) {
    const { data: products } = await supabase.from("products").select("id").eq("category", category)

    if (products) {
      for (let i = 0; i < products.length; i++) {
        const imageUrl = images[i % images.length]
        await supabase.from("products").update({ image_url: imageUrl }).eq("id", products[i].id)
      }
    }
  }

  return { success: true }
}
