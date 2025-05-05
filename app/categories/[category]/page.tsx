import { getProductsByCategory, getCategoryBySlug } from "@/lib/services/server-product-service"
import CategoryPageClient from "./page.client"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { DataErrorFallback } from "@/components/ui/data-error-fallback"
import { NotFoundFallback } from "@/components/ui/not-found-fallback"

export default async function CategoryPage({ params }: { params: { category: string } }) {
  try {
    // Get category information
    const categoryData = await getCategoryBySlug(params.category)

    if (!categoryData) {
      return <NotFoundFallback title="Category not found" message="The category you're looking for doesn't exist." />
    }

    // Get products for this category
    const products = await getProductsByCategory(params.category)

    // Default banner image if none is provided
    const bannerImage = categoryData.image_url || "/placeholder.svg?height=300&width=1200"

    return (
      <ErrorBoundary>
        <CategoryPageClient
          products={products}
          bannerImage={bannerImage}
          displayName={categoryData.name}
          category={params.category}
        />
      </ErrorBoundary>
    )
  } catch (error) {
    console.error("Error in CategoryPage:", error)
    return (
      <DataErrorFallback
        title="Something went wrong"
        message="We're having trouble loading this category. Please try again later."
      />
    )
  }
}
