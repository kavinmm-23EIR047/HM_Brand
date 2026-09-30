"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressesRepository = exports.AddressesRepository = void 0;
const prisma_1 = __importDefault(require("../../shared/database/prisma"));
class AddressesRepository {
    async findByUserId(userId) {
        return prisma_1.default.address.findMany({
            where: { userId },
            orderBy: [
                { isDefault: 'desc' },
                { createdAt: 'desc' },
            ],
        });
    }
    async findByIdAndUserId(id, userId) {
        return prisma_1.default.address.findFirst({
            where: { id, userId },
        });
    }
    async findDefaultByUserId(userId) {
        return prisma_1.default.address.findFirst({
            where: { userId, isDefault: true },
        });
    }
    async create(userId, data) {
        const existingCount = await prisma_1.default.address.count({ where: { userId } });
        const shouldBeDefault = data.isDefault || existingCount === 0;
        if (shouldBeDefault) {
            await prisma_1.default.address.updateMany({
                where: { userId },
                data: { isDefault: false },
            });
        }
        return prisma_1.default.address.create({
            data: {
                userId,
                recipientName: data.recipientName.trim(),
                phone: data.phone.trim(),
                street: data.street.trim(),
                city: data.city.trim(),
                state: data.state.trim(),
                postalCode: data.postalCode.trim(),
                isDefault: shouldBeDefault,
            },
        });
    }
    async update(id, userId, data) {
        if (data.isDefault) {
            await prisma_1.default.address.updateMany({
                where: { userId },
                data: { isDefault: false },
            });
        }
        return prisma_1.default.address.update({
            where: { id },
            data: {
                ...(data.recipientName ? { recipientName: data.recipientName.trim() } : {}),
                ...(data.phone ? { phone: data.phone.trim() } : {}),
                ...(data.street ? { street: data.street.trim() } : {}),
                ...(data.city ? { city: data.city.trim() } : {}),
                ...(data.state ? { state: data.state.trim() } : {}),
                ...(data.postalCode ? { postalCode: data.postalCode.trim() } : {}),
                ...(data.isDefault !== undefined ? { isDefault: data.isDefault } : {}),
            },
        });
    }
    async setDefault(id, userId) {
        await prisma_1.default.address.updateMany({
            where: { userId },
            data: { isDefault: false },
        });
        return prisma_1.default.address.update({
            where: { id },
            data: { isDefault: true },
        });
    }
    async delete(id, userId) {
        const deleted = await prisma_1.default.address.delete({
            where: { id },
        });
        if (deleted.isDefault) {
            const remaining = await prisma_1.default.address.findFirst({
                where: { userId },
                orderBy: { createdAt: 'desc' },
            });
            if (remaining) {
                await prisma_1.default.address.update({
                    where: { id: remaining.id },
                    data: { isDefault: true },
                });
            }
        }
        return deleted;
    }
}
exports.AddressesRepository = AddressesRepository;
exports.addressesRepository = new AddressesRepository();
