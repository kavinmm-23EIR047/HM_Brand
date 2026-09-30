"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contact_controller_1 = require("./contact.controller");
const auth_middleware_1 = require("../../shared/middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Public Route
router.post('/', contact_controller_1.contactController.submit);
// Admin Routes
router.get('/admin', auth_middleware_1.authenticateJWT, (0, auth_middleware_1.requireRole)('ADMIN'), contact_controller_1.contactController.getAll);
router.patch('/admin/:id/read', auth_middleware_1.authenticateJWT, (0, auth_middleware_1.requireRole)('ADMIN'), contact_controller_1.contactController.markAsRead);
exports.default = router;
