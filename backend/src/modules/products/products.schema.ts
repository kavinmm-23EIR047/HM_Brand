import { z } from 'zod';

export const productQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().default('1'),
    limit: z.string().optional().default('12'),
    search: z.string().optional(),
    category: z.string().optional(),
    collection: z.string().optional(),
    festival: z.string().optional(),
    sort: z.string().optional().default('display_order'),
    isFeatured: z.string().optional(),
    includeInactive: z.string().optional(),
  }),
});

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Product name required'),
    sku: z.string().optional().default(''),
    description: z.string().optional().default(''),
    shortDescription: z.string().optional(),
    price: z.coerce.number().min(0, 'Price must be non-negative'),
    mrp: z.coerce.number().min(0, 'MRP must be non-negative'),
    stockQuantity: z.coerce.number().int().nonnegative().default(100),
    couponCode: z.string().optional().nullable(),
    categoryIds: z.array(z.string()).optional().default([]),
    isFeatured: z.boolean().optional().default(false),
    isActive: z.boolean().optional().default(true),
    displayOrder: z.coerce.number().int().optional().default(0),
    images: z.array(z.object({
      url: z.string(),
      storageKey: z.string().optional().default('admin/product.jpg'),
      altText: z.string().optional(),
      isPrimary: z.boolean().optional().default(false),
      displayOrder: z.coerce.number().int().optional().default(0),
    })).optional().default([]),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Invalid product ID'),
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    sku: z.string().optional(),
    description: z.string().optional(),
    shortDescription: z.string().optional(),
    price: z.coerce.number().min(0).optional(),
    mrp: z.coerce.number().min(0).optional(),
    stockQuantity: z.coerce.number().int().nonnegative().optional(),
    couponCode: z.string().optional().nullable(),
    categoryIds: z.array(z.string()).optional(),
    isFeatured: z.boolean().optional(),
    displayOrder: z.coerce.number().int().optional(),
    isActive: z.boolean().optional(),
    images: z.array(z.object({
      url: z.string(),
      storageKey: z.string().optional().default('admin/product.jpg'),
      altText: z.string().optional(),
      isPrimary: z.boolean().optional().default(false),
      displayOrder: z.coerce.number().int().optional().default(0),
    })).optional(),
  }),
});

