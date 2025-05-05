"use server"

import { getSupabaseServer } from "@/lib/supabase/server"
import type { AIMessage, ProductRecommendation } from "@/lib/types"

// OpenRouter API integration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

// Function to generate AI responses
export async function generateAIResponse(
  messages: AIMessage[],
  userId?: string | null,
  context?: string,
): Promise<{ response: string; error?: string }> {
  try {
    if (!OPENROUTER_API_KEY) {
      throw new Error("OpenRouter API key is not configured")
    }

    // Add system message with context if provided
    const systemMessage = {
      role: "system",
      content: `You are a helpful AI assistant for Nexcart, an e-commerce platform specializing in electronics, tools, gadgets, and accessories. 
      ${context || ""}
      Be concise, helpful, and friendly. If you don't know something, say so honestly.`,
    }

    const allMessages = [systemMessage, ...messages]

    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://nexcart.vercel.app",
        "X-Title": "Nexcart E-commerce",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o",
        messages: allMessages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`OpenRouter API error: ${errorData.error?.message || response.statusText}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0].message.content

    // Save conversation to database if userId is provided
    if (userId) {
      const supabase = getSupabaseServer()
      await supabase.from("ai_conversations").insert({
        user_id: userId,
        messages: allMessages.concat({ role: "assistant", content: aiResponse }),
        created_at: new Date().toISOString(),
      })
    }

    return { response: aiResponse }
  } catch (error) {
    console.error("AI response generation error:", error)
    return {
      response: "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Function to get product recommendations
export async function getProductRecommendations(
  query: string,
  userId?: string | null,
): Promise<{ recommendations: ProductRecommendation[]; error?: string }> {
  try {
    if (!OPENROUTER_API_KEY) {
      throw new Error("OpenRouter API key is not configured")
    }

    // Get products from database
    const supabase = getSupabaseServer()
    const { data: products, error } = await supabase.from("products").select("*").limit(50)

    if (error) {
      throw error
    }

    // Create system message with product data
    const systemMessage = {
      role: "system",
      content: `You are a product recommendation assistant for Nexcart. 
      Based on the user's query, recommend relevant products from the following list.
      Return your response as a JSON array with exactly 3 products, each containing id, name, reason fields.
      Products: ${JSON.stringify(products)}`,
    }

    const userMessage = {
      role: "user",
      content: `Find me products related to: ${query}`,
    }

    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://nexcart.vercel.app",
        "X-Title": "Nexcart E-commerce",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o",
        messages: [systemMessage, userMessage],
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: "json_object" },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`OpenRouter API error: ${errorData.error?.message || response.statusText}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    // Parse the JSON response
    let recommendations: ProductRecommendation[] = []
    try {
      const parsedContent = JSON.parse(content)
      recommendations = parsedContent.recommendations || []

      // Ensure we have product details
      recommendations = recommendations
        .map((rec) => {
          const product = products.find((p) => p.id === rec.id)
          return {
            ...rec,
            product: product || null,
          }
        })
        .filter((rec) => rec.product !== null)
    } catch (parseError) {
      console.error("Error parsing AI recommendations:", parseError)
      throw new Error("Failed to parse product recommendations")
    }

    // Save search query if userId is provided
    if (userId) {
      await supabase.from("user_searches").insert({
        user_id: userId,
        query,
        recommendations: recommendations.map((r) => r.id),
        created_at: new Date().toISOString(),
      })
    }

    return { recommendations }
  } catch (error) {
    console.error("Product recommendation error:", error)
    return {
      recommendations: [],
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Function to handle AI-powered price negotiation
export async function negotiatePrice(
  productId: number,
  initialOffer: number,
  userId?: string | null,
): Promise<{ counterOffer: number; message: string; accepted: boolean; error?: string }> {
  try {
    if (!OPENROUTER_API_KEY) {
      throw new Error("OpenRouter API key is not configured")
    }

    // Get product details
    const supabase = getSupabaseServer()
    const { data: product, error } = await supabase.from("products").select("*").eq("id", productId).single()

    if (error) {
      throw error
    }

    const originalPrice = product.price
    const minAcceptablePrice = originalPrice * 0.85 // 15% discount max
    const accepted = initialOffer >= minAcceptablePrice

    // Create system message for negotiation
    const systemMessage = {
      role: "system",
      content: `You are an AI negotiation assistant for Nexcart. 
      You're negotiating the price of ${product.name} which costs $${originalPrice}.
      The minimum acceptable price is $${minAcceptablePrice.toFixed(2)}.
      The customer has offered $${initialOffer.toFixed(2)}.
      If their offer is at or above the minimum acceptable price, accept it.
      Otherwise, make a counter-offer between their offer and the original price.
      Be friendly but firm. Highlight product benefits to justify the price.
      Return your response as a JSON object with message and counterOffer fields.`,
    }

    const userMessage = {
      role: "user",
      content: `I'd like to buy ${product.name} for $${initialOffer.toFixed(2)} instead of $${originalPrice.toFixed(2)}.`,
    }

    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://nexcart.vercel.app",
        "X-Title": "Nexcart E-commerce",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o",
        messages: [systemMessage, userMessage],
        temperature: 0.7,
        max_tokens: 500,
        response_format: { type: "json_object" },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`OpenRouter API error: ${errorData.error?.message || response.statusText}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    // Parse the JSON response
    let negotiationResult: { message: string; counterOffer: number }
    try {
      negotiationResult = JSON.parse(content)
    } catch (parseError) {
      console.error("Error parsing negotiation response:", parseError)
      throw new Error("Failed to parse negotiation response")
    }

    // Save negotiation if userId is provided
    if (userId) {
      await supabase.from("negotiations").insert({
        user_id: userId,
        product_id: productId,
        initial_price: initialOffer,
        final_price: accepted ? initialOffer : negotiationResult.counterOffer,
        status: accepted ? "accepted" : "pending",
        messages: [
          { role: "user", content: userMessage.content },
          { role: "assistant", content: negotiationResult.message },
        ],
      })
    }

    return {
      counterOffer:
        negotiationResult.counterOffer || (accepted ? initialOffer : Math.round((originalPrice + initialOffer) / 2)),
      message: negotiationResult.message,
      accepted,
    }
  } catch (error) {
    console.error("Price negotiation error:", error)
    return {
      counterOffer: 0,
      message: "I'm sorry, I'm having trouble processing your negotiation request right now. Please try again later.",
      accepted: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
