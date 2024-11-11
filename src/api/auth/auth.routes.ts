import express from 'express';

import { isAuthenticated } from '@/middleware';

import { authController } from './auth.controllers';

export const authRouter = express.Router();

authRouter.post('/login', authController.login).get('/logout/:id', isAuthenticated, authController.logout);
