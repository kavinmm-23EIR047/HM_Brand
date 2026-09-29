import { Router } from 'express';
import { festivalsController } from './festivals.controller';
import { authenticateJWT, requireRole } from '../../shared/middlewares/auth.middleware';

const router = Router();

// Public Routes
router.get('/', festivalsController.getAll);
router.get('/:slug', festivalsController.getBySlug);

// Admin Routes
router.post('/admin', authenticateJWT, requireRole('ADMIN'), festivalsController.create);
router.patch('/admin/:id', authenticateJWT, requireRole('ADMIN'), festivalsController.update);
router.delete('/admin/:id', authenticateJWT, requireRole('ADMIN'), festivalsController.delete);

export default router;
