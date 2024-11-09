/* eslint-disable no-useless-catch */
import argon2 from 'argon2';

import type { IUserDocument, UserSchemaType } from '@/database';
import { User } from '@/database';

class UserService {
  async #passwordHash(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  async #existingEmail(email: string): Promise<boolean | Error> {
    try {
      const user = await User.getUserByEmail(email);
      return !!user;
    } catch (err: unknown) {
      console.error(err);
      throw new Error('Error checking email existence');
    }
  }

  public async passwordVerification(hashedPassword: string, password: string): Promise<boolean> {
    try {
      const isMatch = await argon2.verify(hashedPassword, password);
      return !!isMatch;
    } catch (err: unknown) {
      console.error(err);
      return false;
    }
  }

  public async create(creationFields: UserSchemaType): Promise<IUserDocument | void> {
    try {
      const email = creationFields.email.toLowerCase();
      const emailAlreadyUsed = await this.#existingEmail(email);
      if (emailAlreadyUsed) throw new Error('Email already in use');
      const password = await this.#passwordHash(creationFields.password);
      const newUser = await User.createUser({ ...creationFields, email, password });
      return newUser;
    } catch (err) {
      throw err;
    }
  }
}

export const userService = new UserService();
