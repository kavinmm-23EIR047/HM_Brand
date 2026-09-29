import prisma from '../../shared/database/prisma';

export class NewsletterService {
  async subscribe(email: string) {
    const formattedEmail = email.toLowerCase().trim();
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: formattedEmail },
    });

    if (existing) {
      if (!existing.isSubscribed) {
        return prisma.newsletterSubscriber.update({
          where: { id: existing.id },
          data: { isSubscribed: true },
        });
      }
      return existing;
    }

    return prisma.newsletterSubscriber.create({
      data: { email: formattedEmail },
    });
  }

  async getAllSubscribers() {
    return prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const newsletterService = new NewsletterService();
