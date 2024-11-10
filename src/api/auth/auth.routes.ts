import express from 'express';

import { ResetPasswordSchema } from '@/database';
import { isAuthenticated, validate } from '@/middleware';

import { authController } from './auth.controllers';

export const authRouter = express.Router();

authRouter
  .post('/login', authController.login)
  .get('/logout/:id', isAuthenticated, authController.logout)
  .post('/forgotPassword', authController.forgotPassword)
  .post('/resetPassword/:token', validate(ResetPasswordSchema), authController.resetPassword);
