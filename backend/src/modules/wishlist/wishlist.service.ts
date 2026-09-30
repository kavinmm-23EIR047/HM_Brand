import prisma from '../../shared/database/prisma';
import { NotFoundError } from '../../shared/errors/custom.error';

export class WishlistService {
  async getWishlist(userId: string) {
    return prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          include: { images: { orderBy: { displayOrder: 'asc' } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addToWishlist(userId: string, productIdOrSlug: string) {
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: productIdOrSlug }, { slug: productIdOrSlug }],
        deletedAt: null,
      },
    });
    if (!product || !product.isActive) {
      throw new NotFoundError('Product not found');
    }

    return prisma.wishlistItem.upsert({
      where: {
        userId_productId: { userId, productId: product.id },
      },
      create: { userId, productId: product.id },
      update: {},
      include: { product: true },
    });
  }

  async removeFromWishlist(userId: string, productIdOrSlug: string) {
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: productIdOrSlug }, { slug: productIdOrSlug }],
      },
    });
    const targetProductId = product ? product.id : productIdOrSlug;

    return prisma.wishlistItem.deleteMany({
      where: { userId, productId: targetProductId },
    });
  }

  async syncWishlist(userId: string, items: string[]) {
    if (Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        if (!item || typeof item !== 'string') continue;
        const product = await prisma.product.findFirst({
          where: {
            OR: [{ id: item }, { slug: item }],
            deletedAt: null,
          },
        });
        if (product && product.isActive) {
          await prisma.wishlistItem.upsert({
            where: {
              userId_productId: { userId, productId: product.id },
            },
            create: { userId, productId: product.id },
            update: {},
          });
        }
      }
    }
    return this.getWishlist(userId);
  }
}

export const wishlistService = new WishlistService();
