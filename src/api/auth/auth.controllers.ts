import argon2 from 'argon2';
import crypto from 'crypto';
import type { NextFunction, Request, Response } from 'express';

import { createError } from '@/core/errors';
import { User } from '@/database';
import { sendMail } from '@/utils/mail';

import { authService } from './auth.services';

class AuthController {
  public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await authService.login(req, res, next);
    } catch (error) {
      res.status(400).send(createError(error));
    }
  }

  public async forgotPassword(req: Request, res: Response): Promise<any> {
    const { email } = req.body;

    try {
      const user = await User.getUserByEmail(email);
      if (!user) {
        return res.status(400).send('User not found');
      }

      const token = crypto.randomBytes(20).toString('hex');
      console.log(token);
      user.resetPasswordToken = token;
      user.resetPasswordExpires = new Date(Date.now() + 5 * 60 * 1000);
      await user.save();

      const resetURL = `http://localhost:3000/reset-password/${token}`;

      await sendMail(
        email,
        'Password Reset',
        `You requested a password reset. Click the link to reset your password: ${resetURL}`,
      );
      res.status(200).send('Password reset email sent');
    } catch (err: unknown) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }

  public async resetPassword(req: Request, res: Response): Promise<any> {
    const { token } = req.params;
    const { password } = req.body;

    try {
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) return res.status(400).send('Invalid or expired token');

      const hashedPassword = await argon2.hash(password);
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      User.unlockAccount(user._id.toString());

      await user.save();

      res.status(200).send('Password successfully reset');
      if (!user) {
        return res.status(400).send('Invalid or expired token');
      }
    } catch (err: unknown) {
      console.error(err);
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
