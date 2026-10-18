import { Router } from 'express';
import { collectionsController } from './collections.controller';
import { authenticateJWT, requireRole, optionalAuthenticateJWT } from '../../shared/middlewares/auth.middleware';

const router = Router();

// Public Routes
router.get('/', optionalAuthenticateJWT, collectionsController.getAll);
router.get('/:slug', optionalAuthenticateJWT, collectionsController.getBySlug);

// Admin Routes
router.post('/admin', authenticateJWT, requireRole('ADMIN'), collectionsController.create);
router.patch('/admin/:id', authenticateJWT, requireRole('ADMIN'), collectionsController.update);
router.delete('/admin/:id', authenticateJWT, requireRole('ADMIN'), collectionsController.delete);

export default router;
