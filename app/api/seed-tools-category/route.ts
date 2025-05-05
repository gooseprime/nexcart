import { getSupabaseServer } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = getSupabaseServer()

    // Check if Tools category exists
    const { data: toolsCategory, error: categoryError } = await supabase
      .from("categories")
      .select("*")
      .eq("name", "Tools")
      .single()

    // If Tools category doesn't exist, create it
    if (categoryError) {
      const { data: newCategory, error: newCategoryError } = await supabase
        .from("categories")
        .insert({
          name: "Tools",
          description: "Professional and DIY tools for all your projects",
          image_url: "https://images.unsplash.com/photo-1581166397057-235af2b3c6dd?q=80&w=2070&auto=format&fit=crop",
          product_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (newCategoryError) {
        throw newCategoryError
      }
    }

    // Check if there are any products in the Tools category
    const { data: existingProducts, error: productsError } = await supabase
      .from("products")
      .select("*")
      .eq("category", "Tools")

    if (productsError) {
      throw productsError
    }

    // If no products exist in the Tools category, create some
    if (existingProducts.length === 0) {
      const toolProducts = [
        {
          name: "Professional Drill Set",
          description: "High-quality drill set with multiple bits for all your drilling needs",
          price: 129.99,
          original_price: 159.99,
          discount: 19,
          rating: 4.7,
          stock: 25,
          category: "Tools",
          image_url: "https://images.unsplash.com/photo-1581166397057-235af2b3c6dd?q=80&w=2070&auto=format&fit=crop",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          name: "Electric Screwdriver",
          description: "Powerful electric screwdriver with adjustable torque settings",
          price: 49.99,
          original_price: 59.99,
          discount: 17,
          rating: 4.5,
          stock: 40,
          category: "Tools",
          image_url: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?q=80&w=2070&auto=format&fit=crop",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          name: "Precision Tool Kit",
          description: "Complete set of precision tools for electronics and small repairs",
          price: 34.99,
          original_price: 44.99,
          discount: 22,
          rating: 4.8,
          stock: 15,
          category: "Tools",
          image_url: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070&auto=format&fit=crop",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          name: "Heavy Duty Hammer",
          description: "Professional-grade hammer for construction and home projects",
          price: 29.99,
          original_price: null,
          discount: null,
          rating: 4.6,
          stock: 50,
          category: "Tools",
          image_url: "https://images.unsplash.com/photo-1572981779307-38e8278a0acc?q=80&w=1932&auto=format&fit=crop",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          name: "Adjustable Wrench Set",
          description: "Set of adjustable wrenches in various sizes for all your needs",
          price: 45.99,
          original_price: 55.99,
          discount: 18,
          rating: 4.4,
          stock: 30,
          category: "Tools",
          image_url: "https://images.unsplash.com/photo-1426927308491-6380b6a9936f?q=80&w=2071&auto=format&fit=crop",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          name: "Laser Level",
          description: "Professional laser level for precise measurements and alignments",
          price: 79.99,
          original_price: 99.99,
          discount: 20,
          rating: 4.9,
          stock: 10,
          category: "Tools",
          image_url: "https://images.unsplash.com/photo-1526570207772-784d36084510?q=80&w=2035&auto=format&fit=crop",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]

      const { error: insertError } = await supabase.from("products").insert(toolProducts)

      if (insertError) {
        throw insertError
      }

      // Update the product count in the category
      await supabase.from("categories").update({ product_count: toolProducts.length }).eq("name", "Tools")

      return NextResponse.json({
        success: true,
        message: `Created ${toolProducts.length} products in the Tools category`,
      })
    }

    return NextResponse.json({
      success: true,
      message: `Tools category already has ${existingProducts.length} products`,
    })
  } catch (error) {
    console.error("Error seeding Tools category:", error)
    return NextResponse.json({ error: "Failed to seed Tools category" }, { status: 500 })
  }
}
