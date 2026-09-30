"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ordersRepository = exports.OrdersRepository = void 0;
const prisma_1 = __importDefault(require("../../shared/database/prisma"));
class OrdersRepository {
    async findPaginated(page = 1, limit = 10, userId, email) {
        const skip = (page - 1) * limit;
        let where = {};
        if (userId && email) {
            where = {
                OR: [
                    { userId },
                    { customerEmail: { equals: email, mode: 'insensitive' } },
                ],
            };
        }
        else if (userId) {
            where = { userId };
        }
        else if (email) {
            where = { customerEmail: { equals: email, mode: 'insensitive' } };
        }
        const [items, totalItems] = await Promise.all([
            prisma_1.default.order.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    items: true,
                },
            }),
            prisma_1.default.order.count({ where }),
        ]);
        return { items, totalItems };
    }
    async findById(id) {
        return prisma_1.default.order.findUnique({
            where: { id },
            include: {
                items: true,
            },
        });
    }
    async findByOrderNumber(orderNumber) {
        return prisma_1.default.order.findUnique({
            where: { orderNumber },
            include: { items: true },
        });
    }
    async updateStatus(id, status, paymentStatus) {
        return prisma_1.default.order.update({
            where: { id },
            data: {
                status,
                ...(paymentStatus ? { paymentStatus } : {}),
            },
            include: { items: true },
        });
    }
}
exports.OrdersRepository = OrdersRepository;
exports.ordersRepository = new OrdersRepository();
