import type { Document, Model, Types } from 'mongoose';
import { model, Schema } from 'mongoose';
import { z } from 'zod';

import { MAX_LOGIN_ATTEMPT } from '@/core/constants';

export const zodPasswordType = z
  .string()
  .min(8, { message: 'Password should contain at least 8 characters' })
  .regex(/[a-z]/, {
    message: 'Password should contain at least 1 lowercase letter',
  })
  .regex(/[A-Z]/, {
    message: 'Password should contain at least 1 uppercase letter',
  })
  .regex(/[0-9]/, { message: 'Password should contain at least 1 number' })
  .regex(/[\W_]/, {
    message: 'Password should contain at least 1 special character',
  });

export const zodUserSchema = z.object({
  email: z.string().email(),
  username: z.string().min(4),
  password: zodPasswordType,
  loginAttempt: z.number().max(3).optional(),
  locked: z.boolean().optional(),
  resetPasswordToken: z.string().optional(),
  resetPasswordExpires: z.date().optional(),
  avatar: z.string().optional(),
});

export type UserSchemaType = z.infer<typeof zodUserSchema>;

export interface IUserDocument
  extends UserSchemaType,
    Document<{
      _id: Types.ObjectId;
      createdAt: Date;
      updatedAt: Date;
    }> {}

const UserSchema = new Schema<IUserDocument>(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: false, minlength: 4 },
    password: { type: String, required: true, minlength: 8 },
    loginAttempt: { type: Number, required: false, default: 0, max: 3 },
    locked: { type: Boolean, default: false },
    resetPasswordToken: { type: String, required: false },
    resetPasswordExpires: { type: Date, required: false },
    avatar: { type: String, required: false },
  },
  { timestamps: true }
);

UserSchema.statics.getUsers = async function () {
  return await this.find().select('-password -company');
};

UserSchema.statics.createUser = async function (createFields: IUserDocument) {
  return await this.create(createFields);
};

UserSchema.statics.getUserByEmail = async function (email: string) {
  return await this.findOne({ email });
};

UserSchema.statics.updateUser = async function (id: string, updateFields: Partial<UserSchemaType>) {
  return await this.findOneAndUpdate({ _id: id }, updateFields, { new: true });
};

UserSchema.statics.deleteUser = async function (id: string) {
  return await this.findOneAndDelete({ _id: id });
};

UserSchema.statics.getUserByToken = async (token: string) => {
  return await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });
};

UserSchema.statics.failedLogin = async function (id: string) {
  const user = await this.findById(id);

  user.loginAttempt += 1;

  if (user.loginAttempt >= MAX_LOGIN_ATTEMPT) user.locked = true;

  await user.save();

  return user;
};

UserSchema.statics.unlockAccount = async function (id: string) {
  return await this.findByIdAndUpdate(id, { $set: { loginAttempt: 0, locked: false } }, { new: true });
};

export interface IUserModel extends Model<IUserDocument> {
  getUsers(): Promise<IUserDocument[]>;
  createUser(args: UserSchemaType): Promise<IUserDocument>;
  getUserByEmail(email: string): Promise<IUserDocument>;
  getUserByToken(token: string): Promise<IUserDocument>;
  updateUser(id: string, updateFields: Partial<UserSchemaType>): Promise<IUserDocument>;
  deleteUser(id: string): Promise<IUserDocument>;
  failedLogin(id: string): Promise<IUserDocument>;
  unlockAccount(id: string): Promise<IUserDocument>;
}

export const User = model<IUserDocument, IUserModel>('User', UserSchema);

export const CreateUserSchema = z.object({
  body: z
    .object({
      ...zodUserSchema.shape,
    })
    .strict(),
});

export type CreateUserRequest = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = z.object({
  params: z
    .object({
      id: z.string({ required_error: 'id is required' }),
    })
    .strict(),
  body: zodUserSchema.partial(),
});

export const ResetPasswordSchema = z.object({
  params: z
    .object({
      token: z.string({ required_error: 'token is required' }),
    })
    .strict(),
  body: zodUserSchema.partial(),
});

export const DeleteUserSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'id is required' }),
  }),
});
