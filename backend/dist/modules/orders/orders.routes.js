"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orders_controller_1 = require("./orders.controller");
const validation_middleware_1 = require("../../shared/middlewares/validation.middleware");
const orders_schema_1 = require("./orders.schema");
const auth_middleware_1 = require("../../shared/middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Public / Customer Routes
router.post('/', auth_middleware_1.optionalAuthenticateJWT, (0, validation_middleware_1.validateRequest)(orders_schema_1.createOrderSchema), orders_controller_1.ordersController.create);
router.post('/verify-payment', auth_middleware_1.optionalAuthenticateJWT, (0, validation_middleware_1.validateRequest)(orders_schema_1.verifyPaymentSchema), orders_controller_1.ordersController.verifyPayment);
router.get('/shipping-config', orders_controller_1.ordersController.getShippingConfig);
// Authenticated / Guest Customer Routes
router.get('/', auth_middleware_1.optionalAuthenticateJWT, orders_controller_1.ordersController.getAll);
router.get('/:id', auth_middleware_1.optionalAuthenticateJWT, orders_controller_1.ordersController.getOne);
// Admin Routes
router.patch('/admin/:id/status', auth_middleware_1.authenticateJWT, (0, auth_middleware_1.requireRole)('ADMIN'), (0, validation_middleware_1.validateRequest)(orders_schema_1.updateOrderStatusSchema), orders_controller_1.ordersController.updateStatus);
exports.default = router;
