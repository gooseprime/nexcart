"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import type { Category } from "@/lib/supabase/database.types"

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  // Get a vibrant color based on the category
  const getCategoryGradient = (name: string) => {
    const gradients = {
      Electronics: "from-vibrant-blue to-vibrant-purple",
      Gadgets: "from-vibrant-purple to-vibrant-pink",
      Tools: "from-vibrant-green to-vibrant-blue",
      Tool: "from-vibrant-green to-vibrant-blue",
      Accessories: "from-vibrant-pink to-vibrant-orange",
    }
    return gradients[name as keyof typeof gradients] || "from-vibrant-blue to-vibrant-purple"
  }

  return (
    <Link href={`/categories/${category.name.toLowerCase()}`} className="block">
      <motion.div
        className="group relative overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-lg"
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative h-40">
          <Image
            src={category.image_url || "/placeholder.svg"}
            alt={category.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${getCategoryGradient(category.name)} opacity-80`} />
        </div>
        <div className="absolute bottom-0 w-full p-4">
          <motion.h3
            className="text-xl font-bold text-white"
            whileHover={{ textShadow: "0 0 8px rgba(255, 255, 255, 0.5)" }}
          >
            {category.name}
          </motion.h3>
          <p className="text-sm text-gray-200">{category.product_count || 0} products</p>
        </div>
      </motion.div>
    </Link>
  )
}
