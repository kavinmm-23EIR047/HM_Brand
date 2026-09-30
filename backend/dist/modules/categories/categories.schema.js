"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategorySchema = exports.createCategorySchema = void 0;
const zod_1 = require("zod");
exports.createCategorySchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Category name required'),
        description: zod_1.z.string().optional(),
        imageUrl: zod_1.z.string().optional(),
        displayOrder: zod_1.z.coerce.number().int().optional().default(0),
        isActive: zod_1.z.boolean().optional().default(true),
    }),
});
exports.updateCategorySchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, 'Invalid category ID'),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).optional(),
        description: zod_1.z.string().optional(),
        imageUrl: zod_1.z.string().optional(),
        displayOrder: zod_1.z.coerce.number().int().optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
