import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authRepository, AuthRepository } from './auth.repository';
import { ConflictError, UnauthorizedError, NotFoundError } from '../../shared/errors/custom.error';
import { AuthUser } from '../../shared/middlewares/auth.middleware';

export class AuthService {
  constructor(private repo: AuthRepository = authRepository) {}

  async register(data: { email: string; password: string; fullName: string; phone?: string }) {
    const existing = await this.repo.findByEmail(data.email);
    if (existing) {
      throw new ConflictError('A user with this email already exists.');
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const user = await this.repo.createUser({
      email: data.email,
      passwordHash,
      fullName: data.fullName,
      phone: data.phone,
    });

    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role as any,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
      },
      token,
    };
  }

  async login(data: { email: string; password: string }) {
    const user = await this.repo.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password.');
    }

    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role as any,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
      },
      token,
    };
  }

  async getCurrentUser(userId: string) {
    const user = await this.repo.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found.');
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  private generateToken(payload: AuthUser): string {
    const secret = process.env.JWT_SECRET || 'fallback_secret';
    return jwt.sign(payload, secret, {
      expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any,
    });
  }
}

export const authService = new AuthService();
