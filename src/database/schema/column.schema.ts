import type { Document, Model, Types } from 'mongoose';
import { model, Schema } from 'mongoose';
import { z } from 'zod';

export const zodColumnSchema = z.object({
  title: z.string().min(3),
  board: z.instanceof(Schema.Types.ObjectId),
  comments: z.array(z.instanceof(Schema.Types.ObjectId)).optional(),
});

export type ColumnSchemaType = z.infer<typeof zodColumnSchema>;

export interface IColumnDocument
  extends ColumnSchemaType,
    Document<{
      _id: Types.ObjectId;
      createdAt: Date;
      updatedAt: Date;
    }> {}

const ColumnSchema = new Schema<IColumnDocument>({
  title: { type: String, required: true },
  board: { type: Schema.Types.ObjectId, ref: 'Board', required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment', required: false }],
});

ColumnSchema.statics.createColumn = async function (createFields: IColumnDocument) {
  return await this.create(createFields);
};

export interface IColumnModel extends Model<IColumnDocument> {
  createColumn(args: ColumnSchemaType): Promise<IColumnDocument>;
}

export const Column = model<IColumnDocument, IColumnModel>('Column', ColumnSchema);
