import { Router } from 'express';
import { ordersController } from './orders.controller';
import { validateRequest } from '../../shared/middlewares/validation.middleware';
import { createOrderSchema, updateOrderStatusSchema } from './orders.schema';
import { authenticateJWT, optionalAuthenticateJWT, requireRole } from '../../shared/middlewares/auth.middleware';

const router = Router();

// Public / Customer Route (Supports Guest or Auth user checkout)
router.post('/', optionalAuthenticateJWT, validateRequest(createOrderSchema), ordersController.create);

// Authenticated / Guest Customer Routes
router.get('/', optionalAuthenticateJWT, ordersController.getAll);
router.get('/:id', optionalAuthenticateJWT, ordersController.getOne);

// Admin Routes
router.patch(
  '/admin/:id/status',
  authenticateJWT,
  requireRole('ADMIN'),
  validateRequest(updateOrderStatusSchema),
  ordersController.updateStatus
);

export default router;
