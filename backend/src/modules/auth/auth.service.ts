import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authRepository, AuthRepository } from './auth.repository';
import { ConflictError, UnauthorizedError, NotFoundError, BadRequestError } from '../../shared/errors/custom.error';
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

  async updateProfile(
    userId: string,
    data: {
      fullName?: string;
      email?: string;
      phone?: string;
      currentPassword?: string;
      newPassword?: string;
    }
  ) {
    const user = await this.repo.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found.');
    }

    const updatePayload: Partial<{
      fullName: string;
      email: string;
      phone: string | null;
      passwordHash: string;
    }> = {};

    if (data.fullName !== undefined) {
      const trimmedName = data.fullName.trim();
      if (!trimmedName) {
        throw new BadRequestError('Full name cannot be empty.');
      }
      updatePayload.fullName = trimmedName;
    }

    if (data.email !== undefined) {
      const trimmedEmail = data.email.toLowerCase().trim();
      if (!trimmedEmail) {
        throw new BadRequestError('Email address cannot be empty.');
      }
      if (trimmedEmail !== user.email) {
        const existing = await this.repo.findByEmail(trimmedEmail);
        if (existing && existing.id !== userId) {
          throw new ConflictError('A user with this email already exists.');
        }
        updatePayload.email = trimmedEmail;
      }
    }

    if (data.phone !== undefined) {
      updatePayload.phone = data.phone ? data.phone.trim() : null;
    }

    if (data.newPassword) {
      if (!data.currentPassword) {
        throw new BadRequestError('Current password is required to set a new password.');
      }
      const isMatch = await bcrypt.compare(data.currentPassword, user.passwordHash);
      if (!isMatch) {
        throw new BadRequestError('Current password is incorrect.');
      }
      if (data.newPassword.length < 6) {
        throw new BadRequestError('New password must be at least 6 characters long.');
      }
      const salt = await bcrypt.genSalt(12);
      updatePayload.passwordHash = await bcrypt.hash(data.newPassword, salt);
    }

    const updatedUser = await this.repo.updateUser(userId, updatePayload);

    const token = this.generateToken({
      userId: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role as any,
    });

    return {
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        phone: updatedUser.phone,
        role: updatedUser.role,
        createdAt: updatedUser.createdAt,
      },
      token,
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
