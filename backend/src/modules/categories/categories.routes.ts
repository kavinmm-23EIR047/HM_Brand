import { Router } from 'express';
import { categoriesController } from './categories.controller';
import { validateRequest } from '../../shared/middlewares/validation.middleware';
import { createCategorySchema, updateCategorySchema } from './categories.schema';
import { authenticateJWT, requireRole, optionalAuthenticateJWT } from '../../shared/middlewares/auth.middleware';

const router = Router();

// Public Routes
router.get('/', optionalAuthenticateJWT, categoriesController.getAll);

router.get('/:slug', categoriesController.getBySlug);

// Admin Routes
router.post(
  '/admin',
  authenticateJWT,
  requireRole('ADMIN'),
  validateRequest(createCategorySchema),
  categoriesController.create
);

router.patch(
  '/admin/:id',
  authenticateJWT,
  requireRole('ADMIN'),
  validateRequest(updateCategorySchema),
  categoriesController.update
);

router.delete(
  '/admin/:id',
  authenticateJWT,
  requireRole('ADMIN'),
  categoriesController.delete
);

export default router;
