import { Router } from 'express';
import { ordersController } from './orders.controller';
import { validateRequest } from '../../shared/middlewares/validation.middleware';
import { createOrderSchema, updateOrderStatusSchema } from './orders.schema';
import { authenticateJWT, requireRole } from '../../shared/middlewares/auth.middleware';

const router = Router();

// Public / Customer Route (Supports Guest or Auth user checkout)
router.post('/', validateRequest(createOrderSchema), ordersController.create);

// Authenticated Customer Routes
router.get('/', authenticateJWT, ordersController.getAll);
router.get('/:id', authenticateJWT, ordersController.getOne);

// Admin Routes
router.patch(
  '/admin/:id/status',
  authenticateJWT,
  requireRole('ADMIN'),
  validateRequest(updateOrderStatusSchema),
  ordersController.updateStatus
);

export default router;
