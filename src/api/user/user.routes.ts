import { CreateUserSchema, ResetPasswordSchema, UpdateUserSchema } from '@database';
import express from 'express';

import { validate } from '@/middleware';

import { userController } from './user.controllers';

export const userRouter = express.Router();

userRouter
  .post('/forgot-password', userController.forgotPassword)
  .post('/reset-password/:token', validate(ResetPasswordSchema), userController.resetPassword)
  .post('/', validate(CreateUserSchema), userController.create)
  .get('/', userController.read)
  .post('/:id', validate(UpdateUserSchema), userController.update)
  .delete('/:id', userController.delete);
