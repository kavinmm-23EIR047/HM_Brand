import prisma from '../../shared/database/prisma';

export class AdminService {
  async getDashboardMetrics() {
    const [totalProducts, totalCategories, totalOrders, totalUsers, totalRevenueResult, recentOrders] = await Promise.all([
      prisma.product.count({ where: { deletedAt: null } }),
      prisma.category.count({ where: { deletedAt: null } }),
      prisma.order.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { paymentStatus: 'COMPLETED' },
      }),
      prisma.order.findMany({
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

  async getAuditLogs(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [items, totalItems] = await Promise.all([
      prisma.adminAuditLog.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          admin: {
            select: { id: true, fullName: true, email: true },
          },
        },
      }),
      prisma.adminAuditLog.count(),
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

export const adminService = new AdminService();
