import { festivalsRepository, FestivalsRepository } from './festivals.repository';
import { generateSlug } from '../../shared/utils/slug.util';
import { NotFoundError, ConflictError } from '../../shared/errors/custom.error';

export class FestivalsService {
  constructor(private repo: FestivalsRepository = festivalsRepository) {}

  async getAllFestivals(includeInactive: boolean = false) {
    return this.repo.findAll(includeInactive);
  }

  async getFestivalBySlug(slug: string) {
    const fest = await this.repo.findBySlug(slug);
    if (!fest) {
      throw new NotFoundError('Festival campaign not found');
    }
    return fest;
  }

  async createFestival(data: {
    title: string;
    description?: string;
    bannerUrl?: string;
    displayOrder?: number;
    isActive?: boolean;
    startDate?: Date;
    endDate?: Date;
    productIds?: string[];
  }) {
    const slug = generateSlug(data.title);
    const existing = await this.repo.findBySlug(slug);
    if (existing) {
      throw new ConflictError(`Festival campaign with slug '${slug}' already exists.`);
    }
    return this.repo.create({
      ...data,
      slug,
    });
  }

  async updateFestival(id: string, data: any) {
    const fest = await this.repo.findById(id);
    if (!fest) {
      throw new NotFoundError('Festival campaign not found');
    }
    let slug = fest.slug;
    if (data.title && data.title !== fest.title) {
      slug = generateSlug(data.title);
    }
    return this.repo.update(id, {
      ...data,
      slug,
    });
  }

  async deleteFestival(id: string) {
    const fest = await this.repo.findById(id);
    if (!fest) {
      throw new NotFoundError('Festival campaign not found');
    }
    return this.repo.delete(id);
  }
}

export const festivalsService = new FestivalsService();
