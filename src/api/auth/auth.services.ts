import type { NextFunction, Request, Response } from 'express';
import passport from 'passport';

import type { UserSchemaType } from '@/database';
import { User } from '@/database';

class AuthServices {
  public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    passport.authenticate(
      'local',
      async (err: Error, user: Pick<UserSchemaType, 'username' | 'password'>, info: { message: string }) => {
        if (err) {
          return next(err);
        }

        if (!user) {
          return res.status(401).json({ message: info.message });
        }

        console.log(user);
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          console.log(req.session);
          return res.send('connected');
        });
      }
    )(req, res, next);
  }

  private userSessionDestroy(req: Request, res: Response): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          res.send('An error occured on disconnection process');
          return reject(err);
        }
        res.clearCookie('connect.sid', { path: '/' });
        res.send('Successfully disconnected!');
        resolve();
      });
    });
  }

  public async logout(req: Request, res: Response): Promise<void> {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new Error('An error occured');
    }
    const response = await this.userSessionDestroy(req, res);
    return response;
  }
}

export const authService = new AuthServices();
