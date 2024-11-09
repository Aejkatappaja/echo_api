import type { PassportStatic } from 'passport';
import * as passportStrategy from 'passport-local';

import { User } from '@/database';
import { utils } from '@/utils/password';

import { createError } from '../errors';

export function configureLocalStrategy(passport: PassportStatic) {
  passport.use(
    new passportStrategy.Strategy({ usernameField: 'email' }, async (email, password, done) => {
      try {
        const user = await User.getUserByEmail(email);
        console.log(user, 'user');
        if (!user) {
          return done(null, false, { message: 'User incorrect' });
        }

        const isMatch = await utils.isPasswordMatching(user.password, password);

        if (!isMatch) {
          return done(null, false, { message: 'Mot de passe incorrect' });
        }
        return done(null, user._id.toString());
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.serializeUser((user, done) => {
    console.log(user);
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    try {
      if (!user) {
        throw new Error('user not found');
      }
      done(null, user);
    } catch (e: unknown) {
      return createError(e);
    }
    return null;
  });
}
