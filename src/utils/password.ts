import argon2 from 'argon2';

class Utils {
  public async hashingPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  public async isPasswordMatching(hashedPassword: string, password: string): Promise<boolean> {
    try {
      const isMatch = await argon2.verify(hashedPassword, password);
      return !!isMatch;
    } catch (err: unknown) {
      console.error(err);
      return false;
    }
  }
}

export const utils = new Utils();
