"use server"

import { getSupabaseServer } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { CheckoutFormData } from "@/lib/types"

export async function createOrder(formData: CheckoutFormData, cartItems: any[]) {
  try {
    const supabase = getSupabaseServer()

    // Get the current user
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      throw new Error("You must be logged in to place an order")
    }

    const userId = session.user.id

    // Calculate order totals
    const subtotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)
    const shipping = subtotal > 100 ? 0 : 10
    const tax = subtotal * 0.08
    const total = subtotal + shipping + tax

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        status: "pending",
        shipping_address: {
          full_name: formData.fullName,
          address_line1: formData.addressLine1,
          address_line2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postalCode,
          country: formData.country,
          phone: formData.phone,
        },
        payment_method: formData.paymentMethod,
        subtotal,
        shipping_cost: shipping,
        tax,
        total,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (orderError) {
      throw new Error(`Failed to create order: ${orderError.message}`)
    }

    // Create order items
    const orderItems = cartItems.map((item) => ({
      order_id: order.id,
      product_id: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
      total: item.product.price * item.quantity,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      throw new Error(`Failed to create order items: ${itemsError.message}`)
    }

    // Update product stock
    for (const item of cartItems) {
      const { error: stockError } = await supabase
        .from("products")
        .update({ stock: item.product.stock - item.quantity })
        .eq("id", item.product.id)

      if (stockError) {
        console.error(`Failed to update stock for product ${item.product.id}: ${stockError.message}`)
      }
    }

    revalidatePath("/orders")
    return { success: true, orderId: order.id }
  } catch (error) {
    console.error("Checkout error:", error)
    return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" }
  }
}
