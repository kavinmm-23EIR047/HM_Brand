"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressesService = exports.AddressesService = void 0;
const addresses_repository_1 = require("./addresses.repository");
const custom_error_1 = require("../../shared/errors/custom.error");
class AddressesService {
    repo;
    constructor(repo = addresses_repository_1.addressesRepository) {
        this.repo = repo;
    }
    async getUserAddresses(userId) {
        return this.repo.findByUserId(userId);
    }
    async getDefaultAddress(userId) {
        const address = await this.repo.findDefaultByUserId(userId);
        if (!address) {
            const first = await this.repo.findByUserId(userId);
            return first[0] || null;
        }
        return address;
    }
    async createAddress(userId, data) {
        if (!data.recipientName || !data.phone || !data.street || !data.city || !data.state || !data.postalCode) {
            throw new custom_error_1.BadRequestError('Recipient name, phone, street, city, state, and postal code are all required.');
        }
        return this.repo.create(userId, data);
    }
    async updateAddress(id, userId, data) {
        const existing = await this.repo.findByIdAndUserId(id, userId);
        if (!existing) {
            throw new custom_error_1.NotFoundError('Address not found or does not belong to you.');
        }
        return this.repo.update(id, userId, data);
    }
    async setDefaultAddress(id, userId) {
        const existing = await this.repo.findByIdAndUserId(id, userId);
        if (!existing) {
            throw new custom_error_1.NotFoundError('Address not found or does not belong to you.');
        }
        return this.repo.setDefault(id, userId);
    }
    async deleteAddress(id, userId) {
        const existing = await this.repo.findByIdAndUserId(id, userId);
        if (!existing) {
            throw new custom_error_1.NotFoundError('Address not found or does not belong to you.');
        }
        return this.repo.delete(id, userId);
    }
}
exports.AddressesService = AddressesService;
exports.addressesService = new AddressesService();
