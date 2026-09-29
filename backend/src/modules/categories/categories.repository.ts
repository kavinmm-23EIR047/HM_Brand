import prisma from '../../shared/database/prisma';
import { Category } from '@prisma/client';

export class CategoriesRepository {
  async findAll(includeInactive: boolean = false): Promise<Category[]> {
    return prisma.category.findMany({
      where: {
        deletedAt: null,
        ...(includeInactive ? {} : { isActive: true }),
      },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          include: {
            product: {
              include: { images: true },
            },
          },
        },
      },
    });
  }

  async findById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { id },
    });
  }

  async create(data: {
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    displayOrder?: number;
    isActive?: boolean;
  }): Promise<Category> {
    return prisma.category.create({
      data,
    });
  }

  async update(id: string, data: Partial<Category>): Promise<Category> {
    return prisma.category.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string): Promise<Category> {
    return prisma.category.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isActive: false,
      },
    });
  }
}

export const categoriesRepository = new CategoriesRepository();
