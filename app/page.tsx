import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { getSupabaseServer } from "@/lib/supabase/server"
import { ProductCard } from "@/components/product-card"
import { AIProductRecommendations } from "@/components/ai/ai-product-recommendations"
import { ReviewCard } from "@/components/review-card"
import { Suspense } from "react"
import { LoadingFallback } from "@/components/ui/loading-fallback"

// Update the reviews array with high-quality Unsplash profile images
const reviews = [
  {
    id: 1,
    name: "Alex Johnson",
    rating: 5,
    comment:
      "The negotiation feature is incredible! I saved over $200 on a high-end drone by making a reasonable offer. The AI negotiator was professional and quick to respond.",
    saved: 200,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Sarah Miller",
    rating: 5,
    comment:
      "I was skeptical about the AI negotiation at first, but it worked amazingly well. Got my industrial tablet at a price I couldn't find anywhere else.",
    saved: 150,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "David Chen",
    rating: 4,
    comment:
      "Great experience overall. The negotiation was smooth and I ended up with a fair price on my laser cutter. Will definitely shop here again.",
    saved: 320,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    rating: 5,
    comment:
      "Nexcart's negotiation system is revolutionary! I felt like I was haggling with a real person, and the final price was better than any sale I've seen.",
    saved: 175,
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Michael Thompson",
    rating: 4,
    comment:
      "The AI negotiator was surprisingly flexible. I got my diagnostic kit at a great price and the shipping was fast too.",
    saved: 100,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
  },
]

// Helper function to get all products
async function getAllProducts() {
  const supabase = getSupabaseServer()

  // Optimize query to only fetch needed fields
  const { data, error } = await supabase
    .from("products")
    .select("id, name, description, price, original_price, rating, discount, category, image_url")
    .order("created_at", { ascending: false })
    .limit(12) // Limit to improve initial load time

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }

  return data || []
}

// Separate component for products section to enable suspense
async function ProductsSection() {
  const allProducts = await getAllProducts()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {allProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-vibrant-purple/80 to-vibrant-blue/80 z-10" />
        <Image
          src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=2070&auto=format&fit=crop"
          alt="Tech equipment"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Negotiate Your <span className="text-vibrant-yellow">Best Deal</span> on Tech
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl">
            The first marketplace with AI-powered price negotiation for premium technical equipment
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] hover:opacity-90 text-white shadow-lg"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Shop Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm"
            >
              How It Works
            </Button>
          </div>
        </div>
      </section>

      {/* All Products Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-gradient">All Products</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <span>Filter</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <span>Sort</span>
            </Button>
          </div>
        </div>

        <Suspense fallback={<LoadingFallback />}>
          <ProductsSection />
        </Suspense>
      </section>

      {/* AI Recommended Products */}
      <section className="py-16 bg-gradient-to-r from-vibrant-purple/5 to-vibrant-blue/5">
        <div className="container mx-auto px-4">
          <Suspense fallback={<LoadingFallback />}>
            <AIProductRecommendations title="AI Recommended Products For You" />
          </Suspense>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-16 container mx-auto px-4 bg-gradient-to-r from-vibrant-purple/5 to-vibrant-blue/5">
        <h2 className="text-3xl font-bold text-gradient mb-10 text-center">Customer Success Stories</h2>

        <div className="relative">
          <div className="flex overflow-x-hidden">
            <div className="flex gap-6 animate-carousel">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>

          <button className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-lg z-10 hidden md:block hover:bg-white">
            <ChevronLeft className="h-6 w-6 text-vibrant-purple" />
          </button>

          <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-lg z-10 hidden md:block hover:bg-white">
            <ChevronRight className="h-6 w-6 text-vibrant-purple" />
          </button>
        </div>
      </section>

      {/* About Nexcart */}
      <section className="py-16 bg-gradient-to-r from-vibrant-purple/10 to-vibrant-blue/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gradient mb-6">About Nexcart</h2>
            <p className="text-lg text-gray-700 mb-8">
              Nexcart is revolutionizing the tech marketplace with our AI-powered negotiation system. Unlike traditional
              e-commerce platforms with fixed prices, our innovative approach allows you to negotiate directly with
              sellers through our advanced AI assistant. This transforms your buying experience by helping you secure
              the best possible deals on premium technical equipment and electronics, all while saving time and
              eliminating the stress of haggling.
            </p>
            <Button className="bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] hover:opacity-90">
              Learn More About Us
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-vibrant-purple to-vibrant-blue text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Nexcart</h3>
              <p className="text-gray-200">
                The future of technical equipment shopping with AI-powered price negotiation.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-200 hover:text-white transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-200 hover:text-white transition">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-200 hover:text-white transition">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-200 hover:text-white transition">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-200 hover:text-white transition">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-200 hover:text-white transition">
                    Returns & Refunds
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-200 hover:text-white transition">
                    Shipping Info
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-200 hover:text-white transition">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4 mb-4">
                <a href="#" className="text-gray-200 hover:text-white transition">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-200 hover:text-white transition">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-200 hover:text-white transition">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.772 1.153 4.902 4.902 0 01-1.153 1.772c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-200 hover:text-white transition">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
              <p className="text-gray-200 text-sm">© 2025 Nexcart. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
