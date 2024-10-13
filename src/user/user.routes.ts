import { CreateUserSchema } from '@database';
import { user_controller } from '@user';
import express from 'express';

import { validate } from '@/middlewares';

export const userRouter = express.Router();

userRouter.post('/', validate(CreateUserSchema), user_controller.createUser);
