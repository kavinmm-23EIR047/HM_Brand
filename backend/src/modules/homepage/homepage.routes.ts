import { Router } from 'express';
import { homepageController } from './homepage.controller';
import { authenticateJWT, requireRole } from '../../shared/middlewares/auth.middleware';

const router = Router();

// Public Route
router.get('/', homepageController.getHomepage);

// Admin Route
router.put('/admin/sections', authenticateJWT, requireRole('ADMIN'), homepageController.updateSections);

export default router;
