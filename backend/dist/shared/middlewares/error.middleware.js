"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const custom_error_1 = require("../errors/custom.error");
const response_util_1 = require("../utils/response.util");
const multer_1 = require("multer");
function errorHandler(err, req, res, next) {
    console.error(`[ERROR] ${req.method} ${req.url}:`, err);
    if (err instanceof custom_error_1.AppError) {
        return (0, response_util_1.sendError)(res, err.message, err.statusCode, err.errors);
    }
    if (err instanceof multer_1.MulterError) {
        const message = err.code === 'LIMIT_FILE_SIZE'
            ? 'Image files must be 15 MB or smaller.'
            : 'Invalid image upload.';
        return (0, response_util_1.sendError)(res, message, 400);
    }
    // Handle Prisma Database Errors
    if (err.name === 'PrismaClientKnownRequestError') {
        const prismaErr = err;
        if (prismaErr.code === 'P2002') {
            const field = prismaErr.meta?.target ? prismaErr.meta.target.join(', ') : 'field';
            return (0, response_util_1.sendError)(res, `A record with this ${field} already exists.`, 409);
        }
        if (prismaErr.code === 'P2025') {
            return (0, response_util_1.sendError)(res, 'Record not found in database.', 404);
        }
    }
    return (0, response_util_1.sendError)(res, process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message, 500);
}
