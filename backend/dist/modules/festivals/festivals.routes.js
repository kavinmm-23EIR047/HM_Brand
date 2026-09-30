"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const festivals_controller_1 = require("./festivals.controller");
const auth_middleware_1 = require("../../shared/middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Public Routes
router.get('/', festivals_controller_1.festivalsController.getAll);
router.get('/:slug', festivals_controller_1.festivalsController.getBySlug);
// Admin Routes
router.post('/admin', auth_middleware_1.authenticateJWT, (0, auth_middleware_1.requireRole)('ADMIN'), festivals_controller_1.festivalsController.create);
router.patch('/admin/:id', auth_middleware_1.authenticateJWT, (0, auth_middleware_1.requireRole)('ADMIN'), festivals_controller_1.festivalsController.update);
router.delete('/admin/:id', auth_middleware_1.authenticateJWT, (0, auth_middleware_1.requireRole)('ADMIN'), festivals_controller_1.festivalsController.delete);
exports.default = router;
