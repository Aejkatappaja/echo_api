import crypto from 'crypto';

class TokenUtils {
  public generateToken() {
    return crypto.randomBytes(20).toString('hex');
  }
}

export const tokenUtils = new TokenUtils();
