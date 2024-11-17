import { authRouter, boardRouter, columnRouter, teamRouter, userRouter } from '@api';
import { connectDB } from '@database';
import cors from 'cors';
import type { Express, Request, Response } from 'express';
import express from 'express';
import morgan from 'morgan';
import passport from 'passport';

import { sessionConfig } from '@/session';
import { configureLocalStrategy } from '@/strategy/strategy.local';

import { commentRouter } from './api/comment/comment.routes';
import { PORT } from './config';
import { API_ENDPOINTS } from './constants';

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

  app.use(API_ENDPOINTS.AUTH, authRouter);
  app.use(API_ENDPOINTS.USER, userRouter);
  app.use(API_ENDPOINTS.TEAM, teamRouter);
  app.use(API_ENDPOINTS.BOARD, boardRouter);
  app.use(API_ENDPOINTS.COLUMN, columnRouter);
  app.use(API_ENDPOINTS.COMMENT, commentRouter);

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
