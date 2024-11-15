import { authRouter, userRouter } from '@api';
import { PORT } from '@core/config';
import { AUTH_API_PREFIX, USER_API_PREFIX } from '@core/constants';
import { connectDB } from '@database';
import cors from 'cors';
import type { Express, Request, Response } from 'express';
import express from 'express';
import morgan from 'morgan';
import passport from 'passport';

import { sessionConfig } from '@/core/config/session';
import { configureLocalStrategy } from '@/core/strategy/strategy.local';

const app: Express = express();
app.use(express.json());
app.use(
  cors({
    // need to specify this when sending cookies
    // otherwise it doesn't work
    origin: (_origin, callback) => {
      callback(null, true);
    },
    credentials: true,
  })
);
app.use(morgan('common'));

connectDB().then(() => {
  app.use(sessionConfig);
  app.use(passport.initialize());
  app.use(passport.session());
  configureLocalStrategy(passport);

  app.use(AUTH_API_PREFIX, authRouter);
  app.use(USER_API_PREFIX, userRouter);

  app.get('/', (_req: Request, res: Response) => {
    res.status(200).send('Welcome to Echo API!');
  });

  app.all('*', (_req: Request, res: Response) => {
    res.status(404).send('404 NOT FOUND');
  });

  app.listen(PORT, () => {
    console.log(`🖲️  Server running at http://localhost:${PORT} 🖲️`);
  });
});
