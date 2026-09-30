import { Router } from 'express';
import { authController } from './auth.controller';
import { validateRequest } from '../../shared/middlewares/validation.middleware';
import { registerSchema, loginSchema } from './auth.schema';
import { authenticateJWT } from '../../shared/middlewares/auth.middleware';

const router = Router();

router.post('/register', validateRequest(registerSchema), authController.register);
router.post('/login', validateRequest(loginSchema), authController.login);
router.get('/me', authenticateJWT, authController.me);
router.patch('/profile', authenticateJWT, authController.updateProfile);
router.put('/profile', authenticateJWT, authController.updateProfile);

export default router;
