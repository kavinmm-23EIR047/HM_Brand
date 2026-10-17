import { categoriesRepository, CategoriesRepository } from './categories.repository';
import { generateSlug } from '../../shared/utils/slug.util';
import { NotFoundError, ConflictError } from '../../shared/errors/custom.error';

export class CategoriesService {
  constructor(private repo: CategoriesRepository = categoriesRepository) {}

  async getAllCategories(includeInactive: boolean = false, parentId?: string | null) {
    return this.repo.findAll(includeInactive, parentId);
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
    parentId?: string | null;
  }) {
    const slug = generateSlug(data.name);
    const existing = await this.repo.findBySlug(slug);
    if (existing) {
      throw new ConflictError(`Category with slug '${slug}' already exists.`);
    }

    if (data.parentId) {
      const parent = await this.repo.findById(data.parentId);
      if (!parent) {
        throw new NotFoundError('Parent category not found');
      }
    }

    return this.repo.create({
      ...data,
      slug,
      parentId: data.parentId || null,
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
      parentId?: string | null;
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

    if (data.parentId && data.parentId !== id) {
      const parent = await this.repo.findById(data.parentId);
      if (!parent) {
        throw new NotFoundError('Parent category not found');
      }
    }

    return this.repo.update(id, {
      ...data,
      slug,
      parentId: data.parentId !== undefined ? (data.parentId || null) : undefined,
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
