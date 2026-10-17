import prisma from '../../shared/database/prisma';
import { Category } from '@prisma/client';

export class CategoriesRepository {
  async findAll(includeInactive: boolean = false, parentId?: string | null): Promise<Category[]> {
    const where: any = {
      deletedAt: null,
      ...(includeInactive ? {} : { isActive: true }),
    };

    if (parentId !== undefined) {
      where.parentId = parentId;
    }

    return prisma.category.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
      include: {
        children: {
          where: {
            deletedAt: null,
            ...(includeInactive ? {} : { isActive: true }),
          },
          orderBy: { displayOrder: 'asc' },
        },
        parent: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { slug },
      include: {
        children: {
          where: { deletedAt: null, isActive: true },
          orderBy: { displayOrder: 'asc' },
        },
        parent: {
          select: { id: true, name: true, slug: true },
        },
        products: {
          include: {
            product: {
              include: { images: true, subcategory: true },
            },
          },
        },
      },
    });
  }

  async findById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { id },
      include: {
        children: {
          where: { deletedAt: null },
          orderBy: { displayOrder: 'asc' },
        },
        parent: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
  }

  async create(data: {
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    displayOrder?: number;
    isActive?: boolean;
    parentId?: string | null;
  }): Promise<Category> {
    return prisma.category.create({
      data,
      include: {
        parent: { select: { id: true, name: true, slug: true } },
        children: true,
      },
    });
  }

  async update(id: string, data: Partial<Category>): Promise<Category> {
    return prisma.category.update({
      where: { id },
      data,
      include: {
        parent: { select: { id: true, name: true, slug: true } },
        children: true,
      },
    });
  }

  async delete(id: string): Promise<Category> {
    return prisma.$transaction(
      async (tx: any) => {
        await tx.productCategory.deleteMany({ where: { categoryId: id } });
        return tx.category.delete({
          where: { id },
        });
      },
      {
        maxWait: 15000,
        timeout: 30000,
      }
    );
  }
}

export const categoriesRepository = new CategoriesRepository();
