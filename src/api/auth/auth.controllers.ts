import type { NextFunction, Request, Response } from 'express';

import { createError } from '@/core/errors';

import { authService } from './auth.services';

class AuthController {
  public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await authService.login(req, res, next);
    } catch (error) {
      res.status(400).send(createError(error));
    }
  }

  public async logout(req: Request, res: Response): Promise<void> {
    try {
      const user = await authService.logout(req, res);
      res.status(201).send(user);
    } catch (error) {
      res.status(400).send(createError(error));
    }
  }
}

export const authController = new AuthController();
