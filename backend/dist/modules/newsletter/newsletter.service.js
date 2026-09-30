"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newsletterService = exports.NewsletterService = void 0;
const prisma_1 = __importDefault(require("../../shared/database/prisma"));
class NewsletterService {
    async subscribe(email) {
        const formattedEmail = email.toLowerCase().trim();
        const existing = await prisma_1.default.newsletterSubscriber.findUnique({
            where: { email: formattedEmail },
        });
        if (existing) {
            if (!existing.isSubscribed) {
                return prisma_1.default.newsletterSubscriber.update({
                    where: { id: existing.id },
                    data: { isSubscribed: true },
                });
            }
            return existing;
        }
        return prisma_1.default.newsletterSubscriber.create({
            data: { email: formattedEmail },
        });
    }
    async getAllSubscribers() {
        return prisma_1.default.newsletterSubscriber.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
}
exports.NewsletterService = NewsletterService;
exports.newsletterService = new NewsletterService();
