"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminService = exports.AdminService = void 0;
const prisma_1 = __importDefault(require("../../shared/database/prisma"));
class AdminService {
    async getDashboardMetrics() {
        const [totalProducts, totalCategories, totalOrders, totalUsers, totalRevenueResult, recentOrders] = await Promise.all([
            prisma_1.default.product.count({ where: { deletedAt: null } }),
            prisma_1.default.category.count({ where: { deletedAt: null } }),
            prisma_1.default.order.count(),
            prisma_1.default.user.count({ where: { role: 'CUSTOMER' } }),
            prisma_1.default.order.aggregate({
                _sum: { totalAmount: true },
                where: { paymentStatus: 'COMPLETED' },
            }),
            prisma_1.default.order.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { items: true },
            }),
        ]);
        return {
            totalProducts,
            totalCategories,
            totalOrders,
            totalUsers,
            totalRevenue: totalRevenueResult._sum.totalAmount || 0,
            recentOrders,
        };
    }
    async getAuditLogs(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [items, totalItems] = await Promise.all([
            prisma_1.default.adminAuditLog.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    admin: {
                        select: { id: true, fullName: true, email: true },
                    },
                },
            }),
            prisma_1.default.adminAuditLog.count(),
        ]);
        const totalPages = Math.ceil(totalItems / limit);
        return {
            items,
            meta: {
                page,
                limit,
                totalItems,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        };
    }
}
exports.AdminService = AdminService;
exports.adminService = new AdminService();
