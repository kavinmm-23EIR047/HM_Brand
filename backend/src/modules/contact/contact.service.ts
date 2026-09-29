import prisma from '../../shared/database/prisma';

export class ContactService {
  async submitMessage(data: { name: string; email: string; subject?: string; message: string }) {
    return prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase().trim(),
        subject: data.subject,
        message: data.message,
      },
    });
  }

  async getAllMessages() {
    return prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: string) {
    return prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });
  }
}

export const contactService = new ContactService();
