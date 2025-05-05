import { getSupabaseServer } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = getSupabaseServer()

    // High-quality Unsplash images for categories
    const categoryImages = {
      Electronics: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2070&auto=format&fit=crop",
      Gadgets: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop",
      Tools: "https://images.unsplash.com/photo-1581166397057-235af2b3c6dd?q=80&w=2070&auto=format&fit=crop",
      Accessories: "https://images.unsplash.com/photo-1625929675093-a85aab94bffa?q=80&w=2071&auto=format&fit=crop",
    }

    // Update each category with its corresponding image
    for (const [category, imageUrl] of Object.entries(categoryImages)) {
      await supabase.from("categories").update({ image_url: imageUrl }).eq("name", category)
    }

    return NextResponse.json({ success: true, message: "Category images updated successfully" })
  } catch (error) {
    console.error("Error updating category images:", error)
    return NextResponse.json({ error: "Failed to update category images" }, { status: 500 })
  }
}
