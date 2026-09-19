import type { NextFunction, Request, Response } from 'express';
import { auth } from '../lib/auth.js';

export const requireSession = async (req: Request, res: Response<{ message: string }>, next: NextFunction): Promise<void> => {
  try {
    const headers = new Headers();

    for (const [key, value] of Object.entries(req.headers)) {
      if (Array.isArray(value)) {
        for (const item of value) {
          headers.append(key, item);
        }
        continue;
      }

      if (typeof value === 'string') {
        headers.set(key, value);
      }
    }

    const session = await (auth.api as any).getSession({ headers });

    if (!session || !session.session || !session.user) {
      res.status(401).json({ message: 'Unauthorized. Please sign in first.' });
      return;
    }

    (req as Request & { user?: unknown }).user = session.user;
    next();
  } catch (error) {
    console.error('Better Auth session check failed:', error);
    res.status(401).json({ message: 'Unauthorized. Invalid session.' });
  }
};
