import { getSupabaseServer } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = getSupabaseServer()

    // High-quality Unsplash images for each category
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

    // Get all products without images
    const { data: productsWithoutImages, error } = await supabase
      .from("products")
      .select("id, category")
      .is("image_url", null)

    if (error) {
      throw error
    }

    // Update products without images
    let updatedCount = 0
    for (const product of productsWithoutImages || []) {
      const category = product.category as keyof typeof categoryImageMap
      if (categoryImageMap[category]) {
        const randomIndex = Math.floor(Math.random() * categoryImageMap[category].length)
        const imageUrl = categoryImageMap[category][randomIndex]

        await supabase.from("products").update({ image_url: imageUrl }).eq("id", product.id)

        updatedCount++
      }
    }

    // Update category images
    const categoryImages = {
      Electronics: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2301&auto=format&fit=crop",
      Gadgets: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop",
      Tools: "https://images.unsplash.com/photo-1581166397057-235af2b3c6dd?q=80&w=2070&auto=format&fit=crop",
      Accessories: "https://images.unsplash.com/photo-1625929675093-a85aab94bffa?q=80&w=2071&auto=format&fit=crop",
    }

    for (const [category, imageUrl] of Object.entries(categoryImages)) {
      await supabase.from("categories").update({ image_url: imageUrl }).eq("name", category)
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${updatedCount} products without images and all category images`,
    })
  } catch (error) {
    console.error("Error ensuring product images:", error)
    return NextResponse.json({ error: "Failed to ensure product images" }, { status: 500 })
  }
}
