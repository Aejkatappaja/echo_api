import type { Request, Response } from 'express';
import express from 'express';
import type { ObjectId } from 'mongoose';

import { Column } from '@/database/schema/column.schema';
import { Comment } from '@/database/schema/comment.schema';
import { isAuthenticated } from '@/middleware';

export const commentRouter = express.Router();

commentRouter
  .post('/create', isAuthenticated, async (req: Request, res: Response) => {
    const existingColumn = await Column.findById(req.body.column);
    if (!existingColumn) res.send('column doesnt exists');
    const creationField = {
      content: req.body.content,
      column: req.body.column,
      author: req.user as ObjectId,
    };
    await Comment.createComment(creationField);
    res.send(creationField);
  })
  .get('/', isAuthenticated, async (_req: Request, res: Response) => {
    const comments = await Comment.find()
      .populate({ path: 'column', select: 'id' })
      .populate({ path: 'author', select: 'username' });
    res.send(comments);
  });
