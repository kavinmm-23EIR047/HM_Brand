"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.homepageService = exports.HomepageService = void 0;
const prisma_1 = __importDefault(require("../../shared/database/prisma"));
const banners_repository_1 = require("../banners/banners.repository");
const categories_repository_1 = require("../categories/categories.repository");
const products_repository_1 = require("../products/products.repository");
class HomepageService {
    async getHomepagePayload() {
        // 1. Fetch active configured homepage sections
        const sections = await prisma_1.default.homepageSection.findMany({
            where: { isActive: true },
            orderBy: { displayOrder: 'asc' },
        });
        // Fallback if no sections configured yet
        if (sections.length === 0) {
            const heroBanners = await banners_repository_1.bannersRepository.findAll('HERO_MAIN');
            const categories = await categories_repository_1.categoriesRepository.findAll();
            const featuredProducts = await products_repository_1.productsRepository.findPaginated({
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
        const renderedSections = await Promise.all(sections.map(async (section) => {
            let content = null;
            switch (section.sectionType) {
                case 'HERO_SLIDER':
                    content = await banners_repository_1.bannersRepository.findAll('HERO_MAIN');
                    break;
                case 'FEATURED_CATEGORIES':
                    content = await categories_repository_1.categoriesRepository.findAll();
                    break;
                case 'FEATURED_PRODUCTS':
                    const featured = await products_repository_1.productsRepository.findPaginated({ page: 1, limit: 8, isFeatured: true });
                    content = featured.items;
                    break;
                case 'BEST_SELLERS':
                    const bestSellers = await products_repository_1.productsRepository.findPaginated({ page: 1, limit: 8, sort: 'display_order' });
                    content = bestSellers.items;
                    break;
                case 'FESTIVAL_HIGHLIGHT':
                    if (section.referenceId) {
                        content = await prisma_1.default.festival.findUnique({
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
                        content = await prisma_1.default.collection.findUnique({
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
                    content = await banners_repository_1.bannersRepository.findAll('PROMO_STRIP');
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
        }));
        return renderedSections;
    }
    async updateHomepageSections(sectionsData) {
        return prisma_1.default.$transaction(async (tx) => {
            await tx.homepageSection.deleteMany({});
            const created = await Promise.all(sectionsData.map((sec) => tx.homepageSection.create({
                data: {
                    sectionType: sec.sectionType,
                    title: sec.title,
                    subtitle: sec.subtitle,
                    referenceId: sec.referenceId,
                    displayOrder: sec.displayOrder,
                    isActive: sec.isActive,
                },
            })));
            return created;
        });
    }
}
exports.HomepageService = HomepageService;
exports.homepageService = new HomepageService();
