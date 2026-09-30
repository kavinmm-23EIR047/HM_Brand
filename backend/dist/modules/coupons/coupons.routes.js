"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const coupons_controller_1 = require("./coupons.controller");
const auth_middleware_1 = require("../../shared/middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Public / Customer Route
router.post('/validate', coupons_controller_1.couponsController.validate);
// Admin Routes
router.get('/admin', auth_middleware_1.authenticateJWT, (0, auth_middleware_1.requireRole)('ADMIN'), coupons_controller_1.couponsController.getAll);
router.post('/admin', auth_middleware_1.authenticateJWT, (0, auth_middleware_1.requireRole)('ADMIN'), coupons_controller_1.couponsController.create);
router.patch('/admin/:id', auth_middleware_1.authenticateJWT, (0, auth_middleware_1.requireRole)('ADMIN'), coupons_controller_1.couponsController.update);
router.delete('/admin/:id', auth_middleware_1.authenticateJWT, (0, auth_middleware_1.requireRole)('ADMIN'), coupons_controller_1.couponsController.delete);
exports.default = router;
