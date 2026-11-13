import webpush from 'web-push';
import fs from 'fs';
import path from 'path';

export interface PushSubscriptionItem {
  id: string;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  userId?: string;
  role?: 'ADMIN' | 'CUSTOMER';
  userAgent?: string;
  createdAt: string;
  lastNotifiedAt?: string;
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  url?: string;
  tag?: string;
  data?: Record<string, any>;
}

export class PushNotificationService {
  private storageFilePath: string;
  private isVapidInitialized: boolean = false;

  constructor() {
    this.storageFilePath = path.join(process.cwd(), 'data', 'push-subscriptions.json');
    this.initVapid();
  }

  private initVapid(): void {
    const subject = process.env.VAPID_SUBJECT || 'mailto:jayamassociatescoimbatore@gmail.com';
    const publicKey = process.env.VAPID_PUBLIC_KEY || 'BCcqFjOm1d-yuRV3UTShIDofH1d_iugkulPeK31kixpC_5chAfB4Wg5cIUad6JvRRadnpTyTIO4E1KU8kkLi0NA';
    const privateKey = process.env.VAPID_PRIVATE_KEY || 'iiRxPl4GIadrSuAlnJb0hG_EPW9F5Hk3tkJiDIcU7yE';

    if (publicKey && privateKey) {
      try {
        webpush.setVapidDetails(subject, publicKey, privateKey);
        this.isVapidInitialized = true;
        console.log('[PushNotificationService] Web Push VAPID keys loaded successfully.');
      } catch (err) {
        console.error('[PushNotificationService] Failed to initialize VAPID keys:', err);
      }
    } else {
      console.warn('[PushNotificationService] VAPID keys missing in .env');
    }
  }

  public getPublicKey(): string {
    return process.env.VAPID_PUBLIC_KEY || 'BCcqFjOm1d-yuRV3UTShIDofH1d_iugkulPeK31kixpC_5chAfB4Wg5cIUad6JvRRadnpTyTIO4E1KU8kkLi0NA';
  }

  /**
   * Load stored subscriptions from JSON file
   */
  private loadSubscriptions(): PushSubscriptionItem[] {
    try {
      if (!fs.existsSync(this.storageFilePath)) {
        const dir = path.dirname(this.storageFilePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(this.storageFilePath, JSON.stringify([], null, 2));
        return [];
      }
      const data = fs.readFileSync(this.storageFilePath, 'utf-8');
      return JSON.parse(data || '[]');
    } catch (error) {
      console.error('[PushNotificationService] Failed to load push subscriptions:', error);
      return [];
    }
  }

  /**
   * Save subscriptions to JSON file
   */
  private saveSubscriptions(subscriptions: PushSubscriptionItem[]): void {
    try {
      const dir = path.dirname(this.storageFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.storageFilePath, JSON.stringify(subscriptions, null, 2));
    } catch (error) {
      console.error('[PushNotificationService] Failed to write push subscriptions:', error);
    }
  }

  /**
   * Register or update a browser push subscription
   */
  public registerSubscription(params: {
    endpoint: string;
    keys: { p256dh: string; auth: string };
    userId?: string;
    role?: 'ADMIN' | 'CUSTOMER';
    userAgent?: string;
  }): boolean {
    if (!params.endpoint || !params.keys?.p256dh || !params.keys?.auth) {
      return false;
    }

    const subscriptions = this.loadSubscriptions();
    const existingIndex = subscriptions.findIndex((s) => s.endpoint === params.endpoint);

    const record: PushSubscriptionItem = {
      id: existingIndex >= 0 ? subscriptions[existingIndex].id : `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      endpoint: params.endpoint,
      keys: params.keys,
      userId: params.userId || (existingIndex >= 0 ? subscriptions[existingIndex].userId : undefined),
      role: params.role || (existingIndex >= 0 ? subscriptions[existingIndex].role : 'CUSTOMER'),
      userAgent: params.userAgent || (existingIndex >= 0 ? subscriptions[existingIndex].userAgent : undefined),
      createdAt: existingIndex >= 0 ? subscriptions[existingIndex].createdAt : new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      subscriptions[existingIndex] = record;
    } else {
      subscriptions.push(record);
    }

    this.saveSubscriptions(subscriptions);
    console.log(`[PushNotificationService] Subscription saved (Total: ${subscriptions.length}, Role: ${record.role})`);
    return true;
  }

  /**
   * Remove a subscription by endpoint
   */
  public removeSubscription(endpoint: string): boolean {
    const subscriptions = this.loadSubscriptions();
    const filtered = subscriptions.filter((s) => s.endpoint !== endpoint);
    if (filtered.length !== subscriptions.length) {
      this.saveSubscriptions(filtered);
      return true;
    }
    return false;
  }

  /**
   * Send notification to a specific subscription
   */
  public async sendToSubscription(
    subscription: PushSubscriptionItem,
    payload: PushNotificationPayload
  ): Promise<boolean> {
    if (!this.isVapidInitialized) {
      this.initVapid();
      if (!this.isVapidInitialized) return false;
    }

    const fullPayload = JSON.stringify({
      title: payload.title,
      body: payload.body,
      icon: payload.icon || '/images/brand_logo_gold_transparent.png',
      badge: payload.badge || '/images/brand_logo_gold_transparent.png',
      image: payload.image,
      url: payload.url || '/',
      tag: payload.tag || 'hm-brand-alert',
      data: {
        url: payload.url || '/',
        timestamp: Date.now(),
        ...(payload.data || {}),
      },
    });

    try {
      await webpush.sendNotification(
        {
          endpoint: subscription.endpoint,
          keys: subscription.keys,
        },
        fullPayload,
        {
          TTL: 60 * 60 * 24, // 24 hours
          urgency: 'high',
        }
      );
      return true;
    } catch (err: any) {
      // If subscription expired or gone (410, 404), unregister it
      if (err.statusCode === 410 || err.statusCode === 404) {
        console.warn(`[PushNotificationService] Stale subscription ${subscription.id} removed (${err.statusCode})`);
        this.removeSubscription(subscription.endpoint);
      } else {
        console.error(`[PushNotificationService] Push send error:`, err?.message || err);
      }
      return false;
    }
  }

  /**
   * Send Push Notification to all subscribed Admins
   */
  public async notifyAdmins(payload: PushNotificationPayload): Promise<{ sent: number; failed: number }> {
    const subscriptions = this.loadSubscriptions().filter((s) => s.role === 'ADMIN');
    let sent = 0;
    let failed = 0;

    await Promise.all(
      subscriptions.map(async (sub) => {
        const ok = await this.sendToSubscription(sub, {
          ...payload,
          url: payload.url || '/admin',
        });
        if (ok) sent++;
        else failed++;
      })
    );

    return { sent, failed };
  }

  /**
   * Send Push Notification to a specific customer
   */
  public async notifyCustomer(userId: string, payload: PushNotificationPayload): Promise<{ sent: number; failed: number }> {
    if (!userId) return { sent: 0, failed: 0 };
    const subscriptions = this.loadSubscriptions().filter((s) => s.userId === userId);
    let sent = 0;
    let failed = 0;

    await Promise.all(
      subscriptions.map(async (sub) => {
        const ok = await this.sendToSubscription(sub, {
          ...payload,
          url: payload.url || '/account',
        });
        if (ok) sent++;
        else failed++;
      })
    );

    return { sent, failed };
  }

  /**
   * Broadcast push notification to all users (for offers, stock alerts, etc.)
   */
  public async broadcastToAll(payload: PushNotificationPayload): Promise<{ sent: number; failed: number }> {
    const subscriptions = this.loadSubscriptions();
    let sent = 0;
    let failed = 0;

    await Promise.all(
      subscriptions.map(async (sub) => {
        const ok = await this.sendToSubscription(sub, payload);
        if (ok) sent++;
        else failed++;
      })
    );

    return { sent, failed };
  }
}

export const pushService = new PushNotificationService();

