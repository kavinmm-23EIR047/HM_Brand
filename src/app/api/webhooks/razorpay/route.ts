import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;

    if (secret && signature) {
      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(rawBody)
        .digest("hex");

      if (expectedSignature !== signature) {
        console.warn("[Next.js Webhook] Invalid signature received");
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    console.log(`[Next.js Razorpay Webhook] Event: ${payload.event}`);

    // Forward to backend API if external backend is running
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    try {
      await fetch(`${API_URL}/orders/webhook`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(signature ? { "x-razorpay-signature": signature } : {}),
        },
        body: rawBody,
      });
    } catch (fErr) {
      console.warn("[Next.js Webhook] Forwarding to backend failed:", fErr);
    }

    return NextResponse.json({ received: true, event: payload.event }, { status: 200 });
  } catch (error: any) {
    console.error("[Next.js Webhook] Error processing Razorpay webhook:", error);
    return NextResponse.json({ error: error.message || "Webhook processing error" }, { status: 500 });
  }
}
