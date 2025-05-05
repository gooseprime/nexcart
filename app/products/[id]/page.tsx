import { getProductById } from "@/lib/services/server-product-service"
import ProductDetailClient from "./page.client"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { DataErrorFallback } from "@/components/ui/data-error-fallback"
import { NotFoundFallback } from "@/components/ui/not-found-fallback"

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  try {
    const productId = Number.parseInt(params.id)

    if (isNaN(productId)) {
      return <NotFoundFallback title="Product not found" message="The product ID is invalid." />
    }

    const product = await getProductById(productId)

    if (!product) {
      return <NotFoundFallback title="Product not found" message="The product you're looking for doesn't exist." />
    }

    return (
      <ErrorBoundary>
        <ProductDetailClient product={product} />
      </ErrorBoundary>
    )
  } catch (error) {
    console.error("Error in ProductDetailPage:", error)
    return (
      <DataErrorFallback
        title="Something went wrong"
        message="We're having trouble loading this product. Please try again later."
      />
    )
  }
}
