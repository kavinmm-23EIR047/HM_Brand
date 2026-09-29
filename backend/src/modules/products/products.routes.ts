import { Router } from 'express';
import { productsController } from './products.controller';
import { validateRequest } from '../../shared/middlewares/validation.middleware';
import { createProductSchema, updateProductSchema, productQuerySchema } from './products.schema';
import { authenticateJWT, requireRole, optionalAuthenticateJWT } from '../../shared/middlewares/auth.middleware';

const router = Router();

// Public Routes
router.get('/', optionalAuthenticateJWT, validateRequest(productQuerySchema), productsController.getAll);

router.get('/:slug', productsController.getBySlug);

// Admin Routes
router.post(
  '/admin',
  authenticateJWT,
  requireRole('ADMIN'),
  validateRequest(createProductSchema),
  productsController.create
);

router.patch(
  '/admin/:id',
  authenticateJWT,
  requireRole('ADMIN'),
  validateRequest(updateProductSchema),
  productsController.update
);

router.post(
  '/admin/:id/images',
  authenticateJWT,
  requireRole('ADMIN'),
  productsController.addImage
);

router.delete(
  '/admin/images/:imageId',
  authenticateJWT,
  requireRole('ADMIN'),
  productsController.removeImage
);

router.delete(
  '/admin/:id',
  authenticateJWT,
  requireRole('ADMIN'),
  productsController.delete
);

export default router;
