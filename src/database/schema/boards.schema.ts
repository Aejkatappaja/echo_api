import type { Document, Model, Types } from 'mongoose';
import { model, Schema } from 'mongoose';
import { z } from 'zod';

export const zodBoardSchema = z.object({
  name: z.string().min(3),
  team: z.instanceof(Schema.Types.ObjectId),
  columns: z.array(z.instanceof(Schema.Types.ObjectId)).optional(),
});

export type BoardSchemaType = z.infer<typeof zodBoardSchema>;

export interface IBoardDocument
  extends BoardSchemaType,
    Document<{
      _id: Types.ObjectId;
      createdAt: Date;
      updatedAt: Date;
    }> {}

const BoardSchema = new Schema<IBoardDocument>({
  name: { type: String, required: true },
  team: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  columns: [{ type: Schema.Types.ObjectId, ref: 'Column', required: false }],
});

BoardSchema.statics.createBoard = async function (createFields: IBoardDocument) {
  return await this.create(createFields);
};

export interface IBoardModel extends Model<IBoardDocument> {
  createBoard(args: BoardSchemaType): Promise<IBoardDocument>;
}

export const Board = model<IBoardDocument, IBoardModel>('Board', BoardSchema);
