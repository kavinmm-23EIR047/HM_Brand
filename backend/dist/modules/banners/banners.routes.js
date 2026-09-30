"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const banners_controller_1 = require("./banners.controller");
const auth_middleware_1 = require("../../shared/middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Public Routes
router.get('/', auth_middleware_1.optionalAuthenticateJWT, banners_controller_1.bannersController.getAll);
// Admin Routes
router.post('/admin', auth_middleware_1.authenticateJWT, (0, auth_middleware_1.requireRole)('ADMIN'), banners_controller_1.bannersController.create);
router.patch('/admin/:id', auth_middleware_1.authenticateJWT, (0, auth_middleware_1.requireRole)('ADMIN'), banners_controller_1.bannersController.update);
router.delete('/admin/:id', auth_middleware_1.authenticateJWT, (0, auth_middleware_1.requireRole)('ADMIN'), banners_controller_1.bannersController.delete);
exports.default = router;
