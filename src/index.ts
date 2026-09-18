import express from 'express';
import type { Express, Request, Response } from 'express';
import cors from 'cors';
import { initializeDatabase } from './db.js';
import { demoToken } from './middleware/pets.middleware.js';
import { petRouter } from './routes/pets.routes.js';

const app: Express = express();
const port = 8000;

initializeDatabase();

app.use(cors());
app.use(express.json());

app.get('/login', (req: Request, res: Response<{ token?: string; message: string }>): void => {
  const password = typeof req.query.password === 'string' ? req.query.password : undefined;

  if (password !== 'please') {
    res.status(401).json({ message: 'Unauthorized. Provide ?password=please' });
    return;
  }

  res.status(200).json({ token: demoToken, message: 'Login successful' });
});

app.use('/pets', petRouter);

app.use((req: Request, res: Response<{ message: string }>): void => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(port, (): void => {
  console.log(`Server is running at http://localhost:${port}`);
});
