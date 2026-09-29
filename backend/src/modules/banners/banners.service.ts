import { bannersRepository, BannersRepository } from './banners.repository';
import { BannerPosition } from '../../shared/types';
import { NotFoundError } from '../../shared/errors/custom.error';

export class BannersService {
  constructor(private repo: BannersRepository = bannersRepository) {}

  async getBanners(position?: BannerPosition, includeInactive: boolean = false) {
    return this.repo.findAll(position, includeInactive);
  }

  async createBanner(data: {
    title: string;
    subtitle?: string;
    position?: BannerPosition;
    desktopImage: string;
    mobileImage?: string;
    ctaText?: string;
    ctaLink?: string;
    displayOrder?: number;
    isActive?: boolean;
    startDate?: Date;
    endDate?: Date;
  }) {
    return this.repo.create(data);
  }

  async updateBanner(id: string, data: any) {
    const banner = await this.repo.findById(id);
    if (!banner) {
      throw new NotFoundError('Banner not found');
    }
    return this.repo.update(id, data);
  }

  async deleteBanner(id: string) {
    const banner = await this.repo.findById(id);
    if (!banner) {
      throw new NotFoundError('Banner not found');
    }
    return this.repo.delete(id);
  }
}

export const bannersService = new BannersService();
