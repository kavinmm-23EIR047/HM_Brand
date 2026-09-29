import { Router } from 'express';
import { adminController } from './admin.controller';
import { authenticateJWT, requireRole } from '../../shared/middlewares/auth.middleware';

const router = Router();

router.use(authenticateJWT, requireRole('ADMIN'));

router.get('/dashboard', adminController.getDashboard);
router.get('/audit-logs', adminController.getAuditLogs);

export default router;
