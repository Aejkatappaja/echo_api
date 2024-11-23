import type { Request, Response } from 'express';
import express from 'express';

import { Board } from '@/database/schema/boards.schema';
import { Team } from '@/database/schema/team.schema';
import { isAuthenticated } from '@/middleware';

export const boardRouter = express.Router();

boardRouter
  .post('/create', isAuthenticated, async (req: Request, res: Response) => {
    const existingTeam = await Team.findById(req.body.team_id);
    if (!existingTeam) res.send('team doesnt exists');
    const creationField = {
      name: req.body.name,
      team_id: req.body.team_id,
    };
    await Board.createBoard(creationField);
    res.send(creationField);
  })
  .get('/', isAuthenticated, async (_req: Request, res: Response) => {
    const teams = await Board.find().populate('team_id', 'name');
    res.send(teams);
  });
