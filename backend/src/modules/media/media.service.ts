import prisma from '../../shared/database/prisma';
import { deleteImage, uploadImage } from '../../shared/cloudinary';
import { BadRequestError, NotFoundError } from '../../shared/errors/custom.error';
import { generateSlug } from '../../shared/utils/slug.util';

export const mediaTypes = ['PRODUCT', 'CATEGORY', 'BANNER', 'HOMEPAGE', 'COLLECTION', 'FESTIVAL', 'OTHER'] as const;
type MediaType = (typeof mediaTypes)[number];

function safeSlug(value: string, label: string): string {
  const slug = generateSlug(value);
  if (!slug) throw new BadRequestError(`${label} must contain letters or numbers.`);
  return slug.slice(0, 120);
}

function asType(value: unknown): MediaType {
  if (typeof value !== 'string' || !mediaTypes.includes(value as MediaType)) {
    throw new BadRequestError('Unsupported image type.');
  }
  return value as MediaType;
}

export class MediaService {
  async upload(file: Express.Multer.File, data: Record<string, unknown>) {
    const type = asType(data.type);
    const entityId = typeof data.entityId === 'string' ? data.entityId : undefined;
    const imageId = typeof data.imageId === 'string' ? data.imageId : undefined;
    let folder: string;
    let filename: string;
    let applyUpload: (url: string, id: string) => Promise<unknown> = async () => undefined;

    if (type === 'PRODUCT') {
      if (!entityId) throw new BadRequestError('A product ID is required for product images.');
      const product = await prisma.product.findUnique({
        where: { id: entityId },
        include: { categories: { include: { category: true } }, images: { orderBy: { displayOrder: 'asc' } } },
      });
      if (!product || product.deletedAt) throw new NotFoundError('Product not found.');
      const categorySlug = product.categories[0]?.category.slug || 'uncategorized';
      const requestedImage = imageId ? product.images.find((image) => image.id === imageId) : undefined;
      if (imageId && !requestedImage) throw new NotFoundError('Product image not found.');
      const primary = requestedImage?.isPrimary ?? (data.isPrimary === 'true' || product.images.length === 0);
      const productSlug = safeSlug(product.slug, 'Product slug');
      folder = `hm_brand/products/${safeSlug(categorySlug, 'Category slug')}/${productSlug}`;
      const existingFilename = requestedImage?.storageKey?.split('/').pop();
      let suffix = 1;
      while (
        product.images.some((image) => image.id !== requestedImage?.id && image.storageKey.endsWith(`/${productSlug}-${suffix}`))
      ) suffix += 1;
      filename = primary
        ? productSlug
        : existingFilename && new RegExp(`^${productSlug}-\\d+$`).test(existingFilename)
          ? existingFilename
          : `${productSlug}-${suffix}`;
      const position = requestedImage?.displayOrder ?? Math.max(-1, ...product.images.map((image) => image.displayOrder)) + 1;
      applyUpload = async (url, id) => {
        if (requestedImage) {
          if (requestedImage.storageKey && requestedImage.storageKey !== id) {
            await deleteImage(requestedImage.storageKey).catch(() => undefined);
          } else if (requestedImage.url) {
            await this.deleteStoredImage(requestedImage.url).catch(() => undefined);
          }
          if (primary) await prisma.productImage.updateMany({ where: { productId: product.id }, data: { isPrimary: false } });
          return prisma.productImage.update({ where: { id: requestedImage.id }, data: { url, storageKey: id, isPrimary: primary } });
        }
        if (primary) await prisma.productImage.updateMany({ where: { productId: product.id }, data: { isPrimary: false } });
        return prisma.productImage.create({ data: { productId: product.id, url, storageKey: id, altText: product.name, isPrimary: primary, displayOrder: position } });
      };
    } else if (type === 'CATEGORY') {
      if (!entityId) throw new BadRequestError('A category ID is required.');
      const category = await prisma.category.findUnique({ where: { id: entityId } });
      if (!category || category.deletedAt) throw new NotFoundError('Category not found.');
      const slug = safeSlug(category.slug, 'Category slug');
      folder = `hm_brand/categories/${slug}`;
      filename = slug;
      applyUpload = async (url) => {
        if (category.imageUrl) {
          await this.deleteStoredImage(category.imageUrl).catch(() => undefined);
        }
        return prisma.category.update({ where: { id: category.id }, data: { imageUrl: url } });
      };
    } else if (type === 'BANNER') {
      if (!entityId) throw new BadRequestError('A banner ID is required.');
      const banner = await prisma.banner.findUnique({ where: { id: entityId } });
      if (!banner) throw new NotFoundError('Banner not found.');
      folder = 'hm_brand/banners';
      filename = safeSlug(banner.title, 'Banner title');
      applyUpload = async (url) => {
        if (banner.desktopImage) {
          await this.deleteStoredImage(banner.desktopImage).catch(() => undefined);
        }
        return prisma.banner.update({ where: { id: banner.id }, data: { desktopImage: url } });
      };
    } else if (type === 'COLLECTION' || type === 'FESTIVAL') {
      if (!entityId) throw new BadRequestError(`A ${type.toLowerCase()} ID is required.`);
      const record = type === 'COLLECTION'
        ? await prisma.collection.findUnique({ where: { id: entityId } })
        : await prisma.festival.findUnique({ where: { id: entityId } });
      if (!record) throw new NotFoundError(`${type === 'COLLECTION' ? 'Collection' : 'Festival'} not found.`);
      const slug = safeSlug(record.slug, `${type} slug`);
      folder = `hm_brand/${type === 'COLLECTION' ? 'collections' : 'festivals'}/${slug}`;
      filename = slug;
      applyUpload = async (url) => {
        if (record.bannerUrl) {
          await this.deleteStoredImage(record.bannerUrl).catch(() => undefined);
        }
        return type === 'COLLECTION'
          ? prisma.collection.update({ where: { id: record.id }, data: { bannerUrl: url } })
          : prisma.festival.update({ where: { id: record.id }, data: { bannerUrl: url } });
      };
    } else if (type === 'HOMEPAGE') {
      const section = safeSlug(String(data.sectionSlug || ''), 'Section slug');
      const image = safeSlug(String(data.imageSlug || ''), 'Image slug');
      folder = `hm_brand/homepage/${section}`;
      filename = image;
    } else {
      folder = 'hm_brand/other';
      filename = safeSlug(String(data.imageSlug || ''), 'Image slug');
    }

    const uploaded = await uploadImage(file.buffer, { folder, publicId: filename });
    try {
      const record = await applyUpload(uploaded.secureUrl, uploaded.publicId);
      return { ...uploaded, record };
    } catch (error) {
      await deleteImage(uploaded.publicId).catch(() => undefined);
      throw error;
    }
  }

  async deleteProductImage(imageId: string, productId?: string) {
    const image = await prisma.productImage.findUnique({ where: { id: imageId } });
    if (!image) throw new NotFoundError('Product image not found.');
    if (productId && image.productId !== productId) throw new BadRequestError('Product image does not belong to this product.');
    await deleteImage(image.storageKey);
    await prisma.productImage.delete({ where: { id: image.id } });
  }

  async delete(typeValue: unknown, entityId: string, data: Record<string, unknown>) {
    const type = asType(typeValue);
    if (type === 'PRODUCT') {
      const imageId = typeof data.imageId === 'string' ? data.imageId : '';
      if (!imageId) throw new BadRequestError('A product image ID is required.');
      return this.deleteProductImage(imageId, entityId);
    }

    if (type === 'CATEGORY') {
      const category = await prisma.category.findUnique({ where: { id: entityId } });
      if (!category || category.deletedAt) throw new NotFoundError('Category not found.');
      await this.deleteStoredImage(category.imageUrl);
      await prisma.category.update({ where: { id: category.id }, data: { imageUrl: null } });
      return;
    }

    if (type === 'BANNER') {
      const banner = await prisma.banner.findUnique({ where: { id: entityId } });
      if (!banner) throw new NotFoundError('Banner not found.');
      await this.deleteStoredImage(banner.desktopImage);
      // Banner.desktopImage is required by the current schema; an empty value activates its existing frontend fallback.
      await prisma.banner.update({ where: { id: banner.id }, data: { desktopImage: '' } });
      return;
    }

    if (type === 'COLLECTION' || type === 'FESTIVAL') {
      const record = type === 'COLLECTION'
        ? await prisma.collection.findUnique({ where: { id: entityId } })
        : await prisma.festival.findUnique({ where: { id: entityId } });
      if (!record) throw new NotFoundError(`${type === 'COLLECTION' ? 'Collection' : 'Festival'} not found.`);
      await this.deleteStoredImage(record.bannerUrl);
      if (type === 'COLLECTION') {
        await prisma.collection.update({ where: { id: record.id }, data: { bannerUrl: null } });
      } else {
        await prisma.festival.update({ where: { id: record.id }, data: { bannerUrl: null } });
      }
      return;
    }

    const folder = type === 'HOMEPAGE'
      ? `hm_brand/homepage/${safeSlug(String(data.sectionSlug || ''), 'Section slug')}`
      : 'hm_brand/other';
    const filename = safeSlug(String(data.imageSlug || ''), 'Image slug');
    await deleteImage(`${folder}/${filename}`);
  }

  private async deleteStoredImage(url: string | null | undefined) {
    if (!url) return;
    const match = decodeURIComponent(url).match(/(?:^|\/)hm_brand\/[^?]+/);
    if (!match) return; // A legacy/external URL was not uploaded by this application.
    const publicId = match[0].replace(/^\//, '').replace(/\.[a-z0-9]+(?:\?.*)?$/i, '');
    await deleteImage(publicId);
  }
}

export const mediaService = new MediaService();
