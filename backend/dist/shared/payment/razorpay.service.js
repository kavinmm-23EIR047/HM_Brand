"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.razorpayService = exports.RazorpayService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const custom_error_1 = require("../errors/custom.error");
class RazorpayService {
    get keyId() {
        return process.env.RAZORPAY_KEY_ID || '';
    }
    get keySecret() {
        return process.env.RAZORPAY_KEY_SECRET || '';
    }
    isConfigured() {
        return Boolean(this.keyId && this.keySecret);
    }
    getKeyId() {
        return this.keyId;
    }
    /**
     * Creates an order with Razorpay REST API
     * Converts amount in INR to paise (x 100)
     */
    async createOrder(options) {
        if (!this.isConfigured()) {
            throw new custom_error_1.BadRequestError('Razorpay is not configured on the server. Please check credentials.');
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
        const data = await response.json();
        if (!response.ok) {
            console.error('[RazorpayService] Order creation error:', data);
            throw new custom_error_1.BadRequestError(data?.error?.description || 'Failed to create Razorpay payment order');
        }
        return data;
    }
    /**
     * Verifies Razorpay payment signature using HMAC SHA-256
     */
    verifySignature(options) {
        if (!this.keySecret) {
            throw new custom_error_1.BadRequestError('Razorpay key secret is missing.');
        }
        const body = `${options.razorpayOrderId}|${options.razorpayPaymentId}`;
        const expectedSignature = crypto_1.default
            .createHmac('sha256', this.keySecret)
            .update(body)
            .digest('hex');
        return expectedSignature === options.razorpaySignature;
    }
}
exports.RazorpayService = RazorpayService;
exports.razorpayService = new RazorpayService();
