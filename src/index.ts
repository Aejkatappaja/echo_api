import { PORT } from '@core/config';
import { connectDB } from '@database';
import { userRouter } from '@user';
import cors from 'cors';
import type { Express, Request, Response } from 'express';
import express from 'express';
import morgan from 'morgan';

import { BASE_API_PREFIX } from './core/constants';

const app: Express = express();
app.use(express.json());
app.use(cors());
app.use(morgan('common'));

const router = express.Router();

router.get('/', (_req: Request, res: Response) => {
  res.status(200).send('hello');
});

router.all('*', (_req: Request, res: Response) => {
  res.status(404).send('404 not found');
});

connectDB().then(() => {
  app.use(BASE_API_PREFIX, router);
  app.use(`${BASE_API_PREFIX}/user`, userRouter);

  app.listen(PORT, () => {
    console.log(`🖲️  Server running at http://localhost:${PORT} 🖲️`);
  });
});
