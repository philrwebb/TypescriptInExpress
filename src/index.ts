import express from 'express';
import type { Express, Request, Response } from 'express';
import cors from 'cors';
import { initializeDatabase } from './db.js';
import { petRouter } from './routes/pets.routes.js';

const app: Express = express();
const port = 8000;

initializeDatabase();

app.use(cors());
app.use(express.json());

app.use('/pets', petRouter);

app.use((req: Request, res: Response<{ message: string }>): void => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(port, (): void => {
  console.log(`Server is running at http://localhost:${port}`);
});
