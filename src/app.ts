import express from 'express';
import type { Express } from 'express';
import cors from 'cors';
import { toNodeHandler } from 'better-auth/node';
import { initializeDatabase } from './db.js';
import { auth, initializeAuth } from './lib/auth.js';
import { authRouter } from './routes/auth.routes.js';
import { petRouter } from './routes/pets.routes.js';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';

export const createApp = async (): Promise<Express> => {
  initializeDatabase();
  await initializeAuth();

  const app: Express = express();

  app.use(cors());
  app.use(express.json());

  app.use('/api/auth', toNodeHandler(auth.handler));
  app.use('/', authRouter);
  app.use('/pets', petRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
