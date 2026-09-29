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

  async addToWishlist(userId: string, productId: string) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || !product.isActive || product.deletedAt) {
      throw new NotFoundError('Product not found');
    }

    return prisma.wishlistItem.upsert({
      where: {
        userId_productId: { userId, productId },
      },
      create: { userId, productId },
      update: {},
      include: { product: true },
    });
  }

  async removeFromWishlist(userId: string, productId: string) {
    return prisma.wishlistItem.deleteMany({
      where: { userId, productId },
    });
  }
}

export const wishlistService = new WishlistService();
