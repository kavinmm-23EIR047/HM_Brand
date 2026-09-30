import prisma from '../../shared/database/prisma';
import { Collection } from '@prisma/client';

export class CollectionsRepository {
  async findAll(includeInactive: boolean = false): Promise<Collection[]> {
    return prisma.collection.findMany({
      where: {
        ...(includeInactive ? {} : { isActive: true }),
      },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async findBySlug(slug: string) {
    return prisma.collection.findUnique({
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
    return prisma.collection.findUnique({
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
    productIds?: string[];
  }) {
    const { productIds = [], ...colData } = data;
    return prisma.collection.create({
      data: {
        ...colData,
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
    productIds?: string[];
  }) {
    const { productIds, ...updateData } = data;
    return prisma.$transaction(async (tx: any) => {
      if (productIds) {
        await tx.collectionProduct.deleteMany({ where: { collectionId: id } });
        await tx.collectionProduct.createMany({
          data: productIds.map((productId, index) => ({
            collectionId: id,
            productId,
            displayOrder: index,
          })),
        });
      }
      return tx.collection.update({
        where: { id },
        data: updateData,
        include: {
          products: { include: { product: true } },
        },
      });
    });
  }

  async delete(id: string) {
    return prisma.collection.delete({
      where: { id },
    });
  }
}

export const collectionsRepository = new CollectionsRepository();
