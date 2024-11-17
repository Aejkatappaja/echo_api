import type { Document, Model, Types } from 'mongoose';
import { model, Schema } from 'mongoose';
import { z } from 'zod';

import { Column } from './column.schema';

export const zodCommentSchema = z.object({
  content: z.string(),
  column: z.instanceof(Schema.Types.ObjectId),
  author: z.instanceof(Schema.Types.ObjectId),
});

export type CommentSchemaType = z.infer<typeof zodCommentSchema>;

export interface ICommentDocument
  extends CommentSchemaType,
    Document<{
      _id: Types.ObjectId;
      createdAt: Date;
      updatedAt: Date;
    }> {}

const CommentSchema = new Schema<ICommentDocument>({
  content: { type: String, required: true },
  column: { type: Schema.Types.ObjectId, ref: 'Column', required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

CommentSchema.statics.createComment = async function (createFields: ICommentDocument) {
  const comment = await this.create(createFields);

  const column = await Column.findById(createFields.column);
  if (column) {
    column.comments!.push(comment.id);
    await column.save();
  }

  return comment;
};

export interface ICommentModel extends Model<ICommentDocument> {
  createComment(args: CommentSchemaType): Promise<ICommentDocument>;
}

export const Comment = model<ICommentDocument, ICommentModel>('Comment', CommentSchema);
