"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const homepage_controller_1 = require("./homepage.controller");
const auth_middleware_1 = require("../../shared/middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Public Route
router.get('/', homepage_controller_1.homepageController.getHomepage);
// Admin Route
router.put('/admin/sections', auth_middleware_1.authenticateJWT, (0, auth_middleware_1.requireRole)('ADMIN'), homepage_controller_1.homepageController.updateSections);
exports.default = router;
