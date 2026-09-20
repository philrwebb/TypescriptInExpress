import type { ErrorRequestHandler, NextFunction, Request, Response } from 'express';

export class AppError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
  }
}

export const notFoundHandler = (req: Request, res: Response<{ message: string }>, next: NextFunction): void => {
  next(new AppError(404, `Route not found: ${req.originalUrl}`));
};

export const errorHandler: ErrorRequestHandler = (err, req, res, next): void => {
  if (res.headersSent) {
    next(err);
    return;
  }

  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err instanceof Error ? err.message : 'Something went wrong';

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({ message });
};
