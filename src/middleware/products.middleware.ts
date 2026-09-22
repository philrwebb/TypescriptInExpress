import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { createProductSchema, updateProductSchema } from '../validators/products.validator.js';

const productQuerySchema = z.object({
  name: z.string().trim().optional(),
  sku: z.string().trim().optional(),
  isActive: z.enum(['true', 'false']).optional(),
  minPrice: z
    .string()
    .regex(/^\d+(\.\d+)?$/)
    .optional(),
  maxPrice: z
    .string()
    .regex(/^\d+(\.\d+)?$/)
    .optional(),
});

export const validateProductQuery = (req: Request<{}, unknown, {}, Record<string, string | undefined>>, res: Response<{ message: string }>, next: NextFunction): void => {
  const parsed = productQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid product query parameters.' });
    return;
  }

  next();
};

export const validateCreateProduct = (req: Request<{}, unknown, unknown>, res: Response<{ message: string }>, next: NextFunction): void => {
  const parsed = createProductSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid product payload.' });
    return;
  }

  req.body = parsed.data;
  next();
};

export const validateUpdateProduct = (req: Request<{ id: string }, unknown, unknown>, res: Response<{ message: string }>, next: NextFunction): void => {
  const parsed = updateProductSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid product update payload.' });
    return;
  }

  req.body = parsed.data;
  next();
};
