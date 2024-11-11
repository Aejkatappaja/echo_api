import argon2 from 'argon2';

class PasswordUtils {
  public async hash(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  public async isMatching(hashedPassword: string, password: string): Promise<boolean> {
    try {
      const isMatch = await argon2.verify(hashedPassword, password);
      return !!isMatch;
    } catch (err: unknown) {
      console.error(err);
      return false;
    }
  }
}

export const passwordUtils = new PasswordUtils();
