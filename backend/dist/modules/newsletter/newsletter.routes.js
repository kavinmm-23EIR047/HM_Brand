"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const newsletter_controller_1 = require("./newsletter.controller");
const auth_middleware_1 = require("../../shared/middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Public Route
router.post('/subscribe', newsletter_controller_1.newsletterController.subscribe);
// Admin Route
router.get('/admin', auth_middleware_1.authenticateJWT, (0, auth_middleware_1.requireRole)('ADMIN'), newsletter_controller_1.newsletterController.getAll);
exports.default = router;
