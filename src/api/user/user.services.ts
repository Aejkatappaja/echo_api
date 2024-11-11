/* eslint-disable no-useless-catch */

import { RESET_PASSWORD_URL } from '@/core/constants';
import type { IUserDocument, IUserModel, UserSchemaType } from '@/database';
import { User } from '@/database';
import { sendMail } from '@/utils/mail';
import { passwordUtils } from '@/utils/password';
import { tokenUtils } from '@/utils/token';

class UserService {
  userModel: IUserModel;

  constructor(userModel: IUserModel) {
    this.userModel = userModel;
  }

  async #existingEmail(email: string): Promise<boolean | Error> {
    try {
      const user = await this.userModel.getUserByEmail(email);
      return !!user;
    } catch (err: unknown) {
      console.error(err);
      throw new Error('Error checking email existence');
    }
  }

  public async create(creationFields: UserSchemaType): Promise<IUserDocument | void> {
    try {
      const email = creationFields.email.toLowerCase();
      const emailAlreadyUsed = await this.#existingEmail(email);
      if (emailAlreadyUsed) throw new Error('Email already in use');
      const password = await passwordUtils.hash(creationFields.password);
      const newUser = await this.userModel.createUser({ ...creationFields, email, password });
      return newUser;
    } catch (err) {
      throw err;
    }
  }

  public async forgotPassword(email: string): Promise<IUserDocument | void> {
    const user = await this.userModel.getUserByEmail(email);
    if (!user) throw new Error('User not found');
    const token = tokenUtils.generateToken();
    console.log(token);
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    const resetURL = `${RESET_PASSWORD_URL}/${token}`;

    await sendMail(
      email,
      'Password Reset',
      `You requested a password reset. Click the link to reset your password: ${resetURL}`
    );
  }

  public async resetPassword(resetPasswordFields: { token: string; password: string }) {
    const user = await this.userModel.getUserByToken(resetPasswordFields.token);
    if (!user) throw new Error('Invalid or expired token');
    const hashedPassword = await passwordUtils.hash(resetPasswordFields.password);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    this.userModel.unlockAccount(user._id.toString());

    await user.save();
  }
}

export const userService = new UserService(User);
