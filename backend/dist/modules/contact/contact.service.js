"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactService = exports.ContactService = void 0;
const prisma_1 = __importDefault(require("../../shared/database/prisma"));
class ContactService {
    async submitMessage(data) {
        return prisma_1.default.contactMessage.create({
            data: {
                name: data.name,
                email: data.email.toLowerCase().trim(),
                subject: data.subject,
                message: data.message,
            },
        });
    }
    async getAllMessages() {
        return prisma_1.default.contactMessage.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async markAsRead(id) {
        return prisma_1.default.contactMessage.update({
            where: { id },
            data: { isRead: true },
        });
    }
}
exports.ContactService = ContactService;
exports.contactService = new ContactService();
