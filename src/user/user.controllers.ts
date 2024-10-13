import type { Request, Response } from 'express';

import { User } from '@/database/schema';

class UserController {
  public async createUser(req: Request, res: Response) {
    const { email, username, password, company } = req.body;
    try {
      const newUser = await User.createUser({ email, username, password, company });
      console.log(newUser);
      res.status(200).json(newUser);
    } catch (e: unknown) {
      console.error(e);
    }
  }
}

export const user_controller = new UserController();
