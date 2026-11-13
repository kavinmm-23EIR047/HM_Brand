import { Router } from 'express';
import { notificationsController } from './notifications.controller';

const router = Router();

router.get('/vapid-key', notificationsController.getVapidKey);
router.post('/subscribe', notificationsController.subscribe);
router.post('/unsubscribe', notificationsController.unsubscribe);
router.post('/test-admin', notificationsController.sendTestAlert);
router.post('/broadcast', notificationsController.broadcast);

export default router;

