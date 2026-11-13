export interface OrderEmailData {
  orderNumber: string;
  totalAmount: number;
  subtotal: number;
  discountAmount?: number;
  shippingCost?: number;
  paymentMethod: string;
  paymentStatus: string;
  razorpayPaymentId?: string;
  createdAt?: string | Date;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    image?: string;
    packInfo?: string;
  }>;
}

export class EmailService {
  private get apiKey(): string {
    return process.env.BREVO_API_KEY || '';
  }

  private get senderName(): string {
    return process.env.BREVO_SENDER_NAME || 'HM Agarbattis & Fragrances';
  }

  private get senderEmail(): string {
    return process.env.BREVO_SENDER_EMAIL || process.env.SENDER_EMAIL || 'jayamassociatescoimbatore@gmail.com';
  }

  private get adminNotificationEmail(): string {
    return process.env.ADMIN_NOTIFICATION_EMAIL || 'jayamassociatescoimbatore@gmail.com';
  }

  private get frontendUrl(): string {
    return process.env.FRONTEND_URL || 'http://localhost:3000';
  }

  public isConfigured(): boolean {
    return Boolean(this.apiKey);
  }

  /**
   * Internal helper to send transactional emails via Brevo REST API v3
   */
  private async sendBrevoEmail(payload: {
    to: Array<{ email: string; name?: string }>;
    subject: string;
    htmlContent: string;
  }): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn('[EmailService] BREVO_API_KEY is not configured. Email skipped:', payload.subject);
      return false;
    }

    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': this.apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          sender: {
            name: this.senderName,
            email: this.senderEmail,
          },
          to: payload.to,
          subject: payload.subject,
          htmlContent: payload.htmlContent,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        console.error('[EmailService] Brevo API Error:', data);
        return false;
      }

      console.log(`[EmailService] Email sent successfully to ${payload.to.map((t) => t.email).join(', ')}`);
      return true;
    } catch (error) {
      console.error('[EmailService] Failed to send email via Brevo:', error);
      return false;
    }
  }

  /**
   * Send New Order Alert to Admin via Brevo
   */
  async sendAdminNewOrderAlert(orderData: OrderEmailData): Promise<boolean> {
    const fullAddress = `${orderData.customer.street}, ${orderData.customer.city}, ${orderData.customer.state} - ${orderData.customer.postalCode}`;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
    const adminUrl = `${this.frontendUrl}/admin`;

    const itemsRows = orderData.items
      .map(
        (it, idx) => `
        <tr style="border-bottom: 1px solid #EAE1D3;">
          <td style="padding: 10px; font-size: 13px; color: #302923;">${idx + 1}</td>
          <td style="padding: 10px; font-size: 13px; font-weight: bold; color: #302923;">
            ${it.name}
            ${it.packInfo ? `<div style="font-size: 11px; color: #746B62; font-weight: normal;">${it.packInfo}</div>` : ''}
          </td>
          <td style="padding: 10px; font-size: 13px; text-align: center; color: #302923;">${it.quantity}</td>
          <td style="padding: 10px; font-size: 13px; text-align: right; color: #302923;">₹${it.unitPrice}</td>
          <td style="padding: 10px; font-size: 13px; text-align: right; font-weight: bold; color: #9E1830;">₹${it.totalPrice}</td>
        </tr>
      `
      )
      .join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>New Order Alert</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FFFDF8; margin: 0; padding: 24px; color: #302923;">
        <div style="max-width: 650px; margin: 0 auto; background: #ffffff; border: 1.5px solid #302923; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
          
          <!-- Header Banner -->
          <div style="background-color: #9E1830; padding: 24px; text-align: center; color: #ffffff;">
            <div style="font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #DFB75A;">
              HM BRAND AGARBATTIS &bull; ADMIN CRM ALERT
            </div>
            <h1 style="margin: 8px 0 4px; font-size: 24px; font-weight: 800;">
              New Sacred Order Received!
            </h1>
            <div style="font-size: 13px; opacity: 0.9;">
              Order Ref: <strong>${orderData.orderNumber}</strong> &bull; Total: <strong>₹${orderData.totalAmount}</strong>
            </div>
          </div>

          <div style="padding: 24px;">
            <!-- Customer & Delivery Block -->
            <div style="background: #F5EFE3; border: 1px solid #EAE1D3; border-radius: 10px; padding: 18px; margin-bottom: 24px;">
              <h3 style="margin: 0 0 12px; font-size: 14px; color: #9E1830; text-transform: uppercase; letter-spacing: 1px;">
                Customer &amp; Delivery Information
              </h3>
              <table style="width: 100%; font-size: 13px; line-height: 1.6;">
                <tr>
                  <td style="width: 130px; color: #746B62; font-weight: 600;">Customer Name:</td>
                  <td style="font-weight: bold; color: #302923;">${orderData.customer.fullName}</td>
                </tr>
                <tr>
                  <td style="color: #746B62; font-weight: 600;">Contact Phone:</td>
                  <td><a href="tel:${orderData.customer.phone}" style="color: #9E1830; font-weight: bold; text-decoration: none;">${orderData.customer.phone}</a></td>
                </tr>
                <tr>
                  <td style="color: #746B62; font-weight: 600;">Email Address:</td>
                  <td><a href="mailto:${orderData.customer.email}" style="color: #302923; text-decoration: none;">${orderData.customer.email}</a></td>
                </tr>
                <tr>
                  <td style="color: #746B62; font-weight: 600; vertical-align: top;">Delivery Address:</td>
                  <td style="color: #302923;">
                    ${fullAddress}
                  </td>
                </tr>
                <tr>
                  <td style="color: #746B62; font-weight: 600;">Google Maps:</td>
                  <td>
                    <a href="${mapsUrl}" target="_blank" style="display: inline-block; background: #14532D; color: #ffffff; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: bold; text-decoration: none;">
                      📍 Open Navigation in Google Maps
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="color: #746B62; font-weight: 600;">Payment Mode:</td>
                  <td style="font-weight: bold;">
                    ${orderData.paymentMethod} (${orderData.paymentStatus})
                    ${orderData.razorpayPaymentId ? `<span style="font-family: monospace; font-size: 11px; color: #14532D;"> &bull; Txn: ${orderData.razorpayPaymentId}</span>` : ''}
                  </td>
                </tr>
              </table>
            </div>

            <!-- Items Table -->
            <h3 style="margin: 0 0 10px; font-size: 14px; color: #302923; text-transform: uppercase; letter-spacing: 1px;">
              Ordered Items
            </h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <thead>
                <tr style="background: #F5EFE3; border-bottom: 2px solid #302923; text-align: left;">
                  <th style="padding: 10px; font-size: 11px; text-transform: uppercase;">#</th>
                  <th style="padding: 10px; font-size: 11px; text-transform: uppercase;">Item Description</th>
                  <th style="padding: 10px; font-size: 11px; text-transform: uppercase; text-align: center;">Qty</th>
                  <th style="padding: 10px; font-size: 11px; text-transform: uppercase; text-align: right;">Rate</th>
                  <th style="padding: 10px; font-size: 11px; text-transform: uppercase; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRows}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="4" style="padding: 8px 10px; text-align: right; color: #746B62; font-size: 12px;">Subtotal:</td>
                  <td style="padding: 8px 10px; text-align: right; font-weight: bold; font-size: 13px;">₹${orderData.subtotal}</td>
                </tr>
                ${
                  orderData.discountAmount
                    ? `<tr>
                    <td colspan="4" style="padding: 4px 10px; text-align: right; color: #14532D; font-size: 12px; font-weight: bold;">Discount:</td>
                    <td style="padding: 4px 10px; text-align: right; color: #14532D; font-weight: bold; font-size: 13px;">-₹${orderData.discountAmount}</td>
                  </tr>`
                    : ''
                }
                <tr>
                  <td colspan="4" style="padding: 4px 10px; text-align: right; color: #746B62; font-size: 12px;">Pan-India Delivery:</td>
                  <td style="padding: 4px 10px; text-align: right; font-weight: bold; color: #14532D; font-size: 12px;">FREE</td>
                </tr>
                <tr style="border-top: 2px solid #302923;">
                  <td colspan="4" style="padding: 10px; text-align: right; font-size: 14px; font-weight: bold; color: #302923;">Final Amount:</td>
                  <td style="padding: 10px; text-align: right; font-size: 17px; font-weight: 800; color: #9E1830;">₹${orderData.totalAmount}</td>
                </tr>
              </tfoot>
            </table>

            <!-- Quick Action Link -->
            <div style="text-align: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid #EAE1D3;">
              <a href="${adminUrl}" style="display: inline-block; background-color: #9E1830; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                Manage Order in Admin CRM &rarr;
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #302923; color: #FAF7F0; padding: 14px; text-align: center; font-size: 11px;">
            HM Agarbattis &bull; Sowri Palayam, Coimbatore &bull; +91 63821 77441
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendBrevoEmail({
      to: [{ email: this.adminNotificationEmail, name: 'HM Brand Admin' }],
      subject: `🪔 New Sacred Order: ${orderData.orderNumber} - ₹${orderData.totalAmount} (${orderData.customer.fullName})`,
      htmlContent,
    });
  }

  /**
   * Send Customer Order Confirmation Email with Sacred Theme and Invoice breakdown
   */
  async sendCustomerOrderConfirmation(orderData: OrderEmailData): Promise<boolean> {
    const fullAddress = `${orderData.customer.street}, ${orderData.customer.city}, ${orderData.customer.state} - ${orderData.customer.postalCode}`;
    const trackingUrl = `${this.frontendUrl}/account`;

    const itemsRows = orderData.items
      .map(
        (it) => `
        <tr style="border-bottom: 1px solid #EAE1D3;">
          <td style="padding: 12px 8px; font-size: 13px; color: #302923; font-weight: 600;">
            ${it.name}
            ${it.packInfo ? `<div style="font-size: 11px; color: #746B62; font-weight: normal;">${it.packInfo}</div>` : ''}
          </td>
          <td style="padding: 12px 8px; font-size: 13px; text-align: center; color: #302923;">${it.quantity}</td>
          <td style="padding: 12px 8px; font-size: 13px; text-align: right; font-weight: bold; color: #9E1830;">₹${it.totalPrice}</td>
        </tr>
      `
      )
      .join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Order Confirmation - HM Agarbattis</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FFFDF8; margin: 0; padding: 24px; color: #302923;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #EAE1D3; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          
          <!-- Header -->
          <div style="background-color: #9E1830; padding: 28px 20px; text-align: center; color: #ffffff;">
            <div style="font-size: 10px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #DFB75A;">
              DISCOVER THE DIVINE WITHIN
            </div>
            <h1 style="margin: 8px 0 4px; font-size: 24px; font-weight: 800; letter-spacing: 0.5px;">
              Order Confirmed &amp; Consecrated!
            </h1>
            <p style="margin: 0; font-size: 13px; opacity: 0.9;">
              Thank you for welcoming divine herbal fragrance into your sanctuary.
            </p>
          </div>

          <div style="padding: 24px;">
            <p style="font-size: 14px; line-height: 1.6; margin-top: 0;">
              Namaste <strong>${orderData.customer.fullName}</strong>,<br />
              Your order has been recorded into our sacred ledger. Our artisans in Peelamedu, Coimbatore are preparing your parcels with 100% natural herbal resins, moisture-proof seals, and temple blessings.
            </p>

            <!-- Order Key Info Pill Box -->
            <div style="background: #F5EFE3; border-radius: 10px; padding: 14px 18px; margin: 20px 0; border: 1px solid #EAE1D3;">
              <table style="width: 100%; font-size: 13px;">
                <tr>
                  <td style="color: #746B62;">Order Reference:</td>
                  <td style="font-weight: bold; color: #9E1830; font-family: monospace; font-size: 14px; text-align: right;">${orderData.orderNumber}</td>
                </tr>
                <tr>
                  <td style="color: #746B62;">Payment Status:</td>
                  <td style="font-weight: bold; color: #14532D; text-align: right;">Verified &amp; Paid (₹${orderData.totalAmount})</td>
                </tr>
                <tr>
                  <td style="color: #746B62;">Estimated Dispatch:</td>
                  <td style="font-weight: bold; color: #302923; text-align: right;">Within 24 Hours from Coimbatore</td>
                </tr>
              </table>
            </div>

            <!-- Items Summary -->
            <h3 style="margin: 20px 0 10px; font-size: 14px; color: #302923; text-transform: uppercase; letter-spacing: 1px;">
              Your Consecrated Selection
            </h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
              <thead>
                <tr style="background: #FFFDF8; border-bottom: 2px solid #9E1830; text-align: left;">
                  <th style="padding: 8px; font-size: 11px; text-transform: uppercase; color: #746B62;">Product</th>
                  <th style="padding: 8px; font-size: 11px; text-transform: uppercase; text-align: center; color: #746B62;">Qty</th>
                  <th style="padding: 8px; font-size: 11px; text-transform: uppercase; text-align: right; color: #746B62;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRows}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="padding: 8px; text-align: right; color: #746B62; font-size: 12px;">Pan-India Sacred Courier:</td>
                  <td style="padding: 8px; text-align: right; font-weight: bold; color: #14532D; font-size: 12px;">FREE</td>
                </tr>
                <tr style="border-top: 1.5px solid #302923;">
                  <td colspan="2" style="padding: 10px 8px; text-align: right; font-size: 14px; font-weight: bold; color: #302923;">Total Paid:</td>
                  <td style="padding: 10px 8px; text-align: right; font-size: 17px; font-weight: 800; color: #9E1830;">₹${orderData.totalAmount}</td>
                </tr>
              </tfoot>
            </table>

            <!-- Shipping Destination Card -->
            <div style="background: #ffffff; border: 1px solid #EAE1D3; border-radius: 10px; padding: 14px; margin: 20px 0;">
              <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #746B62; margin-bottom: 6px;">
                📍 Delivery Destination:
              </div>
              <div style="font-size: 13px; line-height: 1.5; color: #302923;">
                <strong>${orderData.customer.fullName}</strong><br />
                ${fullAddress}<br />
                Phone: ${orderData.customer.phone}
              </div>
            </div>

            <!-- CTAs -->
            <div style="text-align: center; margin: 28px 0 10px;">
              <a href="${trackingUrl}" style="display: inline-block; background-color: #9E1830; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                View Order &amp; Track Status &rarr;
              </a>
            </div>
          </div>

          <!-- Footer Blessing -->
          <div style="background-color: #F5EFE3; border-top: 1px solid #EAE1D3; padding: 18px 20px; text-align: center; font-size: 12px; color: #746B62;">
            <p style="margin: 0 0 6px; font-weight: bold; color: #302923;">HM Agarbattis &bull; Peelamedu, Coimbatore</p>
            <p style="margin: 0; font-size: 11px;">
              Need devotional assistance? Call or WhatsApp: <a href="tel:+916382177441" style="color: #9E1830; text-decoration: none; font-weight: bold;">+91 63821 77441</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendBrevoEmail({
      to: [{ email: orderData.customer.email, name: orderData.customer.fullName }],
      subject: `✨ Sacred Order Confirmed: ${orderData.orderNumber} - HM Agarbattis`,
      htmlContent,
    });
  }

  /**
   * Send Order Status Update to Customer (e.g. Shipped / Dispatched / Delivered)
   */
  async sendCustomerStatusUpdate(
    order: { orderNumber: string; customerEmail: string; customerPhone?: string },
    customerName: string,
    newStatus: string,
    courierData?: { courierName?: string; trackingNumber?: string; courierNote?: string }
  ): Promise<boolean> {
    const statusTitles: Record<string, string> = {
      CONFIRMED: 'Order Consecrated & Confirmed',
      PROCESSING: 'Order Being Consecrated & Packed',
      READY_TO_SHIP: 'Packed & Awaiting Courier Handover',
      SHIPPED: 'Sacred Parcel Dispatched from Coimbatore!',
      DISPATCHED: 'Sacred Parcel Dispatched from Coimbatore!',
      DELIVERED: 'Sacred Fragrance Delivered to Your Home!',
      CANCELLED: 'Order Cancelled',
    };

    const title = statusTitles[newStatus] || `Order Status Updated to ${newStatus}`;
    const trackingUrl = `${this.frontendUrl}/account`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: -apple-system, sans-serif; background-color: #FFFDF8; padding: 24px; color: #302923;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #EAE1D3; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #9E1830; color: #ffffff; padding: 20px; text-align: center;">
            <div style="font-size: 10px; font-weight: bold; letter-spacing: 2px; color: #DFB75A;">HM BRAND COIMBATORE</div>
            <h2 style="margin: 6px 0 0;">${title}</h2>
          </div>
          <div style="padding: 24px; font-size: 14px; line-height: 1.6;">
            <p>Namaste <strong>${customerName}</strong>,</p>
            <p>Your sacred order <strong>${order.orderNumber}</strong> has been updated to: <strong style="color: #9E1830;">${newStatus}</strong>.</p>
            ${
              courierData?.courierName || courierData?.trackingNumber
                ? `<div style="background: #F5EFE3; border-radius: 8px; padding: 14px; margin: 16px 0;">
                <strong>Courier Partner:</strong> ${courierData.courierName || 'Sacred Pan-India Express'}<br />
                ${courierData.trackingNumber ? `<strong>Tracking AWB:</strong> <code style="background: #ffffff; padding: 2px 6px; border-radius: 4px;">${courierData.trackingNumber}</code><br />` : ''}
                ${courierData.courierNote ? `<span style="font-size: 12px; color: #746B62;">Note: ${courierData.courierNote}</span>` : ''}
              </div>`
                : ''
            }
            <div style="text-align: center; margin: 24px 0;">
              <a href="${trackingUrl}" style="background-color: #9E1830; color: #ffffff; padding: 10px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 13px;">
                Track Live Order in Account &rarr;
              </a>
            </div>
          </div>
          <div style="background-color: #302923; color: #FAF7F0; padding: 12px; text-align: center; font-size: 11px;">
            HM Agarbattis &bull; Peelamedu, Coimbatore &bull; +91 63821 77441
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendBrevoEmail({
      to: [{ email: order.customerEmail, name: customerName }],
      subject: `🚚 ${title} - ${order.orderNumber}`,
      htmlContent,
    });
  }
}

export const emailService = new EmailService();

