import { updateProductImages } from "@/lib/services/product-service"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const result = await updateProductImages()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error updating product images:", error)
    return NextResponse.json({ error: "Failed to update product images" }, { status: 500 })
  }
}
