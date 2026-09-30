import { productsRepository, ProductsRepository, ProductFilters } from './products.repository';
import { generateSlug } from '../../shared/utils/slug.util';
import { NotFoundError, ConflictError } from '../../shared/errors/custom.error';
import { syncProductToMeilisearch, removeProductFromMeilisearch } from '../../shared/meilisearch';

export class ProductsService {
  constructor(private repo: ProductsRepository = productsRepository) {}

  async getProducts(filters: {
    page?: string;
    limit?: string;
    search?: string;
    category?: string;
    collection?: string;
    festival?: string;
    sort?: string;
    isFeatured?: string;
    includeInactive?: boolean;
  }) {
    const page = Math.max(1, parseInt(filters.page || '1', 10));
    const limit = Math.min(500, Math.max(1, parseInt(filters.limit || '12', 10)));

    const parsedFilters: ProductFilters = {
      page,
      limit,
      search: filters.search,
      categorySlug: filters.category,
      collectionSlug: filters.collection,
      festivalSlug: filters.festival,
      sort: filters.sort,
      isFeatured: filters.isFeatured === 'true' ? true : filters.isFeatured === 'false' ? false : undefined,
      includeInactive: filters.includeInactive || false,
    };

    const { items, totalItems } = await this.repo.findPaginated(parsedFilters);
    const totalPages = Math.ceil(totalItems / limit);

    return {
      items,
      meta: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async getProductBySlug(slug: string) {
    const product = await this.repo.findBySlug(slug);
    if (!product || product.deletedAt) {
      throw new NotFoundError('Product not found');
    }
    return product;
  }

  async createProduct(data: {
    name: string;
    sku: string;
    description?: string;
    shortDescription?: string;
    price: number;
    mrp: number;
    stockQuantity: number;
    couponCode?: string | null;
    categoryIds?: string[];
    isFeatured?: boolean;
    displayOrder?: number;
    images?: Array<{ url: string; storageKey: string; altText?: string; isPrimary?: boolean; displayOrder?: number }>;
  }) {
    const slug = generateSlug(data.name);

    // Auto-generate description from name if not provided
    const description = data.description && data.description.trim().length > 0
      ? data.description
      : data.name;

    // Auto-generate SKU if not provided or too short
    const sku = data.sku && data.sku.trim().length > 0
      ? data.sku.trim()
      : `HM-${Date.now().toString().slice(-8)}`;

    const existingSlug = await this.repo.findBySlug(slug);
    if (existingSlug && !existingSlug.deletedAt) {
      throw new ConflictError(`Product with slug '${slug}' already exists.`);
    }

    const existingSku = await this.repo.findBySku(sku);
    if (existingSku) {
      throw new ConflictError(`Product with SKU '${sku}' already exists.`);
    }

    const created = await this.repo.create({
      ...data,
      description,
      sku,
      slug,
    });
    // Sync to Meilisearch index in background without blocking DB response
    syncProductToMeilisearch(created);
    return created;
  }

  async updateProduct(id: string, data: any) {
    const product = await this.repo.findById(id);
    if (!product || product.deletedAt) {
      throw new NotFoundError('Product not found');
    }

    let slug = product.slug;
    if (data.name && data.name !== product.name) {
      slug = generateSlug(data.name);
    }

    const updated = await this.repo.update(id, {
      ...data,
      slug,
    });
    syncProductToMeilisearch(updated);
    return updated;
  }

  async addProductImage(productId: string, imageData: { url: string; storageKey: string; altText?: string; isPrimary?: boolean; displayOrder?: number }) {
    const product = await this.repo.findById(productId);
    if (!product || product.deletedAt) {
      throw new NotFoundError('Product not found');
    }
    const res = await this.repo.addImage(productId, imageData);
    const refreshed = await this.repo.findById(productId);
    if (refreshed) syncProductToMeilisearch(refreshed);
    return res;
  }

  async removeProductImage(imageId: string) {
    return this.repo.removeImage(imageId);
  }

  async deleteProduct(id: string) {
    const product = await this.repo.findById(id);
    if (!product || product.deletedAt) {
      throw new NotFoundError('Product not found');
    }
    const res = await this.repo.softDelete(id);
    removeProductFromMeilisearch(id);
    return res;
  }
}

export const productsService = new ProductsService();
