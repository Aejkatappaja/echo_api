import type { Document, Model, Types } from 'mongoose';
import { model, Schema } from 'mongoose';
import { z } from 'zod';

export const zodColumnSchema = z.object({
  title: z.string().min(3),
  board_id: z.instanceof(Schema.Types.ObjectId),
  comments: z.array(z.instanceof(Schema.Types.ObjectId)).optional(),
  order: z.number().optional(),
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
  board_id: { type: Schema.Types.ObjectId, ref: 'Board', required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment', required: false }],
  order: { type: Number, required: false },
});

ColumnSchema.index({ board_id: 1, order: -1 });

ColumnSchema.statics.createColumn = async function (createFields: IColumnDocument): Promise<IColumnDocument> {
  const columns = await Column.find({ board_id: createFields.board_id }).sort({ order: -1 }).limit(1).select('order');

  const maxOrder = columns.length ? columns[0].order : 0;

  const newColumn = new Column({ ...createFields, order: maxOrder ? maxOrder + 1 : 1 });

  return await newColumn.save();
};

export interface IColumnModel extends Model<IColumnDocument> {
  createColumn(args: ColumnSchemaType): Promise<IColumnDocument>;
}

export const Column = model<IColumnDocument, IColumnModel>('Column', ColumnSchema);
