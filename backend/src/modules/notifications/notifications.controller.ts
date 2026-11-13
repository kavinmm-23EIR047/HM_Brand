import { Request, Response } from 'express';
import { pushService } from '../../shared/notifications/push.service';
import { telegramService } from '../../shared/messaging/telegram.service';
import { sendSuccess, sendError } from '../../shared/utils/response.util';

export class NotificationsController {
  public getVapidKey = async (_req: Request, res: Response) => {
    const publicKey = pushService.getPublicKey();
    return sendSuccess(res, { publicKey }, 'VAPID public key fetched');
  };

  public subscribe = async (req: Request, res: Response) => {
    const { subscription, role, userId } = req.body;

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return sendError(res, 'Invalid push subscription payload', 400);
    }

    const userAgent = (req.headers['user-agent'] as string) || undefined;
    const ok = pushService.registerSubscription({
      endpoint: subscription.endpoint,
      keys: subscription.keys,
      userId: userId || (req as any).user?.userId,
      role: role || ((req as any).user?.role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER'),
      userAgent,
    });

    if (!ok) {
      return sendError(res, 'Failed to register subscription', 500);
    }

    return sendSuccess(res, { registered: true }, 'Web push subscription registered successfully');
  };

  public unsubscribe = async (req: Request, res: Response) => {
    const { endpoint } = req.body;
    if (!endpoint) {
      return sendError(res, 'Endpoint is required', 400);
    }

    const removed = pushService.removeSubscription(endpoint);
    return sendSuccess(res, { removed }, removed ? 'Subscription removed' : 'Subscription not found');
  };

  public sendTestAlert = async (req: Request, res: Response) => {
    const { title, body, adminName } = req.body;

    // Send push notification to admin
    const pushResult = await pushService.notifyAdmins({
      title: title || '🕉️ HM Brand: Admin Push Notification Ready',
      body: body || 'Real-time order alerts will display here across your PC and mobile devices.',
      url: '/admin',
    });

    // Send telegram test alert
    const telegramResult = await telegramService.sendTestAlert(adminName || 'HM Admin');

    return sendSuccess(
      res,
      {
        pushSentCount: pushResult.sent,
        pushFailedCount: pushResult.failed,
        telegramDispatched: telegramResult,
      },
      'Test alerts dispatched'
    );
  };

  public broadcast = async (req: Request, res: Response) => {
    const { title, body, url } = req.body;
    if (!title || !body) {
      return sendError(res, 'Title and body are required for broadcast', 400);
    }

    const result = await pushService.broadcastToAll({
      title,
      body,
      url: url || '/shop',
    });

    return sendSuccess(res, result, `Broadcast pushed to ${result.sent} active subscribers`);
  };
}

export const notificationsController = new NotificationsController();
