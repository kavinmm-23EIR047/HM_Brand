/**
 * Dynamic Delivery / Shipping Configuration for HM Agarbattis
 *
 * Designed to make delivery fee updates seamless and dynamic.
 * To change values, either:
 *  1. Update this file directly, OR
 *  2. Set environment variables in backend/.env:
 *     - DELIVERY_FEE_ENABLED=true/false
 *     - DELIVERY_FEE=50
 *     - FREE_DELIVERY_THRESHOLD=499
 */

export interface ShippingConfig {
  enabled: boolean;
  standardFee: number;
  freeDeliveryThreshold: number;
  deliveryEstimateDays: string;
  deliveryDescription: string;
}

export const shippingConfig = {
  // Whether delivery fee is currently charged (can be set to false for festival free shipping)
  enabled: process.env.DELIVERY_FEE_ENABLED !== 'false',

  // Standard flat shipping fee in INR
  standardFee: process.env.DELIVERY_FEE ? parseFloat(process.env.DELIVERY_FEE) : 50,

  // Free delivery threshold in INR (orders >= this amount get 100% free delivery)
  freeDeliveryThreshold: process.env.FREE_DELIVERY_THRESHOLD ? parseFloat(process.env.FREE_DELIVERY_THRESHOLD) : 499,

  // Estimated dispatch / transit timeframe
  deliveryEstimateDays: process.env.DELIVERY_ESTIMATE_DAYS || '3–5 business days',

  // Display description
  deliveryDescription: 'Standard Pan-India Sacred Dispatch from Coimbatore',

  /**
   * Dynamically calculates delivery fee based on order subtotal
   */
  calculate(subtotal: number): number {
    if (!this.enabled || subtotal <= 0) return 0;
    if (subtotal >= this.freeDeliveryThreshold) return 0;
    return this.standardFee;
  },

  /**
   * Returns a clean JSON snapshot for client consumption
   */
  getPublicConfig(): ShippingConfig {
    return {
      enabled: this.enabled,
      standardFee: this.standardFee,
      freeDeliveryThreshold: this.freeDeliveryThreshold,
      deliveryEstimateDays: this.deliveryEstimateDays,
      deliveryDescription: this.deliveryDescription,
    };
  },
};
