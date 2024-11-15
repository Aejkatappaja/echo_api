import type { Request, Response } from 'express';
import express from 'express';

import { Board } from '@/database/schema/boards.schema';
import { Team } from '@/database/schema/team.schema';
import { isAuthenticated } from '@/middleware';

export const boardRouter = express.Router();

boardRouter
  .post('/create', isAuthenticated, async (req: Request, res: Response) => {
    const existingTeam = await Team.findById(req.body.team);
    if (!existingTeam) res.send('team doesnt exists');
    const creationField = {
      name: req.body.name,
      team: req.body.team,
    };
    await Board.createBoard(creationField);
    res.send(creationField);
  })
  .get('/', isAuthenticated, async (_req: Request, res: Response) => {
    const teams = await Board.find().populate('team', 'name');
    res.send(teams);
  });
