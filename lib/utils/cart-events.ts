// Custom event for cart updates
export const dispatchCartUpdateEvent = () => {
  // Create and dispatch a custom event
  const event = new CustomEvent("cart-updated")
  window.dispatchEvent(event)

  // Also trigger a storage event for cross-tab communication
  // We're using localStorage as a communication channel
  const currentValue = localStorage.getItem("nexcart-shopping-cart")
  localStorage.setItem("nexcart-shopping-cart-timestamp", Date.now().toString())
  if (currentValue) {
    // This is a hack to trigger the storage event in the same tab
    // We're temporarily removing and re-adding the item
    localStorage.removeItem("nexcart-shopping-cart")
    localStorage.setItem("nexcart-shopping-cart", currentValue)
  }
}
