import prisma from '../../shared/database/prisma';
import { Festival } from '@prisma/client';

export class FestivalsRepository {
  async findAll(includeInactive: boolean = false): Promise<Festival[]> {
    return prisma.festival.findMany({
      where: {
        ...(includeInactive ? {} : { isActive: true }),
      },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async findBySlug(slug: string) {
    return prisma.festival.findUnique({
      where: { slug },
      include: {
        products: {
          orderBy: { displayOrder: 'asc' },
          include: {
            product: {
              include: { images: true },
            },
          },
        },
      },
    });
  }

  async findById(id: string) {
    return prisma.festival.findUnique({
      where: { id },
    });
  }

  async create(data: {
    title: string;
    slug: string;
    description?: string;
    bannerUrl?: string;
    displayOrder?: number;
    isActive?: boolean;
    startDate?: Date;
    endDate?: Date;
    productIds?: string[];
  }) {
    const { productIds = [], ...festData } = data;
    return prisma.festival.create({
      data: {
        ...festData,
        products: {
          create: productIds.map((productId, index) => ({
            productId,
            displayOrder: index,
          })),
        },
      },
      include: {
        products: { include: { product: true } },
      },
    });
  }

  async update(id: string, data: {
    title?: string;
    slug?: string;
    description?: string;
    bannerUrl?: string;
    displayOrder?: number;
    isActive?: boolean;
    startDate?: Date;
    endDate?: Date;
    productIds?: string[];
  }) {
    const { productIds, ...updateData } = data;
    return prisma.$transaction(async (tx) => {
      if (productIds) {
        await tx.festivalProduct.deleteMany({ where: { festivalId: id } });
        await tx.festivalProduct.createMany({
          data: productIds.map((productId, index) => ({
            festivalId: id,
            productId,
            displayOrder: index,
          })),
        });
      }
      return tx.festival.update({
        where: { id },
        data: updateData,
        include: {
          products: { include: { product: true } },
        },
      });
    });
  }

  async delete(id: string) {
    return prisma.festival.delete({
      where: { id },
    });
  }
}

export const festivalsRepository = new FestivalsRepository();
