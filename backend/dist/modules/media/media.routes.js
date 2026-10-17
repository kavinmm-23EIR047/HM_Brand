"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const auth_middleware_1 = require("../../shared/middlewares/auth.middleware");
const media_controller_1 = require("./media.controller");
const router = (0, express_1.Router)();
const allowedMimeTypes = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/avif']);
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 15 * 1024 * 1024, files: 1 },
    fileFilter: (_req, file, callback) => callback(null, allowedMimeTypes.has(file.mimetype)),
});
router.post('/admin/upload', auth_middleware_1.authenticateJWT, (0, auth_middleware_1.requireRole)('ADMIN'), upload.single('file'), media_controller_1.mediaController.upload);
router.delete('/admin/:type/:entityId', auth_middleware_1.authenticateJWT, (0, auth_middleware_1.requireRole)('ADMIN'), media_controller_1.mediaController.delete);
exports.default = router;
