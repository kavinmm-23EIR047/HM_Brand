import { Request, Response, NextFunction } from 'express';
import { authService, AuthService } from './auth.service';
import { sendSuccess } from '../../shared/utils/response.util';

export class AuthController {
  constructor(private service: AuthService = authService) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.register(req.body);
      return sendSuccess(res, result, 'Registration successful', 201);
    } catch (error) {
      return next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.login(req.body);
      return sendSuccess(res, result, 'Login successful', 200);
    } catch (error) {
      return next(error);
    }
  };

  me = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.service.getCurrentUser(req.user!.userId);
      return sendSuccess(res, user, 'Profile retrieved successfully');
    } catch (error) {
      return next(error);
    }
  };
}

export const authController = new AuthController();
