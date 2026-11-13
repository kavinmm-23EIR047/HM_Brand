import fs from 'fs';
import path from 'path';
import { telegramService } from '../../shared/messaging/telegram.service';
import { pushService } from '../../shared/notifications/push.service';

export interface LeadProductSummary {
  id?: string;
  name: string;
  slug?: string;
  price?: number;
  image?: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  purpose?: string;
  preferredFragrance?: string;
  recommendedProducts?: LeadProductSummary[];
  couponGiven?: string;
  status: 'NEW' | 'CONTACTED' | 'CONVERTED' | 'CLOSED';
  notes?: string;
  source: 'CHATBOT' | 'WEBSITE';
  createdAt: string;
  updatedAt: string;
}

export class LeadsService {
  private filePath: string;

  constructor() {
    this.filePath = path.join(process.cwd(), 'data', 'leads.json');
  }

  private loadLeads(): Lead[] {
    try {
      if (!fs.existsSync(this.filePath)) {
        const dir = path.dirname(this.filePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(this.filePath, JSON.stringify([], null, 2));
        return [];
      }
      const data = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(data || '[]');
    } catch (err) {
      console.error('[LeadsService] Error loading leads:', err);
      return [];
    }
  }

  private saveLeads(leads: Lead[]): void {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.filePath, JSON.stringify(leads, null, 2));
    } catch (err) {
      console.error('[LeadsService] Error saving leads:', err);
    }
  }

  public async createLead(data: {
    name: string;
    phone: string;
    email?: string;
    purpose?: string;
    preferredFragrance?: string;
    recommendedProducts?: LeadProductSummary[];
    couponGiven?: string;
    notes?: string;
    source?: 'CHATBOT' | 'WEBSITE';
  }): Promise<Lead> {
    const leads = this.loadLeads();
    const cleanPhone = (data.phone || '').trim().replace(/[^0-9+]/g, '');

    const newLead: Lead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: data.name.trim(),
      phone: cleanPhone,
      email: data.email?.trim() || undefined,
      purpose: data.purpose?.trim() || 'Fragrance Advisor Consultation',
      preferredFragrance: data.preferredFragrance?.trim() || undefined,
      recommendedProducts: data.recommendedProducts || [],
      couponGiven: data.couponGiven || 'DIVINE15',
      status: 'NEW',
      notes: data.notes?.trim() || undefined,
      source: data.source || 'CHATBOT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    leads.unshift(newLead);
    this.saveLeads(leads);

    // Notify Admin via Telegram and Push non-blocking
    this.dispatchLeadNotifications(newLead);

    return newLead;
  }

  public getLeads(filters?: { status?: string; search?: string; page?: number; limit?: number }) {
    let leads = this.loadLeads();

    if (filters?.status && filters.status !== 'all') {
      leads = leads.filter((l) => l.status === filters.status);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      leads = leads.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.phone.includes(q) ||
          (l.email && l.email.toLowerCase().includes(q)) ||
          (l.purpose && l.purpose.toLowerCase().includes(q))
      );
    }

    const page = Math.max(1, filters?.page || 1);
    const limit = Math.max(1, filters?.limit || 20);
    const totalItems = leads.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const paginatedLeads = leads.slice(startIndex, startIndex + limit);

    return {
      items: paginatedLeads,
      meta: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      counts: {
        all: leads.length,
        new: leads.filter((l) => l.status === 'NEW').length,
        contacted: leads.filter((l) => l.status === 'CONTACTED').length,
        converted: leads.filter((l) => l.status === 'CONVERTED').length,
        closed: leads.filter((l) => l.status === 'CLOSED').length,
      },
    };
  }

  public updateLead(id: string, updates: { status?: 'NEW' | 'CONTACTED' | 'CONVERTED' | 'CLOSED'; notes?: string }): Lead | null {
    const leads = this.loadLeads();
    const index = leads.findIndex((l) => l.id === id);
    if (index === -1) return null;

    leads[index] = {
      ...leads[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.saveLeads(leads);
    return leads[index];
  }

  public deleteLead(id: string): boolean {
    const leads = this.loadLeads();
    const filtered = leads.filter((l) => l.id !== id);
    if (filtered.length !== leads.length) {
      this.saveLeads(filtered);
      return true;
    }
    return false;
  }

  private async dispatchLeadNotifications(lead: Lead) {
    const digitsOnly = lead.phone.replace(/[^0-9]/g, '');
    const phoneWithCountry = digitsOnly.length === 10 ? `91${digitsOnly}` : digitsOnly;
    const waUrl = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(
      `Namaste ${lead.name}! Greetings from HM Agarbattis & Fragrances Coimbatore. Thank you for your inquiry regarding ${lead.purpose || 'our sacred fragrances'}. Here is your 15% discount code: ${lead.couponGiven || 'DIVINE15'}. How may we assist you today?`
    )}`;

    const telegramMsg = [
      `🌟 <b>NEW CUSTOMER LEAD FROM SACRED CHATBOT!</b>`,
      `━━━━━━━━━━━━━━━━━━━━━━`,
      `👤 <b>Name:</b> ${this.escapeHtml(lead.name)}`,
      `📱 <b>Phone:</b> <a href="tel:${lead.phone}">${lead.phone}</a>`,
      `💬 <b>WhatsApp:</b> <a href="${waUrl}">Chat on WhatsApp ➔</a>`,
      lead.email ? `✉️ <b>Email:</b> ${lead.email}` : '',
      `🎯 <b>Interest / Need:</b> <b>${this.escapeHtml(lead.purpose || 'Fragrance Advisor Consultation')}</b>`,
      lead.preferredFragrance ? `🌸 <b>Preference:</b> ${this.escapeHtml(lead.preferredFragrance)}` : '',
      `🏷️ <b>Coupon Issued:</b> <code>${lead.couponGiven || 'DIVINE15'}</code>`,
      lead.recommendedProducts && lead.recommendedProducts.length > 0
        ? `🛍️ <b>Recommended Items:</b> ${lead.recommendedProducts.map((p) => p.name).join(', ')}`
        : '',
      `━━━━━━━━━━━━━━━━━━━━━━`,
      `⚡ <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin"><b>View in HM Brand CRM ➔</b></a>`,
    ]
      .filter(Boolean)
      .join('\n');

    Promise.allSettled([
      // 1. Telegram Alert to Admin
      telegramService.sendMessage(telegramMsg),
      // 2. Web Push Alert to Admin
      pushService.notifyAdmins({
        title: `🌟 New Lead: ${lead.name}`,
        body: `${lead.phone} - Interested in ${lead.purpose || 'Sacred Fragrances'}`,
        url: '/admin',
        data: { leadId: lead.id, leadPhone: lead.phone },
      }),
    ]).catch((err) => console.error('[LeadsService] Error dispatching notifications:', err));
  }

  private escapeHtml(text: string): string {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}

export const leadsService = new LeadsService();

