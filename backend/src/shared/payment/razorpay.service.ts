import crypto from 'crypto';
import { BadRequestError } from '../errors/custom.error';

export interface CreateRazorpayOrderOptions {
  amount: number; // in INR (e.g. 500 for ₹500)
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrderResponse {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  created_at: number;
}

export class RazorpayService {
  private get keyId(): string {
    return process.env.RAZORPAY_KEY_ID || '';
  }

  private get keySecret(): string {
    return process.env.RAZORPAY_KEY_SECRET || '';
  }

  public isConfigured(): boolean {
    return Boolean(this.keyId && this.keySecret);
  }

  public getKeyId(): string {
    return this.keyId;
  }

  /**
   * Creates an order with Razorpay REST API
   * Converts amount in INR to paise (x 100)
   */
  async createOrder(options: CreateRazorpayOrderOptions): Promise<RazorpayOrderResponse> {
    if (!this.isConfigured()) {
      throw new BadRequestError('Razorpay is not configured on the server. Please check credentials.');
    }

    const amountInPaise = Math.round(options.amount * 100);
    const authHeader = Buffer.from(`${this.keyId}:${this.keySecret}`).toString('base64');

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: options.currency || 'INR',
        receipt: options.receipt,
        notes: options.notes || {},
      }),
    });

    const data: any = await response.json();

    if (!response.ok) {
      console.error('[RazorpayService] Order creation error:', data);
      throw new BadRequestError(data?.error?.description || 'Failed to create Razorpay payment order');
    }

    return data as RazorpayOrderResponse;
  }

  /**
   * Verifies Razorpay payment signature using HMAC SHA-256
   */
  verifySignature(options: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }): boolean {
    if (!this.keySecret) {
      throw new BadRequestError('Razorpay key secret is missing.');
    }

    const body = `${options.razorpayOrderId}|${options.razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', this.keySecret)
      .update(body)
      .digest('hex');

    return expectedSignature === options.razorpaySignature;
  }
}

export const razorpayService = new RazorpayService();
