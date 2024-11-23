import type { Document, Model, Types } from 'mongoose';
import { model, Schema } from 'mongoose';
import { z } from 'zod';

export const zodTeamSchema = z.object({
  name: z.string().min(3),
  admin: z.instanceof(Schema.Types.ObjectId),
  members: z.array(z.instanceof(Schema.Types.ObjectId)).optional(),
  boards: z.array(z.instanceof(Schema.Types.ObjectId)).optional(),
});

export type TeamSchemaType = z.infer<typeof zodTeamSchema>;

export interface ITeamDocument
  extends TeamSchemaType,
    Document<{
      _id: Types.ObjectId;
      createdAt: Date;
      updatedAt: Date;
    }> {}

const TeamSchema = new Schema<ITeamDocument>({
  name: { type: String, required: true },
  admin: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: { type: [Schema.Types.ObjectId], ref: 'User', required: false },
  boards: { type: [Schema.Types.ObjectId], ref: 'Board', required: false },
});

TeamSchema.statics.createTeam = async function (createFields: ITeamDocument) {
  return await this.create(createFields);
};

export interface ITeamModel extends Model<ITeamDocument> {
  createTeam(args: TeamSchemaType): Promise<ITeamDocument>;
}

export const Team = model<ITeamDocument, ITeamModel>('Team', TeamSchema);
