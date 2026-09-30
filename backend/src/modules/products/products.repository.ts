import prisma from '../../shared/database/prisma';
import { Product, Prisma } from '@prisma/client';

export interface ProductFilters {
  page: number;
  limit: number;
  search?: string;
  categorySlug?: string;
  collectionSlug?: string;
  festivalSlug?: string;
  sort?: string;
  isFeatured?: boolean;
  includeInactive?: boolean;
}

export class ProductsRepository {
  async findPaginated(filters: ProductFilters) {
    const { page, limit, search, categorySlug, collectionSlug, festivalSlug, sort, isFeatured, includeInactive } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      deletedAt: null,
      ...(includeInactive ? {} : { isActive: true }),
      ...(isFeatured !== undefined ? { isFeatured } : {}),
    };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { sku: { contains: search } },
      ];
    }

    if (categorySlug) {
      where.categories = {
        some: {
          category: { slug: categorySlug },
        },
      };
    }

    if (collectionSlug) {
      where.collections = {
        some: {
          collection: { slug: collectionSlug },
        },
      };
    }

    if (festivalSlug) {
      where.festivals = {
        some: {
          festival: { slug: festivalSlug },
        },
      };
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { displayOrder: 'asc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };
    if (sort === 'newest') orderBy = { createdAt: 'desc' };

    const [items, totalItems] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          images: { orderBy: { displayOrder: 'asc' } },
          categories: { include: { category: true } },
          collections: { include: { collection: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return { items, totalItems };
  }

  async findBySlug(slug: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { displayOrder: 'asc' } },
        categories: { include: { category: true } },
        collections: { include: { collection: true } },
        festivals: { include: { festival: true } },
      },
    });
  }

  async findById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { displayOrder: 'asc' } },
        categories: { include: { category: true } },
      },
    });
  }

  async findBySku(sku: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { sku },
    });
  }

  async create(data: {
    name: string;
    slug: string;
    sku: string;
    description: string;
    shortDescription?: string;
    price: number;
    mrp: number;
    stockQuantity: number;
    couponCode?: string | null;
    isFeatured?: boolean;
    isActive?: boolean;
    displayOrder?: number;
    categoryIds?: string[];
    images?: Array<{ url: string; storageKey?: string; altText?: string; isPrimary?: boolean; displayOrder?: number }>;
  }) {
    const { categoryIds = [], images = [], ...productData } = data;
    const cleanCategoryIds = categoryIds.filter(
      (cid: string) => Boolean(cid) && typeof cid === 'string' && cid.trim() !== ''
    );

    let resolvedCategoryIds: string[] = [];
    if (cleanCategoryIds.length > 0) {
      const validCategories = await prisma.category.findMany({
        where: {
          OR: [
            { id: { in: cleanCategoryIds } },
            { slug: { in: cleanCategoryIds } },
            { name: { in: cleanCategoryIds } },
          ],
        },
        select: { id: true },
      });
      resolvedCategoryIds = validCategories.map((c) => c.id);
    }

    return prisma.product.create({
      data: {
        ...productData,
        categories: {
          create: resolvedCategoryIds.map((categoryId) => ({ categoryId })),
        },
        images: {
          create: images.map((img, index) => ({
            url: img.url,
            storageKey: img.storageKey || 'admin/product.jpg',
            altText: img.altText || data.name,
            isPrimary: img.isPrimary || index === 0,
            displayOrder: img.displayOrder || index,
          })),
        },
      },
      include: {
        images: true,
        categories: { include: { category: true } },
      },
    });
  }

  async update(id: string, data: any) {
    const { categoryIds, images, ...updateData } = data;

    return prisma.$transaction(
      async (tx: any) => {
        if (Array.isArray(categoryIds)) {
          const cleanCategoryIds = categoryIds.filter(
            (cid: string) => Boolean(cid) && typeof cid === 'string' && cid.trim() !== ''
          );

          await tx.productCategory.deleteMany({ where: { productId: id } });

          if (cleanCategoryIds.length > 0) {
            const validCategories = await tx.category.findMany({
              where: {
                OR: [
                  { id: { in: cleanCategoryIds } },
                  { slug: { in: cleanCategoryIds } },
                  { name: { in: cleanCategoryIds } },
                ],
              },
              select: { id: true },
            });

            if (validCategories.length > 0) {
              await tx.productCategory.createMany({
                data: validCategories.map((c: { id: string }) => ({
                  productId: id,
                  categoryId: c.id,
                })),
              });
            }
          }
        }

        if (Array.isArray(images) && images.length > 0) {
          await tx.productImage.deleteMany({ where: { productId: id } });
          await tx.productImage.createMany({
            data: images.map((img: any, index: number) => ({
              productId: id,
              url: img.url,
              storageKey: img.storageKey || 'admin/product.jpg',
              altText: img.altText || updateData.name || '',
              isPrimary: img.isPrimary || index === 0,
              displayOrder: img.displayOrder || index,
            })),
          });
        }

        return tx.product.update({
          where: { id },
          data: updateData,
          include: {
            images: true,
            categories: { include: { category: true } },
          },
        });
      },
      {
        maxWait: 15000,
        timeout: 30000,
      }
    );
  }


  async addImage(productId: string, imageData: { url: string; storageKey: string; altText?: string; isPrimary?: boolean; displayOrder?: number }) {
    if (imageData.isPrimary) {
      await prisma.productImage.updateMany({
        where: { productId },
        data: { isPrimary: false },
      });
    }

    return prisma.productImage.create({
      data: {
        productId,
        url: imageData.url,
        storageKey: imageData.storageKey,
        altText: imageData.altText,
        isPrimary: imageData.isPrimary || false,
        displayOrder: imageData.displayOrder || 0,
      },
    });
  }

  async removeImage(imageId: string) {
    return prisma.productImage.delete({
      where: { id: imageId },
    });
  }

  async delete(id: string) {
    return prisma.$transaction(
      async (tx: any) => {
        await tx.productCategory.deleteMany({ where: { productId: id } });
        await tx.collectionProduct.deleteMany({ where: { productId: id } });
        await tx.festivalProduct.deleteMany({ where: { productId: id } });
        await tx.productImage.deleteMany({ where: { productId: id } });
        await tx.wishlistItem.deleteMany({ where: { productId: id } });
        try {
          await tx.orderItem.updateMany({ where: { productId: id }, data: { productId: null } });
        } catch {}
        return tx.product.delete({
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

export const productsRepository = new ProductsRepository();
