import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.'),
  description: z.string().trim().min(1, 'Description is required.').max(256, 'Description must be 256 characters or fewer.'),
  price: z.number().nonnegative('Price must be zero or greater.'),
  stock: z.number().int().nonnegative('Stock must be a non-negative integer.'),
  sku: z.string().trim().min(1, 'SKU is required.'),
  isActive: z.boolean().optional().default(true),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
