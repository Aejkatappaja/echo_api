import type { Document, Model } from 'mongoose';
import { model, Schema } from 'mongoose';
import { z } from 'zod';

export const _ZodUserSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(6),
  company: z.string(),
});

type UserSchemaType = z.infer<typeof _ZodUserSchema>;

interface IUserDocument extends UserSchemaType, Document {
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    company: { type: String, required: true },
  },
  { timestamps: true },
);

UserSchema.statics.createUser = async function (args: IUserDocument) {
  return this.create(args);
};

UserSchema.statics.updateUser = async function (id: string, updateFields: Partial<UserSchemaType>) {
  return this.findOneAndUpdate({ _id: id }, updateFields, { new: true });
};

UserSchema.statics.deleteUser = async function (id: string) {
  return this.findOneAndDelete({ _id: id });
};

interface IUserModel extends Model<IUserDocument> {
  createUser(args: UserSchemaType): Promise<IUserDocument>;
  updateUser(id: string, updateFields: Partial<UserSchemaType>): Promise<IUserDocument>;
  deleteUser(id: string): Promise<IUserDocument>;
}

export const User = model<IUserDocument, IUserModel>('User', UserSchema);
