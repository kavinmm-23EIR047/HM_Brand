import { Router } from 'express';
import { couponsController } from './coupons.controller';
import { authenticateJWT, requireRole } from '../../shared/middlewares/auth.middleware';

const router = Router();

// Public / Customer Route
router.post('/validate', couponsController.validate);

// Admin Routes
router.get('/admin', authenticateJWT, requireRole('ADMIN'), couponsController.getAll);
router.post('/admin', authenticateJWT, requireRole('ADMIN'), couponsController.create);
router.patch('/admin/:id', authenticateJWT, requireRole('ADMIN'), couponsController.update);
router.delete('/admin/:id', authenticateJWT, requireRole('ADMIN'), couponsController.delete);

export default router;
