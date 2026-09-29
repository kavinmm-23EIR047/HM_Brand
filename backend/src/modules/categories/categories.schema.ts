import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Category name required'),
    description: z.string().optional(),
    imageUrl: z.string().optional(),
    displayOrder: z.coerce.number().int().optional().default(0),
    isActive: z.boolean().optional().default(true),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Invalid category ID'),
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    imageUrl: z.string().optional(),
    displayOrder: z.coerce.number().int().optional(),
    isActive: z.boolean().optional(),
  }),
});

