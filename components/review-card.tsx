"use client"

import Image from "next/image"
import { Star } from "lucide-react"
import { motion } from "framer-motion"

interface ReviewCardProps {
  review: {
    id: number
    name: string
    rating: number
    comment: string
    avatar?: string
    saved?: number
    text?: string
  }
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <motion.div
      className="bg-white p-6 rounded-2xl shadow-md min-w-[300px] max-w-[350px] flex-shrink-0 border-2 border-transparent hover:border-vibrant-purple"
      whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center mb-4">
        <div className="relative h-12 w-12 rounded-full overflow-hidden mr-3 ring-2 ring-vibrant-purple">
          <Image
            src={
              review.avatar ||
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop" ||
              "/placeholder.svg"
            }
            alt={review.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h4 className="font-bold text-gray-900">{review.name}</h4>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="text-gray-700 mb-3">{review.comment || review.text}</p>
      {review.saved && (
        <div className="flex items-center text-sm text-vibrant-green font-medium">
          <span>Saved ${review.saved} through negotiation</span>
        </div>
      )}
    </motion.div>
  )
}
