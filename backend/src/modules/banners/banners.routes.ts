import { Router } from 'express';
import { bannersController } from './banners.controller';
import { authenticateJWT, requireRole, optionalAuthenticateJWT } from '../../shared/middlewares/auth.middleware';

const router = Router();

// Public Routes
router.get('/', optionalAuthenticateJWT, bannersController.getAll);


// Admin Routes
router.post('/admin', authenticateJWT, requireRole('ADMIN'), bannersController.create);
router.patch('/admin/:id', authenticateJWT, requireRole('ADMIN'), bannersController.update);
router.delete('/admin/:id', authenticateJWT, requireRole('ADMIN'), bannersController.delete);

export default router;
