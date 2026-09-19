import type { Request, Response } from 'express';
import { demoToken } from '../middleware/pets.middleware.js';

export const login = (req: Request, res: Response<{ token?: string; message: string }>): void => {
  res.status(200).json({ token: demoToken, message: 'Login successful' });
};
