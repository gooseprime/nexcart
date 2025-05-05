export type CheckoutFormData = {
  fullName: string
  email: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
  paymentMethod: "credit_card" | "paypal"
  cardNumber?: string
  cardExpiry?: string
  cardCvc?: string
  savePaymentInfo?: boolean
}

export type CheckoutStep = "shipping" | "payment" | "review"

export type AIMessage = {
  role: "system" | "user" | "assistant"
  content: string
}

export type ProductRecommendation = {
  id: number
  name: string
  reason: string
  product?: any
}

export type AIConversation = {
  id: string
  user_id: string
  messages: AIMessage[]
  created_at: string
}

export type UserSearch = {
  id: string
  user_id: string
  query: string
  recommendations: number[]
  created_at: string
}

export type NegotiationStatus = "pending" | "accepted" | "rejected" | "completed"

export type Negotiation = {
  id: string
  user_id: string
  product_id: number
  initial_price: number
  final_price: number | null
  status: NegotiationStatus
  messages: AIMessage[]
  created_at: string
}
