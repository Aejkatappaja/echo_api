import { CreateUserSchema, UpdateUserSchema } from '@database';
import express from 'express';

import { validate } from '@/middleware';

import { userController } from './user.controllers';

export const userRouter = express.Router();

userRouter
  .post('/', validate(CreateUserSchema), userController.create)
  .get('/', userController.read)
  .post('/:id', validate(UpdateUserSchema), userController.update)
  .delete('/:id', userController.delete);
