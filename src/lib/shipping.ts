/**
 * Dynamic Delivery / Shipping Configuration for HM Agarbattis (Frontend)
 *
 * To change the delivery fee or threshold in the future:
 *  - Edit standardFee or freeDeliveryThreshold below, OR
 *  - Set NEXT_PUBLIC_DELIVERY_FEE and NEXT_PUBLIC_FREE_DELIVERY_THRESHOLD in .env.local
 */

export const SHIPPING_CONFIG = {
  // Whether delivery fee is currently charged
  enabled: process.env.NEXT_PUBLIC_DELIVERY_FEE_ENABLED !== "false",

  // Base flat delivery fee in INR
  standardFee: process.env.NEXT_PUBLIC_DELIVERY_FEE
    ? parseFloat(process.env.NEXT_PUBLIC_DELIVERY_FEE)
    : 50,

  // Free delivery threshold in INR (orders >= threshold get FREE delivery)
  freeDeliveryThreshold: process.env.NEXT_PUBLIC_FREE_DELIVERY_THRESHOLD
    ? parseFloat(process.env.NEXT_PUBLIC_FREE_DELIVERY_THRESHOLD)
    : 499,

  // Delivery timeframe description
  deliveryTimeText: process.env.NEXT_PUBLIC_DELIVERY_ESTIMATE || "3–5 business days",
  deliveryDescription: "Delivered securely in 3–5 business days from Coimbatore.",

  /**
   * Dynamically calculates delivery fee given the current basket subtotal
   */
  calculate(subtotal: number): number {
    if (!this.enabled || subtotal <= 0) return 0;
    if (subtotal >= this.freeDeliveryThreshold) return 0;
    return this.standardFee;
  },

  /**
   * Helper to format delivery label in UI
   */
  getLabel(subtotal: number): string {
    const fee = this.calculate(subtotal);
    return fee === 0 ? "FREE" : `₹${fee}`;
  },
};
