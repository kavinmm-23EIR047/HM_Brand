"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressesController = exports.AddressesController = void 0;
const addresses_service_1 = require("./addresses.service");
const response_util_1 = require("../../shared/utils/response.util");
class AddressesController {
    service;
    constructor(service = addresses_service_1.addressesService) {
        this.service = service;
    }
    getMyAddresses = async (req, res, next) => {
        try {
            const addresses = await this.service.getUserAddresses(req.user.userId);
            return (0, response_util_1.sendSuccess)(res, addresses, 'Addresses fetched successfully');
        }
        catch (error) {
            return next(error);
        }
    };
    getDefaultAddress = async (req, res, next) => {
        try {
            const address = await this.service.getDefaultAddress(req.user.userId);
            return (0, response_util_1.sendSuccess)(res, address, 'Default delivery address retrieved');
        }
        catch (error) {
            return next(error);
        }
    };
    createAddress = async (req, res, next) => {
        try {
            const address = await this.service.createAddress(req.user.userId, req.body);
            return (0, response_util_1.sendSuccess)(res, address, 'Address added successfully', 201);
        }
        catch (error) {
            return next(error);
        }
    };
    updateAddress = async (req, res, next) => {
        try {
            const address = await this.service.updateAddress(req.params.id, req.user.userId, req.body);
            return (0, response_util_1.sendSuccess)(res, address, 'Address updated successfully');
        }
        catch (error) {
            return next(error);
        }
    };
    setDefaultAddress = async (req, res, next) => {
        try {
            const address = await this.service.setDefaultAddress(req.params.id, req.user.userId);
            return (0, response_util_1.sendSuccess)(res, address, 'Default delivery address updated successfully');
        }
        catch (error) {
            return next(error);
        }
    };
    deleteAddress = async (req, res, next) => {
        try {
            await this.service.deleteAddress(req.params.id, req.user.userId);
            return (0, response_util_1.sendSuccess)(res, null, 'Address removed successfully');
        }
        catch (error) {
            return next(error);
        }
    };
}
exports.AddressesController = AddressesController;
exports.addressesController = new AddressesController();
