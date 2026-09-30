import { Request, Response, NextFunction } from 'express';
import { addressesService, AddressesService } from './addresses.service';
import { sendSuccess } from '../../shared/utils/response.util';

export class AddressesController {
  constructor(private service: AddressesService = addressesService) {}

  getMyAddresses = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const addresses = await this.service.getUserAddresses(req.user!.userId);
      return sendSuccess(res, addresses, 'Addresses fetched successfully');
    } catch (error) {
      return next(error);
    }
  };

  getDefaultAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const address = await this.service.getDefaultAddress(req.user!.userId);
      return sendSuccess(res, address, 'Default delivery address retrieved');
    } catch (error) {
      return next(error);
    }
  };

  createAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const address = await this.service.createAddress(req.user!.userId, req.body);
      return sendSuccess(res, address, 'Address added successfully', 201);
    } catch (error) {
      return next(error);
    }
  };

  updateAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const address = await this.service.updateAddress(req.params.id, req.user!.userId, req.body);
      return sendSuccess(res, address, 'Address updated successfully');
    } catch (error) {
      return next(error);
    }
  };

  setDefaultAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const address = await this.service.setDefaultAddress(req.params.id, req.user!.userId);
      return sendSuccess(res, address, 'Default delivery address updated successfully');
    } catch (error) {
      return next(error);
    }
  };

  deleteAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.deleteAddress(req.params.id, req.user!.userId);
      return sendSuccess(res, null, 'Address removed successfully');
    } catch (error) {
      return next(error);
    }
  };
}

export const addressesController = new AddressesController();
