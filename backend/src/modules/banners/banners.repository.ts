import prisma from '../../shared/database/prisma';
import { Banner } from '@prisma/client';
import { BannerPosition } from '../../shared/types';

export class BannersRepository {
  async findAll(position?: BannerPosition, includeInactive: boolean = false): Promise<Banner[]> {
    return prisma.banner.findMany({
      where: {
        ...(position ? { position } : {}),
        ...(includeInactive ? {} : { isActive: true }),
      },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async findById(id: string): Promise<Banner | null> {
    return prisma.banner.findUnique({
      where: { id },
    });
  }

  async create(data: {
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
  }): Promise<Banner> {
    return prisma.banner.create({
      data,
    });
  }

  async update(id: string, data: Partial<Banner>): Promise<Banner> {
    return prisma.banner.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Banner> {
    return prisma.banner.delete({
      where: { id },
    });
  }
}

export const bannersRepository = new BannersRepository();
