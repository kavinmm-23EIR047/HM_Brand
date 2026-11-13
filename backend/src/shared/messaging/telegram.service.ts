import { OrderEmailData } from './email.service';

export class TelegramService {
  private get botToken(): string {
    return process.env.TELEGRAM_BOT_TOKEN || '';
  }

  private get chatId(): string {
    return process.env.TELEGRAM_CHAT_ID || '';
  }

  private get frontendUrl(): string {
    return process.env.FRONTEND_URL || 'http://localhost:3000';
  }

  public isConfigured(): boolean {
    return Boolean(this.botToken && this.chatId);
  }

  /**
   * Helper to send HTML formatted message via Telegram Bot API
   */
  public async sendMessage(htmlMessage: string, options?: { disableWebPagePreview?: boolean }): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn('[TelegramService] Bot token or Chat ID is not configured in .env. Skipping Telegram alert.');
      return false;
    }

    try {
      const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: htmlMessage,
          parse_mode: 'HTML',
          disable_web_page_preview: options?.disableWebPagePreview ?? false,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as any;

      if (!response.ok || !data?.ok) {
        console.error('[TelegramService] Telegram API Error:', data);
        return false;
      }

      console.log('[TelegramService] Telegram alert dispatched successfully to chat:', this.chatId);
      return true;
    } catch (error) {
      console.error('[TelegramService] Failed to send Telegram alert:', error);
      return false;
    }
  }

  /**
   * Send comprehensive Admin Order Alert via Telegram with items and Google Maps link
   */
  public async sendOrderAlert(order: OrderEmailData): Promise<boolean> {
    const formattedDate = order.createdAt
      ? new Date(order.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })
      : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const fullAddress = [
      order.customer.street,
      order.customer.city,
      order.customer.state,
      order.customer.postalCode,
      'India',
    ]
      .filter(Boolean)
      .join(', ');

    const encodedAddress = encodeURIComponent(fullAddress);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    const adminOrderUrl = `${this.frontendUrl}/admin`;

    const itemsSummary = order.items
      .map((item, idx) => {
        const pack = item.packInfo ? ` (${item.packInfo})` : '';
        return `  ${idx + 1}. <b>${this.escapeHtml(item.name)}</b>${pack}\n     ${item.quantity} × ₹${item.unitPrice.toLocaleString('en-IN')} = <b>₹${item.totalPrice.toLocaleString('en-IN')}</b>`;
      })
      .join('\n');

    const message = [
      `🔔 <b>SACRED NEW ORDER RECEIVED!</b>`,
      `━━━━━━━━━━━━━━━━━━━━━━`,
      `📦 <b>Order ID:</b> <code>${order.orderNumber}</code>`,
      `📅 <b>Date:</b> ${formattedDate}`,
      `💰 <b>Total Amount:</b> <b>₹${order.totalAmount.toLocaleString('en-IN')}</b>`,
      `💳 <b>Payment:</b> ${order.paymentMethod} (${order.paymentStatus})`,
      order.razorpayPaymentId ? `🔖 <b>Razorpay Ref:</b> <code>${order.razorpayPaymentId}</code>` : '',
      `━━━━━━━━━━━━━━━━━━━━━━`,
      `👤 <b>CUSTOMER DETAILS:</b>`,
      `• <b>Name:</b> ${this.escapeHtml(order.customer.fullName)}`,
      `• <b>Phone:</b> <a href="tel:${order.customer.phone.replace(/[^0-9+]/g, '')}">${order.customer.phone}</a>`,
      `• <b>Email:</b> ${order.customer.email}`,
      `━━━━━━━━━━━━━━━━━━━━━━`,
      `📍 <b>DELIVERY DESTINATION:</b>`,
      `${this.escapeHtml(fullAddress)}`,
      `🗺️ <a href="${googleMapsUrl}"><b>Open Exact Location in Google Maps ➔</b></a>`,
      `━━━━━━━━━━━━━━━━━━━━━━`,
      `🛍️ <b>ORDER ITEMS (${order.items.length}):</b>`,
      itemsSummary,
      `\n💵 <b>Subtotal:</b> ₹${order.subtotal.toLocaleString('en-IN')}`,
      order.discountAmount ? `🏷️ <b>Discount:</b> -₹${order.discountAmount.toLocaleString('en-IN')}` : '',
      `🚚 <b>Shipping:</b> ${order.shippingCost ? '₹' + order.shippingCost : 'FREE (Coimbatore Temple Dispatch)'}`,
      `━━━━━━━━━━━━━━━━━━━━━━`,
      `⚡ <a href="${adminOrderUrl}"><b>Manage in HM Brand Admin CRM ➔</b></a>`,
    ]
      .filter((line) => line !== '')
      .join('\n');

    return this.sendMessage(message);
  }

  /**
   * Diagnostic test alert for admin
   */
  public async sendTestAlert(adminName: string = 'HM Admin'): Promise<boolean> {
    const testMessage = [
      `🕉️ <b>HM BRAND TELEGRAM NOTIFICATIONS READY!</b>`,
      `━━━━━━━━━━━━━━━━━━━━━━`,
      `Namaste ${this.escapeHtml(adminName)},`,
      `Your Telegram Bot integration with HM Agarbattis & Fragrances is successfully verified.`,
      `\nAll new incoming orders, live customer locations, and payment verifications will now arrive instantly in this chat.`,
      `\nTimestamp: <i>${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</i>`,
    ].join('\n');

    return this.sendMessage(testMessage);
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}

export const telegramService = new TelegramService();
