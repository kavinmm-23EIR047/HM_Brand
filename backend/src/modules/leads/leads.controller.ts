import { Request, Response } from 'express';
import { leadsService } from './leads.service';
import { sendSuccess, sendError } from '../../shared/utils/response.util';

export class LeadsController {
  public create = async (req: Request, res: Response) => {
    const { name, phone, email, purpose, preferredFragrance, recommendedProducts, couponGiven, notes, source } = req.body;

    if (!name || !phone) {
      return sendError(res, 'Name and phone number are required', 400);
    }

    try {
      const lead = await leadsService.createLead({
        name,
        phone,
        email,
        purpose,
        preferredFragrance,
        recommendedProducts,
        couponGiven: couponGiven || 'DIVINE15',
        notes,
        source: source || 'CHATBOT',
      });

      return sendSuccess(res, lead, 'Thank you! Your inquiry has been submitted and your coupon is ready.', 201);
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to save lead', 500);
    }
  };

  public getAll = async (req: Request, res: Response) => {
    const { status, search, page, limit } = req.query;

    const result = leadsService.getLeads({
      status: status ? String(status) : undefined,
      search: search ? String(search) : undefined,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    });

    return sendSuccess(res, result, 'Leads fetched successfully');
  };

  public update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, notes } = req.body;

    const updated = leadsService.updateLead(id, { status, notes });
    if (!updated) {
      return sendError(res, 'Lead not found', 404);
    }

    return sendSuccess(res, updated, 'Lead updated successfully');
  };

  public delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    const removed = leadsService.deleteLead(id);
    if (!removed) {
      return sendError(res, 'Lead not found', 404);
    }

    return sendSuccess(res, { id }, 'Lead deleted successfully');
  };
}

export const leadsController = new LeadsController();

