/* eslint-disable no-useless-catch */

import type { IUserDocument, UserSchemaType } from '@/database';
import { User } from '@/database';
import { utils } from '@/utils/password';

class UserService {
  async #existingEmail(email: string): Promise<boolean | Error> {
    try {
      const user = await User.getUserByEmail(email);
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
      const password = await utils.hashingPassword(creationFields.password);
      const newUser = await User.createUser({ ...creationFields, email, password });
      return newUser;
    } catch (err) {
      throw err;
    }
  }
}

export const userService = new UserService();
