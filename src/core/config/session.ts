import { AUTH_SECRET, MONGODB_URI } from '@core/config';
import type { UserSchemaType } from '@database';
import MongoStore from 'connect-mongo';
import session from 'express-session';

export const sessionConfig = session({
  secret: AUTH_SECRET,
  resave: true,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: MONGODB_URI,
    collectionName: 'mySessions',
    ttl: 60 * 60,
    autoRemove: 'interval',
    autoRemoveInterval: 60,
  }),
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 60 * 60 * 1000,
    sameSite: 'lax',
  },
});

declare module 'express-session' {
  interface SessionData {
    user: Pick<UserSchemaType, 'username'>;
  }
}
