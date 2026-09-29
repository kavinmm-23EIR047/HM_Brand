import prisma from '../../shared/database/prisma';
import { User } from '@prisma/client';
import { UserRole } from '../../shared/types';

export class AuthRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async createUser(data: {
    email: string;
    passwordHash: string;
    fullName: string;
    phone?: string;
    role?: UserRole;
  }): Promise<User> {
    return prisma.user.create({
      data: {
        email: data.email.toLowerCase().trim(),
        passwordHash: data.passwordHash,
        fullName: data.fullName,
        phone: data.phone,
        role: data.role || 'CUSTOMER',
      },
    });
  }
}

export const authRepository = new AuthRepository();
