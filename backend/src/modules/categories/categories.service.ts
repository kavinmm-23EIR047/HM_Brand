import { categoriesRepository, CategoriesRepository } from './categories.repository';
import { generateSlug } from '../../shared/utils/slug.util';
import { NotFoundError, ConflictError } from '../../shared/errors/custom.error';

export class CategoriesService {
  constructor(private repo: CategoriesRepository = categoriesRepository) {}

  async getAllCategories(includeInactive: boolean = false) {
    return this.repo.findAll(includeInactive);
  }

  async getCategoryBySlug(slug: string) {
    const category = await this.repo.findBySlug(slug);
    if (!category || category.deletedAt) {
      throw new NotFoundError('Category not found');
    }
    return category;
  }

  async createCategory(data: {
    name: string;
    description?: string;
    imageUrl?: string;
    displayOrder?: number;
    isActive?: boolean;
  }) {
    const slug = generateSlug(data.name);
    const existing = await this.repo.findBySlug(slug);
    if (existing) {
      throw new ConflictError(`Category with slug '${slug}' already exists.`);
    }

    return this.repo.create({
      ...data,
      slug,
    });
  }

  async updateCategory(
    id: string,
    data: {
      name?: string;
      description?: string;
      imageUrl?: string;
      displayOrder?: number;
      isActive?: boolean;
    }
  ) {
    const category = await this.repo.findById(id);
    if (!category || category.deletedAt) {
      throw new NotFoundError('Category not found');
    }

    let slug = category.slug;
    if (data.name && data.name !== category.name) {
      slug = generateSlug(data.name);
    }

    return this.repo.update(id, {
      ...data,
      slug,
    });
  }

  async deleteCategory(id: string) {
    const category = await this.repo.findById(id);
    if (!category) {
      throw new NotFoundError('Category not found');
    }
    return this.repo.delete(id);
  }
}

export const categoriesService = new CategoriesService();
