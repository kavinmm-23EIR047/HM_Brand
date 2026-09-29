import { Router } from 'express';
import { newsletterController } from './newsletter.controller';
import { authenticateJWT, requireRole } from '../../shared/middlewares/auth.middleware';

const router = Router();

// Public Route
router.post('/subscribe', newsletterController.subscribe);

// Admin Route
router.get('/admin', authenticateJWT, requireRole('ADMIN'), newsletterController.getAll);

export default router;
