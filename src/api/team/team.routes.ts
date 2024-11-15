import type { Request, Response } from 'express';
import express from 'express';
import type { ObjectId } from 'mongoose';

import { Team } from '@/database/schema/team.schema';
import { isAuthenticated } from '@/middleware';

export const teamRouter = express.Router();

teamRouter
  .post('/create', isAuthenticated, async (req: Request, res: Response) => {
    const creationField = {
      name: req.body.name,
      admin: req.user as ObjectId,
    };
    await Team.createTeam(creationField);
    res.send(creationField);
  })
  .get('/', isAuthenticated, async (_req: Request, res: Response) => {
    const teams = await Team.find().populate('admin', 'username email');
    res.send(teams);
  });
