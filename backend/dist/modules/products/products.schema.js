"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductSchema = exports.createProductSchema = exports.productQuerySchema = void 0;
const zod_1 = require("zod");
exports.productQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string().optional().default('1'),
        limit: zod_1.z.string().optional().default('12'),
        search: zod_1.z.string().optional(),
        category: zod_1.z.string().optional(),
        collection: zod_1.z.string().optional(),
        festival: zod_1.z.string().optional(),
        sort: zod_1.z.string().optional().default('display_order'),
        isFeatured: zod_1.z.string().optional(),
        includeInactive: zod_1.z.string().optional(),
    }),
});
exports.createProductSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Product name required'),
        sku: zod_1.z.string().optional().default(''),
        description: zod_1.z.string().optional().default(''),
        shortDescription: zod_1.z.string().optional(),
        price: zod_1.z.coerce.number().min(0, 'Price must be non-negative'),
        mrp: zod_1.z.coerce.number().min(0, 'MRP must be non-negative'),
        stockQuantity: zod_1.z.coerce.number().int().nonnegative().default(100),
        couponCode: zod_1.z.string().optional().nullable(),
        categoryIds: zod_1.z.array(zod_1.z.string()).optional().default([]),
        isFeatured: zod_1.z.boolean().optional().default(false),
        isActive: zod_1.z.boolean().optional().default(true),
        displayOrder: zod_1.z.coerce.number().int().optional().default(0),
        images: zod_1.z.array(zod_1.z.object({
            url: zod_1.z.string(),
            storageKey: zod_1.z.string().optional().default('admin/product.jpg'),
            altText: zod_1.z.string().optional(),
            isPrimary: zod_1.z.boolean().optional().default(false),
            displayOrder: zod_1.z.coerce.number().int().optional().default(0),
        })).optional().default([]),
    }),
});
exports.updateProductSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, 'Invalid product ID'),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).optional(),
        sku: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        shortDescription: zod_1.z.string().optional(),
        price: zod_1.z.coerce.number().min(0).optional(),
        mrp: zod_1.z.coerce.number().min(0).optional(),
        stockQuantity: zod_1.z.coerce.number().int().nonnegative().optional(),
        couponCode: zod_1.z.string().optional().nullable(),
        categoryIds: zod_1.z.array(zod_1.z.string()).optional(),
        isFeatured: zod_1.z.boolean().optional(),
        displayOrder: zod_1.z.coerce.number().int().optional(),
        isActive: zod_1.z.boolean().optional(),
        images: zod_1.z.array(zod_1.z.object({
            url: zod_1.z.string(),
            storageKey: zod_1.z.string().optional().default('admin/product.jpg'),
            altText: zod_1.z.string().optional(),
            isPrimary: zod_1.z.boolean().optional().default(false),
            displayOrder: zod_1.z.coerce.number().int().optional().default(0),
        })).optional(),
    }),
});
