import { addressesRepository, AddressesRepository, CreateAddressDTO, UpdateAddressDTO } from './addresses.repository';
import { NotFoundError, BadRequestError } from '../../shared/errors/custom.error';

export class AddressesService {
  constructor(private repo: AddressesRepository = addressesRepository) {}

  async getUserAddresses(userId: string) {
    return this.repo.findByUserId(userId);
  }

  async getDefaultAddress(userId: string) {
    const address = await this.repo.findDefaultByUserId(userId);
    if (!address) {
      const first = await this.repo.findByUserId(userId);
      return first[0] || null;
    }
    return address;
  }

  async createAddress(userId: string, data: CreateAddressDTO) {
    if (!data.recipientName || !data.phone || !data.street || !data.city || !data.state || !data.postalCode) {
      throw new BadRequestError('Recipient name, phone, street, city, state, and postal code are all required.');
    }
    return this.repo.create(userId, data);
  }

  async updateAddress(id: string, userId: string, data: UpdateAddressDTO) {
    const existing = await this.repo.findByIdAndUserId(id, userId);
    if (!existing) {
      throw new NotFoundError('Address not found or does not belong to you.');
    }
    return this.repo.update(id, userId, data);
  }

  async setDefaultAddress(id: string, userId: string) {
    const existing = await this.repo.findByIdAndUserId(id, userId);
    if (!existing) {
      throw new NotFoundError('Address not found or does not belong to you.');
    }
    return this.repo.setDefault(id, userId);
  }

  async deleteAddress(id: string, userId: string) {
    const existing = await this.repo.findByIdAndUserId(id, userId);
    if (!existing) {
      throw new NotFoundError('Address not found or does not belong to you.');
    }
    return this.repo.delete(id, userId);
  }
}

export const addressesService = new AddressesService();
