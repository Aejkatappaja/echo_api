import { RESET_PASSWORD_URL, TOKEN_EXPIRATION } from '@/constants';
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

  private async existingEmail(email: string): Promise<void> {
    const user = await this.userModel.getUserByEmail(email);
    if (user) throw new Error('Email already in use');
  }

  public async create(creationFields: UserSchemaType): Promise<IUserDocument | void> {
    const email = creationFields.email.toLowerCase();
    await this.existingEmail(email);
    const password = await passwordUtils.hash(creationFields.password);
    return await this.userModel.createUser({ ...creationFields, email, password });
  }

  public async forgotPassword(email: string): Promise<IUserDocument | void> {
    const user = await this.userModel.getUserByEmail(email);
    if (!user) throw new Error('User not found');
    const token = tokenUtils.generateToken();
    console.log(token);
    await this.managePasswordTokenFields(user, token);
    await user.save();

    const resetURL = `${RESET_PASSWORD_URL}/${token}`;

    await sendMail(
      email,
      'Password Reset',
      `You requested a password reset. Click the link to reset your password: ${resetURL}`
    );
  }

  private async managePasswordTokenFields(user: IUserDocument, token?: string): Promise<void> {
    if (token) {
      user.resetPasswordToken = token;
      user.resetPasswordExpires = new Date(Date.now() + TOKEN_EXPIRATION); // 5 minutes
    } else {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
    }
  }

  public async resetPassword(resetPasswordFields: { token: string; password: string }): Promise<void> {
    const user = await this.userModel.getUserByToken(resetPasswordFields.token);
    if (!user) throw new Error('Invalid or expired token');

    user.password = await passwordUtils.hash(resetPasswordFields.password);
    await this.managePasswordTokenFields(user);

    if (user.locked) this.userModel.unlockAccount(user._id.toString());

    await user.save();
  }
}

export const userService = new UserService(User);
