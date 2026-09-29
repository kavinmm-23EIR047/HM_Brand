import { Router } from 'express';
import { contactController } from './contact.controller';
import { authenticateJWT, requireRole } from '../../shared/middlewares/auth.middleware';

const router = Router();

// Public Route
router.post('/', contactController.submit);

// Admin Routes
router.get('/admin', authenticateJWT, requireRole('ADMIN'), contactController.getAll);
router.patch('/admin/:id/read', authenticateJWT, requireRole('ADMIN'), contactController.markAsRead);

export default router;
