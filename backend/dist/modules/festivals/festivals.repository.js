"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.festivalsRepository = exports.FestivalsRepository = void 0;
const prisma_1 = __importDefault(require("../../shared/database/prisma"));
class FestivalsRepository {
    async findAll(includeInactive = false) {
        return prisma_1.default.festival.findMany({
            where: {
                ...(includeInactive ? {} : { isActive: true }),
            },
            orderBy: { displayOrder: 'asc' },
        });
    }
    async findBySlug(slug) {
        return prisma_1.default.festival.findUnique({
            where: { slug },
            include: {
                products: {
                    orderBy: { displayOrder: 'asc' },
                    include: {
                        product: {
                            include: { images: true },
                        },
                    },
                },
            },
        });
    }
    async findById(id) {
        return prisma_1.default.festival.findUnique({
            where: { id },
        });
    }
    async create(data) {
        const { productIds = [], ...festData } = data;
        return prisma_1.default.festival.create({
            data: {
                ...festData,
                products: {
                    create: productIds.map((productId, index) => ({
                        productId,
                        displayOrder: index,
                    })),
                },
            },
            include: {
                products: { include: { product: true } },
            },
        });
    }
    async update(id, data) {
        const { productIds, ...updateData } = data;
        return prisma_1.default.$transaction(async (tx) => {
            if (productIds) {
                await tx.festivalProduct.deleteMany({ where: { festivalId: id } });
                await tx.festivalProduct.createMany({
                    data: productIds.map((productId, index) => ({
                        festivalId: id,
                        productId,
                        displayOrder: index,
                    })),
                });
            }
            return tx.festival.update({
                where: { id },
                data: updateData,
                include: {
                    products: { include: { product: true } },
                },
            });
        });
    }
    async delete(id) {
        return prisma_1.default.festival.delete({
            where: { id },
        });
    }
}
exports.FestivalsRepository = FestivalsRepository;
exports.festivalsRepository = new FestivalsRepository();
