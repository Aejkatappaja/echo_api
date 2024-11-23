import type { Request, Response } from 'express';
import express from 'express';

import { Board } from '@/database/schema/boards.schema';
import { Column } from '@/database/schema/column.schema';
import { isAuthenticated } from '@/middleware';

export const columnRouter = express.Router();

columnRouter
  .post('/create', isAuthenticated, async (req: Request, res: Response) => {
    const existingBoard = await Board.findById(req.body.board);
    if (!existingBoard) res.send('team doesnt exists');
    const creationField = {
      title: req.body.title,
      board_id: req.body.board,
    };
    await Column.createColumn(creationField);
    res.send(creationField);
  })
  .get('/', isAuthenticated, async (_req: Request, res: Response) => {
    const columns = await Column.find().populate('board_id', 'id').populate('comments');
    res.send(columns);
  });
