import { collectionsRepository, CollectionsRepository } from './collections.repository';
import { generateSlug } from '../../shared/utils/slug.util';
import { NotFoundError, ConflictError } from '../../shared/errors/custom.error';

export class CollectionsService {
  constructor(private repo: CollectionsRepository = collectionsRepository) {}

  async getAllCollections(includeInactive: boolean = false) {
    return this.repo.findAll(includeInactive);
  }

  async getCollectionBySlug(slug: string) {
    const col = await this.repo.findBySlug(slug);
    if (!col) {
      throw new NotFoundError('Collection not found');
    }
    return col;
  }

  async createCollection(data: {
    title: string;
    description?: string;
    bannerUrl?: string;
    displayOrder?: number;
    isActive?: boolean;
    productIds?: string[];
  }) {
    const slug = generateSlug(data.title);
    const existing = await this.repo.findBySlug(slug);
    if (existing) {
      throw new ConflictError(`Collection with slug '${slug}' already exists.`);
    }
    return this.repo.create({
      ...data,
      slug,
    });
  }

  async updateCollection(id: string, data: any) {
    const col = await this.repo.findById(id);
    if (!col) {
      throw new NotFoundError('Collection not found');
    }
    let slug = col.slug;
    if (data.title && data.title !== col.title) {
      slug = generateSlug(data.title);
    }
    return this.repo.update(id, {
      ...data,
      slug,
    });
  }

  async deleteCollection(id: string) {
    const col = await this.repo.findById(id);
    if (!col) {
      throw new NotFoundError('Collection not found');
    }
    return this.repo.delete(id);
  }
}

export const collectionsService = new CollectionsService();
