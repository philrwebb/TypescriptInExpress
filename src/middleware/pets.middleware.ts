import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { createPetSchema, updatePetSchema } from '../validators/pets.validator.js';

const petQuerySchema = z.object({
  species: z.string().trim().optional(),
  adopted: z.enum(['true', 'false']).optional(),
  minAge: z.string().regex(/^\d+$/).optional(),
  maxAge: z.string().regex(/^\d+$/).optional(),
});

export const validatePetQuery = (req: Request<{}, unknown, {}, Record<string, string | undefined>>, res: Response<{ message: string }>, next: NextFunction): void => {
  const parsed = petQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid pet query parameters.' });
    return;
  }

  next();
};

export const validateCreatePet = (req: Request<{}, unknown, unknown>, res: Response<{ message: string }>, next: NextFunction): void => {
  const parsed = createPetSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid pet payload.' });
    return;
  }

  req.body = parsed.data;
  next();
};

export const validateUpdatePet = (req: Request<{ id: string }, unknown, unknown>, res: Response<{ message: string }>, next: NextFunction): void => {
  const parsed = updatePetSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid pet update payload.' });
    return;
  }

  req.body = parsed.data;
  next();
};

export const validateNumericId = (req: Request<{ id: string }>, res: Response<{ message: string }>, next: NextFunction): void => {
  const { id } = req.params;

  if (!/^\d+$/.test(id)) {
    res.status(400).json({ message: 'Invalid ID format. ID must be a numeric value.' });
    return;
  }

  next();
};

export const pleaseAuth = (req: Request<{}, unknown, { password?: string }>, res: Response<{ message: string }>, next: NextFunction): void => {
  const { password } = req.query;

  if (password === 'please') {
    next();
    return;
  }

  res.status(401).json({ message: 'Unauthorized. Please provide the correct password.' });
};
