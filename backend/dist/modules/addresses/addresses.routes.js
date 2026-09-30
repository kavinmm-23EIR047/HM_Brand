"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const addresses_controller_1 = require("./addresses.controller");
const auth_middleware_1 = require("../../shared/middlewares/auth.middleware");
const router = (0, express_1.Router)();
// All address routes require user authentication
router.use(auth_middleware_1.authenticateJWT);
router.get('/', addresses_controller_1.addressesController.getMyAddresses);
router.get('/default', addresses_controller_1.addressesController.getDefaultAddress);
router.post('/', addresses_controller_1.addressesController.createAddress);
router.patch('/:id', addresses_controller_1.addressesController.updateAddress);
router.put('/:id', addresses_controller_1.addressesController.updateAddress);
router.patch('/:id/default', addresses_controller_1.addressesController.setDefaultAddress);
router.post('/:id/default', addresses_controller_1.addressesController.setDefaultAddress);
router.delete('/:id', addresses_controller_1.addressesController.deleteAddress);
exports.default = router;
