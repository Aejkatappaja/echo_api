import type { Document, Model, Types } from 'mongoose';
import { model, Schema } from 'mongoose';
import { z } from 'zod';

const zodPasswordType = z
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
  },
  { timestamps: true }
);

UserSchema.statics.getUsers = async function () {
  return await this.find();
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

interface IUserModel extends Model<IUserDocument> {
  getUsers(): Promise<IUserDocument[]>;
  createUser(args: UserSchemaType): Promise<IUserDocument>;
  getUserByEmail(id: string): Promise<IUserDocument>;
  updateUser(id: string, updateFields: Partial<UserSchemaType>): Promise<IUserDocument>;
  deleteUser(id: string): Promise<IUserDocument>;
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

export const DeleteUserSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'id is required' }),
  }),
});
