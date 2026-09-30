import prisma from '../../shared/database/prisma';
import { Address } from '@prisma/client';

export interface CreateAddressDTO {
  recipientName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault?: boolean;
}

export interface UpdateAddressDTO {
  recipientName?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  isDefault?: boolean;
}

export class AddressesRepository {
  async findByUserId(userId: string): Promise<Address[]> {
    return prisma.address.findMany({
      where: { userId },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async findByIdAndUserId(id: string, userId: string): Promise<Address | null> {
    return prisma.address.findFirst({
      where: { id, userId },
    });
  }

  async findDefaultByUserId(userId: string): Promise<Address | null> {
    return prisma.address.findFirst({
      where: { userId, isDefault: true },
    });
  }

  async create(userId: string, data: CreateAddressDTO): Promise<Address> {
    const existingCount = await prisma.address.count({ where: { userId } });
    const shouldBeDefault = data.isDefault || existingCount === 0;

    if (shouldBeDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    return prisma.address.create({
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

  async update(id: string, userId: string, data: UpdateAddressDTO): Promise<Address> {
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    return prisma.address.update({
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

  async setDefault(id: string, userId: string): Promise<Address> {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });

    return prisma.address.update({
      where: { id },
      data: { isDefault: true },
    });
  }

  async delete(id: string, userId: string): Promise<Address> {
    const deleted = await prisma.address.delete({
      where: { id },
    });

    if (deleted.isDefault) {
      const remaining = await prisma.address.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      if (remaining) {
        await prisma.address.update({
          where: { id: remaining.id },
          data: { isDefault: true },
        });
      }
    }

    return deleted;
  }
}

export const addressesRepository = new AddressesRepository();
