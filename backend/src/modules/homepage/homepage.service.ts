import prisma from '../../shared/database/prisma';
import { bannersRepository } from '../banners/banners.repository';
import { categoriesRepository } from '../categories/categories.repository';
import { productsRepository } from '../products/products.repository';

export class HomepageService {
  async getHomepagePayload() {
    // 1. Fetch active configured homepage sections
    const sections = await prisma.homepageSection.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });

    // Fallback if no sections configured yet
    if (sections.length === 0) {
      const heroBanners = await bannersRepository.findAll('HERO_MAIN');
      const categories = await categoriesRepository.findAll();
      const featuredProducts = await productsRepository.findPaginated({
        page: 1,
        limit: 8,
        isFeatured: true,
      });

      return {
        heroBanners,
        featuredCategories: categories,
        featuredProducts: featuredProducts.items,
      };
    }

    // 2. Build structured response payload by resolving references dynamically
    const renderedSections = await Promise.all(
      sections.map(async (section: any) => {
        let content: any = null;

        switch (section.sectionType) {
          case 'HERO_SLIDER':
            content = await bannersRepository.findAll('HERO_MAIN');
            break;
          case 'FEATURED_CATEGORIES':
            content = await categoriesRepository.findAll();
            break;
          case 'FEATURED_PRODUCTS':
            const featured = await productsRepository.findPaginated({ page: 1, limit: 8, isFeatured: true });
            content = featured.items;
            break;
          case 'BEST_SELLERS':
            const bestSellers = await productsRepository.findPaginated({ page: 1, limit: 8, sort: 'display_order' });
            content = bestSellers.items;
            break;
          case 'FESTIVAL_HIGHLIGHT':
            if (section.referenceId) {
              content = await prisma.festival.findUnique({
                where: { id: section.referenceId },
                include: {
                  products: {
                    include: { product: { include: { images: true } } },
                  },
                },
              });
            }
            break;
          case 'COLLECTION_GRID':
            if (section.referenceId) {
              content = await prisma.collection.findUnique({
                where: { id: section.referenceId },
                include: {
                  products: {
                    include: { product: { include: { images: true } } },
                  },
                },
              });
            }
            break;
          case 'PROMO_STRIP':
            content = await bannersRepository.findAll('PROMO_STRIP');
            break;
          default:
            content = null;
        }

        return {
          id: section.id,
          type: section.sectionType,
          title: section.title,
          subtitle: section.subtitle,
          displayOrder: section.displayOrder,
          data: content,
        };
      })
    );

    return renderedSections;
  }

  async updateHomepageSections(sectionsData: Array<{
    id?: string;
    sectionType: any;
    title?: string;
    subtitle?: string;
    referenceId?: string;
    displayOrder: number;
    isActive: boolean;
  }>) {
    return prisma.$transaction(async (tx: any) => {
      await tx.homepageSection.deleteMany({});
      const created = await Promise.all(
        sectionsData.map((sec) =>
          tx.homepageSection.create({
            data: {
              sectionType: sec.sectionType,
              title: sec.title,
              subtitle: sec.subtitle,
              referenceId: sec.referenceId,
              displayOrder: sec.displayOrder,
              isActive: sec.isActive,
            },
          })
        )
      );
      return created;
    });
  }
}

export const homepageService = new HomepageService();
