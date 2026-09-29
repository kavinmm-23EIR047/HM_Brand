import { Router } from 'express';
import { collectionsController } from './collections.controller';
import { authenticateJWT, requireRole } from '../../shared/middlewares/auth.middleware';

const router = Router();

// Public Routes
router.get('/', collectionsController.getAll);
router.get('/:slug', collectionsController.getBySlug);

// Admin Routes
router.post('/admin', authenticateJWT, requireRole('ADMIN'), collectionsController.create);
router.patch('/admin/:id', authenticateJWT, requireRole('ADMIN'), collectionsController.update);
router.delete('/admin/:id', authenticateJWT, requireRole('ADMIN'), collectionsController.delete);

export default router;
